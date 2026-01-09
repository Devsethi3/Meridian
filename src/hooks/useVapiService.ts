// hooks/useVapiService.ts
"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import type {
  InterviewInfo,
  ConnectionStatus,
  VapiMessage,
  VapiErrorEvent,
  VapiAssistantConfig,
  TranscriptMessage,
} from "@/lib/types";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

// ============================================
// Types for this hook
// ============================================

interface UseVapiServiceProps {
  interviewInfo: InterviewInfo | null;
  onCallEnd: (conversation: TranscriptMessage[]) => void;
}

interface UseVapiServiceReturn {
  isCallActive: boolean;
  conversation: TranscriptMessage[];
  isMuted: boolean;
  transcript: TranscriptMessage[];
  currentTranscript: string;
  callDuration: number;
  connectionStatus: ConnectionStatus;
  isProcessingFeedback: boolean;
  hasCallEnded: boolean;
  isAssistantSpeaking: boolean;
  isUserSpeaking: boolean;
  errorMessage: string | null;
  startInterview: () => void;
  stopInterview: () => void;
  toggleMute: () => void;
}

// ============================================
// Helper Functions
// ============================================

const generateMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

type ContentItem = {
  type: string;
  text: string;
  [key: string]: any;
};

type ConversationMessage = {
  role: "assistant" | "user" | "system";
  content?: string | ContentItem[];
  text?: string;
};

type VapiConversationMessage = {
  role: "assistant" | "user" | "system";
  content?: string | ContentItem[];
  text?: string;
};

// ============================================
// Main Hook
// ============================================

