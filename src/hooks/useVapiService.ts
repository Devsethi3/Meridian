// hooks/useVapiService.ts
import { useCallback, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import {
  VapiEvent,
  VapiMessage,
  InterviewInfo,
  ConnectionStatus,
} from "@/lib/types";

interface UseVapiServiceProps {
  interviewInfo: InterviewInfo | null;
  onCallEnd: (conversation: string) => void;
}

export const useVapiService = ({
  interviewInfo,
  onCallEnd,
}: UseVapiServiceProps) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [conversation, setConversation] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [isProcessingFeedback, setIsProcessingFeedback] = useState(false);
  const [hasCallEnded, setHasCallEnded] = useState(false);

  const vapiRef = useRef<any>(null);
  const callStartTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      if (callStartTimeRef.current) {
        setCallDuration(
          Math.floor((Date.now() - callStartTimeRef.current) / 1000)
        );
      }
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const generateFeedback = useCallback(async () => {
    if (isProcessingFeedback || hasCallEnded) return;

    setIsProcessingFeedback(true);
    setHasCallEnded(true);

    try {
      await onCallEnd(conversation);
    } catch (error) {
      console.error("Error in feedback generation:", error);
    } finally {
      setIsProcessingFeedback(false);
    }
  }, [conversation, onCallEnd, isProcessingFeedback, hasCallEnded]);

  const cleanupVapi = useCallback(() => {
    if (vapiRef.current) {
      try {
        // Remove all event listeners
        vapiRef.current.removeAllListeners();
        // Stop any active calls
        if (isCallActive) {
          vapiRef.current.stop();
        }
      } catch (error) {
        console.error("Error cleaning up Vapi:", error);
      }
      vapiRef.current = null;
    }
    stopTimer();
    setIsCallActive(false);
    setConnectionStatus("disconnected");
  }, [isCallActive, stopTimer]);

  const startCall = useCallback(() => {
    if (
      !interviewInfo?.questionList ||
      isCallActive ||
      hasCallEnded ||
      isProcessingFeedback
    ) {
      return;
    }

    setConnectionStatus("connecting");
    const questionList = interviewInfo.questionList
      .map((item) => item.question)
      .join(", ");

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo.userName}, how are you? Ready for your interview on ${interviewInfo.jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.
Example:
"Hey there! Welcome to your ${interviewInfo.jobPosition} interview. Let's get started with a few questions!"
Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below are the questions, ask one by one:
Questions: ${questionList}
If the candidate struggles, offer hints or rephrase the question without giving away the answer. 
Example: "Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. 
Example: "Nice! That's a solid understanding of state management." or "Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. 
Example: "That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note: 
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
✅ Be friendly, engaging, and witty 😊
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate's confidence level
✅ Ensure the interview remains focused on React`.trim(),
          },
        ],
      },
    };

    try {
      vapiRef.current?.start(assistantOptions);
    } catch (error) {
      console.error("Error starting call:", error);
      setConnectionStatus("disconnected");
      toast.error("Failed to start interview");
    }
  }, [interviewInfo, isCallActive, hasCallEnded, isProcessingFeedback]);

  const stopInterview = useCallback(() => {
    if (isProcessingFeedback || hasCallEnded) return;

    try {
      if (vapiRef.current && isCallActive) {
        vapiRef.current.stop();
      }
      setCallDuration(0);
      setIsCallActive(false);
      setConnectionStatus("disconnected");
      setHasCallEnded(true);
      toast.success("Interview ended successfully");
    } catch (error) {
      console.error("Error stopping interview:", error);
      toast.error("Failed to end interview properly");
    }
  }, [isCallActive, isProcessingFeedback, hasCallEnded]);

  const toggleMute = useCallback(() => {
    if (vapiRef.current && isCallActive) {
      try {
        vapiRef.current.setMuted(!isMuted);
        setIsMuted(!isMuted);
      } catch (error) {
        console.error("Error toggling mute:", error);
      }
    }
  }, [isMuted, isCallActive]);

  // Initialize Vapi and set up event listeners
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current || !interviewInfo) return;

    isInitializedRef.current = true;

    // Clean up any existing instance
    cleanupVapi();

    // Initialize new Vapi instance
    vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);

    // Set up event listeners
    vapiRef.current.on("call-start", () => {
      console.log("Call started");
      setIsCallActive(true);
      setConnectionStatus("connected");
      callStartTimeRef.current = Date.now();
      startTimer();
    });

    vapiRef.current.on("call-end", () => {
      console.log("Call ended");
      setIsCallActive(false);
      setConnectionStatus("disconnected");
      callStartTimeRef.current = null;
      stopTimer();

      // Only generate feedback if we haven't already done so
      if (!hasCallEnded && !isProcessingFeedback && conversation) {
        toast.info("Interview Ended - Generating feedback...");
        generateFeedback();
      }
    });

    vapiRef.current.on("speech-start", () => {
      setCurrentTranscript("");
    });

    vapiRef.current.on("speech-end", (e: VapiEvent) => {
      if (e?.transcript) {
        setTranscript((prev) => [...prev, `You: ${e.transcript}`]);
        setCurrentTranscript("");
      }
    });

    vapiRef.current.on("message", (e: VapiMessage) => {
      if (e?.type === "transcript" && e?.transcript) {
        if (e.role === "assistant") {
          setTranscript((prev) => [...prev, `AI: ${e.transcript}`]);
        } else if (e.role === "user") {
          setCurrentTranscript(e.transcript);
        }
      }
    });

    vapiRef.current.on("message", (message: VapiMessage) => {
      if (message?.conversation) {
        setConversation(message.conversation);
      }
    });

    vapiRef.current.on("error", (e: any) => {
      console.error("Vapi error:", e);
      setConnectionStatus("disconnected");
      // Don't restart call on error
    });

    // Start the call once
    startCall();

    // Cleanup function
    return () => {
      cleanupVapi();
      isInitializedRef.current = false;
    };
  }, [interviewInfo]); // Only depend on interviewInfo

  // Separate effect for cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupVapi();
    };
  }, [cleanupVapi]);

  return {
    isCallActive,
    conversation,
    isMuted,
    transcript,
    currentTranscript,
    callDuration,
    connectionStatus,
    isProcessingFeedback,
    hasCallEnded,
    stopInterview,
    toggleMute,
  };
};