export const useVapiService = ({
  interviewInfo,
  onCallEnd,
}: UseVapiServiceProps): UseVapiServiceReturn => {
  // ============================================
  // State
  // ============================================
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [isProcessingFeedback, setIsProcessingFeedback] = useState(false);
  const [hasCallEnded, setHasCallEnded] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ============================================
  // Refs
  // ============================================
  const vapiRef = useRef<Vapi | null>(null);
  const callStartTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const conversationRef = useRef<TranscriptMessage[]>([]);
  const messageIdsRef = useRef<Set<string>>(new Set());
  const userSpeakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================
  // Derived values from interviewInfo
  // ============================================
  const userName = interviewInfo?.userName ?? "there";
  const jobPosition = interviewInfo?.jobPosition ?? "the position";
  const questionList = useMemo(() => {
    if (!interviewInfo?.questionList) return "";
    return interviewInfo.questionList
      .map((item) => item.question)
      .filter(Boolean)
      .join(", ");
  }, [interviewInfo?.questionList]);
  interface ExtendedVapiAssistantConfig extends VapiAssistantConfig {}

  // ============================================
  // Assistant Configuration
  // ============================================
  const assistantConfig: CreateAssistantDTO = useMemo(
    () => ({
      name: "AI Recruiter",
      firstMessage: `Hi ${userName}, how are you doing today? I'm excited to chat with you about the ${jobPosition} position. Are you ready to get started?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel - professional female voice
        stability: 0.5,
        similarityBoost: 0.75,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
You are a friendly and professional AI interviewer conducting a ${jobPosition} interview.

IMPORTANT INSTRUCTIONS:
1. Start with a warm greeting and ask if the candidate is ready
2. Ask ONE question at a time from this list: ${
              questionList ||
              "general interview questions about their experience and skills"
            }
3. Wait for the candidate to respond completely before asking the next question
4. Provide brief, encouraging feedback after each answer like "Great!", "That's a good point", "Interesting perspective"
5. Be conversational and natural
6. If the candidate struggles, offer hints or rephrase the question
7. After 4-5 questions, wrap up the interview positively
8. Keep your responses concise and spoken-word friendly

Remember: You're having a natural conversation, not reading a script. Be warm and encouraging!
          `.trim(),
          },
        ],
      },
      endCallPhrases: ["goodbye", "bye", "end interview", "that's all"],
      silenceTimeoutSeconds: 30,
      maxDurationSeconds: 1800, // 30 minutes
    }),
    [userName, jobPosition, questionList]
  );

  // ============================================
  // Timer Functions
  // ============================================
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    callStartTimeRef.current = Date.now();
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
    callStartTimeRef.current = null;
  }, []);

  // ============================================
  // Message Handling
  // ============================================
  const addMessage = useCallback((role: "assistant" | "user", text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const id = generateMessageId();

    // Prevent duplicates
    if (messageIdsRef.current.has(id)) return;

    // Check for duplicate text in recent messages
    const recentMessages = conversationRef.current.slice(-3);
    const isDuplicate = recentMessages.some(
      (m) => m.role === role && m.text === trimmedText
    );
    if (isDuplicate) return;

    messageIdsRef.current.add(id);

    const newMessage: TranscriptMessage = {
      id,
      role,
      text: trimmedText,
      timestamp: Date.now(),
    };

    conversationRef.current = [...conversationRef.current, newMessage];
    setTranscript((prev) => [...prev, newMessage]);

    console.log(
      `[VapiService] Added message (${role}):`,
      trimmedText.substring(0, 50)
    );
  }, []);

  // ============================================
  // Cleanup Function
  // ============================================
  const cleanupVapi = useCallback(() => {
    console.log("[VapiService] Cleaning up...");

    if (vapiRef.current) {
      try {
        vapiRef.current.removeAllListeners();
        vapiRef.current.stop();
      } catch (error) {
        console.log("[VapiService] Cleanup error (ignored):", error);
      }
      vapiRef.current = null;
    }

    stopTimer();

    if (userSpeakingTimeoutRef.current) {
      clearTimeout(userSpeakingTimeoutRef.current);
      userSpeakingTimeoutRef.current = null;
    }

    setIsCallActive(false);
    setConnectionStatus("disconnected");
    setIsAssistantSpeaking(false);
    setIsUserSpeaking(false);
  }, [stopTimer]);

  // ============================================
  // Generate Feedback
  // ============================================
  const generateFeedback = useCallback(async () => {
    if (isProcessingFeedback || hasCallEnded) {
      console.log("[VapiService] Skipping feedback - already processed");
      return;
    }

    const conversation = conversationRef.current;

    if (!conversation || conversation.length === 0) {
      console.log("[VapiService] No conversation to generate feedback");
      toast.error("No conversation recorded. Unable to generate feedback.");
      return;
    }

    console.log(
      "[VapiService] Generating feedback for",
      conversation.length,
      "messages"
    );

    setIsProcessingFeedback(true);
    setHasCallEnded(true);

    try {
      await onCallEnd(conversation);
    } catch (error) {
      console.error("[VapiService] Error in feedback generation:", error);
      toast.error("Failed to generate feedback");
    } finally {
      setIsProcessingFeedback(false);
    }
  }, [isProcessingFeedback, hasCallEnded, onCallEnd]);

  // ============================================
  // Start Interview
  // ============================================
  const startInterview = useCallback(() => {
    if (!interviewInfo?.questionList) {
      toast.error("No interview questions available");
      return;
    }

    if (isCallActive) {
      toast.warning("Interview is already in progress");
      return;
    }

    if (hasCallEnded) {
      toast.warning("Interview has already ended");
      return;
    }

    if (isProcessingFeedback) {
      toast.warning("Please wait, processing feedback...");
      return;
    }

    if (!vapiRef.current) {
      toast.error("Voice service not initialized. Please refresh the page.");
      return;
    }

    console.log("[VapiService] Starting interview...");
    setConnectionStatus("connecting");
    setErrorMessage(null);

    try {
      // Cast to any to bypass TypeScript strict checking for Vapi SDK
      vapiRef.current.start(assistantConfig);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to start interview";
      console.error("[VapiService] Error starting call:", error);
      setConnectionStatus("disconnected");
      setErrorMessage(errorMsg);
      toast.error("Failed to start interview");
    }
  }, [
    interviewInfo,
    isCallActive,
    hasCallEnded,
    isProcessingFeedback,
    assistantConfig,
  ]);

  // ============================================
  // Stop Interview
  // ============================================
  const stopInterview = useCallback(() => {
    if (isProcessingFeedback) {
      toast.warning("Please wait, processing feedback...");
      return;
    }

    console.log("[VapiService] Stopping interview...");
    console.log("[VapiService] Current conversation:", conversationRef.current);

    try {
      if (vapiRef.current && isCallActive) {
        vapiRef.current.stop();
      }

      setCallDuration(0);
      setIsCallActive(false);
      setConnectionStatus("disconnected");

      if (!hasCallEnded && conversationRef.current.length > 0) {
        toast.info("Generating feedback...");
        generateFeedback();
      }
    } catch (error: unknown) {
      console.error("[VapiService] Error stopping interview:", error);
      toast.error("Failed to end interview properly");
    }
  }, [isCallActive, isProcessingFeedback, hasCallEnded, generateFeedback]);

  // ============================================
  // Toggle Mute
  // ============================================
  const toggleMute = useCallback(() => {
    if (!vapiRef.current || !isCallActive) return;

    try {
      const newMutedState = !isMuted;
      vapiRef.current.setMuted(newMutedState);
      setIsMuted(newMutedState);
      toast.info(newMutedState ? "Microphone muted" : "Microphone unmuted");
    } catch (error) {
      console.error("[VapiService] Error toggling mute:", error);
    }
  }, [isMuted, isCallActive]);

  // ============================================
  // Message Handlers (defined outside useEffect to avoid recreation)
  // ============================================
  const handleTranscript = useCallback(
    (message: VapiMessage) => {
      const role = message.role;
      const text = message.transcript || "";
      const type = message.transcriptType;

      if (!role || !text) return;

      if (type === "partial") {
        setCurrentTranscript(text);
        if (role === "user") {
          setIsUserSpeaking(true);
        }
      } else {
        // Final transcript
        addMessage(role as "assistant" | "user", text);
        setCurrentTranscript("");
        if (role === "user") {
          setIsUserSpeaking(false);
        }
      }
    },
    [addMessage]
  );

  const handleConversationUpdate = useCallback(
    (message: VapiMessage) => {
      if (!message.conversation || !Array.isArray(message.conversation)) return;

      console.log(
        "[VapiService] Conversation update:",
        message.conversation.length,
        "messages"
      );

      message.conversation.forEach((msg) => {
        if (msg.role === "system") return;

        const role = msg.role as "assistant" | "user";

        let text = "";

        // Normalize content safely
        if (typeof msg.content === "string") {
          text = msg.content;
        } else if (Array.isArray(msg.content)) {
          // msg.content is ContentItem[] from '@/lib/types'
          text = msg.content.map((item) => item.text).join(" ");
        } else if (msg.text) {
          text = msg.text;
        }

        if (role && text) addMessage(role, text);
      });
    },
    [addMessage]
  );

  const handleStatusUpdate = useCallback((message: VapiMessage) => {
    console.log("[VapiService] Status update:", message.status);

    if (message.status === "ended" && message.endedReason) {
      console.log("[VapiService] End reason:", message.endedReason);

      // Check for voice provider errors
      if (
        message.endedReason.includes("playht") ||
        message.endedReason.includes("timeout") ||
        message.endedReason.includes("error")
      ) {
        setErrorMessage(`Call ended: ${message.endedReason}`);
        toast.error("Voice service error. Please try again.");
      }
    }
  }, []);

  // ============================================
  // Initialize Vapi
  // ============================================
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) {
      console.log("[VapiService] Already initialized, skipping...");
      return;
    }

    if (!interviewInfo) {
      console.log("[VapiService] No interview info, skipping initialization");
      return;
    }

    const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

    if (!vapiKey) {
      console.error("[VapiService] No Vapi key found");
      setErrorMessage("Voice service not configured");
      return;
    }

    console.log("[VapiService] Initializing Vapi...");
    isInitializedRef.current = true;

    // Clean up any existing instance
    cleanupVapi();

    // Reset state
    setTranscript([]);
    conversationRef.current = [];
    messageIdsRef.current.clear();
    setHasCallEnded(false);
    setIsProcessingFeedback(false);
    setErrorMessage(null);

    try {
      // Initialize new Vapi instance
      const vapi = new Vapi(vapiKey);
      vapiRef.current = vapi;

      // ============================================
      // Event Listeners
      // ============================================

      // Call Start
      vapi.on("call-start", () => {
        console.log("[VapiService] ✅ Call started");
        setIsCallActive(true);
        setConnectionStatus("connected");
        setErrorMessage(null);
        startTimer();
        toast.success("Connected! Interview starting...");
      });

      // Call End
      vapi.on("call-end", () => {
        console.log("[VapiService] 📴 Call ended");
        console.log(
          "[VapiService] Final conversation:",
          conversationRef.current
        );

        setIsCallActive(false);
        setConnectionStatus("disconnected");
        setIsAssistantSpeaking(false);
        setIsUserSpeaking(false);
        stopTimer();

        // Generate feedback if we have conversation
        if (!hasCallEnded && conversationRef.current.length > 0) {
          toast.info("Interview ended - Generating feedback...");
          generateFeedback();
        }
      });

      // Speech Start (Assistant speaking)
      vapi.on("speech-start", () => {
        console.log("[VapiService] 🔊 Assistant speaking");
        setIsAssistantSpeaking(true);
        setCurrentTranscript("");
      });

      // Speech End (Assistant stopped)
      vapi.on("speech-end", () => {
        console.log("[VapiService] 🔇 Assistant stopped speaking");
        setIsAssistantSpeaking(false);
      });

      // Volume Level (for user speaking detection)
      vapi.on("volume-level", (volume: number) => {
        const isSpeaking = volume > 0.1;

        if (isSpeaking) {
          setIsUserSpeaking(true);

          // Clear existing timeout
          if (userSpeakingTimeoutRef.current) {
            clearTimeout(userSpeakingTimeoutRef.current);
          }

          // Set new timeout
          userSpeakingTimeoutRef.current = setTimeout(() => {
            setIsUserSpeaking(false);
          }, 500);
        }
      });

      // Message Handler
      vapi.on("message", (message: VapiMessage) => {
        console.log("[VapiService] 📨 Message:", message.type);

        switch (message.type) {
          case "transcript":
            handleTranscript(message);
            break;

          case "conversation-update":
            handleConversationUpdate(message);
            break;

          case "status-update":
            handleStatusUpdate(message);
            break;

          default:
            // Try to extract any transcript from unknown message types
            if (message.transcript && message.role) {
              const role = message.role === "assistant" ? "assistant" : "user";
              if (
                message.transcriptType === "final" ||
                !message.transcriptType
              ) {
                addMessage(role, message.transcript);
              } else {
                setCurrentTranscript(message.transcript);
              }
            }
            break;
        }
      });

      // Error Handler
      vapi.on("error", (error: VapiErrorEvent) => {
        console.error("[VapiService] ❌ Error:", error);
        const message =
          error?.message || error?.error?.message || "An error occurred";
        setErrorMessage(message);
        setConnectionStatus("disconnected");
        toast.error(`Error: ${message}`);
      });

      console.log("[VapiService] ✅ Initialized successfully");

      // Auto-start the call
      const autoStartTimeout = setTimeout(() => {
        if (vapiRef.current && !isCallActive && !hasCallEnded) {
          console.log("[VapiService] Auto-starting call...");
          startInterview();
        }
      }, 500);

      // Return cleanup for the timeout
      return () => {
        clearTimeout(autoStartTimeout);
      };
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to initialize voice service";
      console.error("[VapiService] Initialization error:", error);
      setErrorMessage(errorMsg);
      isInitializedRef.current = false;
    }

    // Cleanup on unmount
    return () => {
      console.log("[VapiService] Component unmounting, cleaning up...");
      cleanupVapi();
      isInitializedRef.current = false;
    };
  }, [
    interviewInfo,
    cleanupVapi,
    startTimer,
    stopTimer,
    handleTranscript,
    handleConversationUpdate,
    handleStatusUpdate,
    addMessage,
    generateFeedback,
    hasCallEnded,
    isCallActive,
    startInterview,
  ]);

  // ============================================
  // Return Values
  // ============================================
  return {
    isCallActive,
    conversation: transcript,
    isMuted,
    transcript,
    currentTranscript,
    callDuration,
    connectionStatus,
    isProcessingFeedback,
    hasCallEnded,
    isAssistantSpeaking,
    isUserSpeaking,
    errorMessage,
    startInterview,
    stopInterview,
    toggleMute,
  };
};
