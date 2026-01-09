// hooks/useVapiInterview.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";

// Types
export type CallStatus =
  | "idle"
  | "connecting"
  | "in-call"
  | "ending"
  | "ended"
  | "error";

export interface TranscriptMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: number;
}

type Role = "assistant" | "user";

// Vapi message types
interface VapiMessageContent {
  text?: string;
  content?: string;
  transcript?: string;
}

interface VapiConversationMessage {
  id?: string;
  role?: string;
  text?: string;
  content?: string | VapiMessageContent[];
  transcript?: string;
  message?: VapiConversationMessage;
}

interface VapiTranscriptMessage {
  type: "transcript";
  role?: string;
  transcript?: string;
  text?: string;
  transcriptType?: "partial" | "final";
}

interface VapiConversationUpdateMessage {
  type: "conversation-update";
  conversation?: VapiConversationMessage[];
}

interface VapiSpeechUpdateMessage {
  type: "speech-update";
  status?: "started" | "stopped";
}

interface VapiGenericMessage {
  type?: string;
  id?: string;
  role?: string;
  speaker?: string;
  from?: string;
  text?: string;
  content?: string;
  transcript?: string;
  message?: VapiConversationMessage;
  conversation?: VapiConversationMessage[];
}

type VapiMessage =
  | VapiTranscriptMessage
  | VapiConversationUpdateMessage
  | VapiSpeechUpdateMessage
  | VapiGenericMessage;

interface VapiError {
  message?: string;
  error?: {
    message?: string;
  };
}

interface UseVapiInterviewReturn {
  callStatus: CallStatus;
  durationSec: number;
  assistantSpeaking: boolean;
  userSpeaking: boolean;
  conversation: TranscriptMessage[];
  transcript: TranscriptMessage[];
  partialAssistant: string;
  partialUser: string;
  errorMsg: string | null;
  isReady: boolean;
  startCall: (assistantOptions: CreateAssistantDTO) => Promise<void>;
  stopCall: () => void;
  resetState: () => void;
}

// Helper to generate unique IDs
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

// Helper to normalize roles
const normalizeRole = (role?: string): Role | undefined => {
  if (!role) return undefined;
  const lower = role.toLowerCase();
  if (["assistant", "bot", "ai", "agent"].includes(lower)) return "assistant";
  if (
    ["user", "client", "human", "speaker", "caller", "customer"].includes(lower)
  )
    return "user";
  return undefined;
};

// Helper to extract text from message
const extractMessageText = (
  msg: VapiConversationMessage | undefined
): string => {
  if (!msg) return "";

  // Direct text properties
  if (typeof msg.transcript === "string") return msg.transcript;
  if (typeof msg.text === "string") return msg.text;
  if (typeof msg.content === "string") return msg.content;

  // Nested content array
  if (Array.isArray(msg.content)) {
    return msg.content
      .map(
        (c: VapiMessageContent) => c?.text || c?.content || c?.transcript || ""
      )
      .filter(Boolean)
      .join(" ");
  }

  // Nested message object
  if (msg.message && typeof msg.message === "object") {
    return extractMessageText(msg.message);
  }

  return "";
};

export const useVapiInterview = (vapiKey?: string): UseVapiInterviewReturn => {
  // Refs
  const vapiRef = useRef<Vapi | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userSpeakingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const isCleanedUpRef = useRef(false);
  const messageIdsRef = useRef<Set<string>>(new Set());
  const conversationRef = useRef<TranscriptMessage[]>([]);

  // State
  const [isReady, setIsReady] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [partial, setPartial] = useState<{ assistant?: string; user?: string }>(
    {}
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Timer functions
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDurationSec(0);
    timerRef.current = setInterval(() => {
      setDurationSec((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Add message to transcript
  const addMessage = useCallback((role: Role, text: string, msgId?: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const id = msgId || generateId();

    // Prevent duplicates
    if (messageIdsRef.current.has(id)) {
      console.log("[Vapi] Duplicate message ignored:", id);
      return;
    }

    // Also check for duplicate text from same role (last 3 messages)
    const recentMessages = conversationRef.current.slice(-3);
    const isDuplicateText = recentMessages.some(
      (m) => m.role === role && m.text === trimmedText
    );
    if (isDuplicateText) {
      console.log(
        "[Vapi] Duplicate text ignored:",
        trimmedText.substring(0, 50)
      );
      return;
    }

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
      `[Vapi] Message added (${role}):`,
      trimmedText.substring(0, 100)
    );
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    setCallStatus("idle");
    setAssistantSpeaking(false);
    setUserSpeaking(false);
    setDurationSec(0);
    setTranscript([]);
    setPartial({});
    setErrorMsg(null);
    messageIdsRef.current.clear();
    conversationRef.current = [];
    stopTimer();
  }, [stopTimer]);

  // Initialize Vapi
  useEffect(() => {
    if (!vapiKey) {
      console.error("[Vapi] No API key provided");
      setErrorMsg("Missing Vapi public key (NEXT_PUBLIC_VAPI_PUBLIC_KEY)");
      setCallStatus("error");
      return;
    }

    console.log(
      "[Vapi] Initializing with key:",
      vapiKey.substring(0, 10) + "..."
    );

    isCleanedUpRef.current = false;

    try {
      const vapi = new Vapi(vapiKey);
      vapiRef.current = vapi;

      // ===== EVENT HANDLERS =====

      // Call Start
      vapi.on("call-start", () => {
        if (isCleanedUpRef.current) return;
        console.log("[Vapi] ✅ Call started");
        setCallStatus("in-call");
        setAssistantSpeaking(false);
        setUserSpeaking(false);
        setPartial({});
        startTimer();
        toast.success("Connected! The interview is starting...");
      });

      // Call End
      vapi.on("call-end", () => {
        if (isCleanedUpRef.current) return;
        console.log("[Vapi] 📴 Call ended");
        console.log("[Vapi] Final conversation:", conversationRef.current);
        setCallStatus("ended");
        setAssistantSpeaking(false);
        setUserSpeaking(false);
        stopTimer();
        toast.info("Interview ended");
      });

      // Speech Start (Assistant speaking)
      vapi.on("speech-start", () => {
        if (isCleanedUpRef.current) return;
        console.log("[Vapi] 🔊 Assistant speaking");
        setAssistantSpeaking(true);
      });

      // Speech End (Assistant stopped speaking)
      vapi.on("speech-end", () => {
        if (isCleanedUpRef.current) return;
        console.log("[Vapi] 🔇 Assistant stopped speaking");
        setAssistantSpeaking(false);
      });

      // Volume Level (for user speaking detection)
      vapi.on("volume-level", (volume: number) => {
        if (isCleanedUpRef.current) return;
        // User is speaking if volume is above threshold
        const isSpeaking = volume > 0.1;
        setUserSpeaking(isSpeaking);
      });

      // Error
      vapi.on("error", (error: VapiError) => {
        if (isCleanedUpRef.current) return;
        console.error("[Vapi] ❌ Error:", error);
        const message =
          error?.message || error?.error?.message || "An error occurred";
        setErrorMsg(message);
        setCallStatus("error");
        stopTimer();
        toast.error(`Error: ${message}`);
      });

      // Main Message Handler
      vapi.on("message", (message: VapiMessage) => {
        if (isCleanedUpRef.current) return;

        console.log(
          "[Vapi] 📨 Message received:",
          JSON.stringify(message, null, 2)
        );

        const messageType = message?.type || "";

        // Handle different message types
        switch (messageType) {
          case "transcript":
            handleTranscriptMessage(message as VapiTranscriptMessage);
            break;

          case "conversation-update":
            handleConversationUpdate(message as VapiConversationUpdateMessage);
            break;

          case "function-call":
          case "function-call-result":
            console.log("[Vapi] Function call:", messageType);
            break;

          case "hang":
            console.log("[Vapi] Hang detected");
            break;

          case "speech-update":
            handleSpeechUpdate(message as VapiSpeechUpdateMessage);
            break;

          default:
            // Try to extract transcript from unknown message types
            handleGenericMessage(message as VapiGenericMessage);
            break;
        }
      });

      // Helper: Handle transcript messages
      const handleTranscriptMessage = (message: VapiTranscriptMessage) => {
        const role = normalizeRole(message.role);
        const text = message.transcript || message.text || "";
        const transcriptType = message.transcriptType || "";

        console.log(
          `[Vapi] Transcript (${transcriptType}): ${role} - "${text}"`
        );

        if (!role || !text) return;

        if (transcriptType === "partial") {
          setPartial((prev) => ({ ...prev, [role]: text }));

          // Mark user as speaking during partial transcripts
          if (role === "user") {
            setUserSpeaking(true);
            if (userSpeakingTimeoutRef.current) {
              clearTimeout(userSpeakingTimeoutRef.current);
            }
            userSpeakingTimeoutRef.current = setTimeout(() => {
              setUserSpeaking(false);
            }, 1000);
          }
        } else if (transcriptType === "final" || !transcriptType) {
          // It's a final transcript
          addMessage(role, text);
          setPartial((prev) => ({ ...prev, [role]: undefined }));

          if (role === "user") {
            setUserSpeaking(false);
          }
        }
      };

      // Helper: Handle conversation updates
      const handleConversationUpdate = (
        message: VapiConversationUpdateMessage
      ) => {
        const conversation = message.conversation;
        if (!conversation || !Array.isArray(conversation)) return;

        console.log(
          "[Vapi] Conversation update with",
          conversation.length,
          "messages"
        );

        conversation.forEach((msg: VapiConversationMessage) => {
          const role = normalizeRole(msg.role);
          const text = extractMessageText(msg);

          if (role && text) {
            addMessage(role, text, msg.id);
          }
        });
      };

      // Helper: Handle speech updates
      const handleSpeechUpdate = (message: VapiSpeechUpdateMessage) => {
        const status = message.status;
        if (status === "started") {
          setAssistantSpeaking(true);
        } else if (status === "stopped") {
          setAssistantSpeaking(false);
        }
      };

      // Helper: Handle generic/unknown messages
      const handleGenericMessage = (message: VapiGenericMessage) => {
        // Try to find role and text
        const role = normalizeRole(
          message.role || message.speaker || message.from
        );
        const text = extractMessageText(message as VapiConversationMessage);

        if (role && text && text.length > 1) {
          console.log(`[Vapi] Generic message: ${role} - "${text}"`);
          addMessage(role, text, message.id);
        }

        // Check for nested conversation
        if (message.conversation) {
          handleConversationUpdate({
            type: "conversation-update",
            conversation: message.conversation,
          });
        }
      };

      setIsReady(true);
      console.log("[Vapi] ✅ Initialized and ready");
    } catch (error) {
      console.error("[Vapi] Initialization failed:", error);
      setErrorMsg("Failed to initialize voice service");
      setCallStatus("error");
    }

    // Cleanup
    return () => {
      console.log("[Vapi] Cleaning up...");
      isCleanedUpRef.current = true;

      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
          vapiRef.current.removeAllListeners();
        } catch (e) {
          console.log("[Vapi] Cleanup error (ignored):", e);
        }
        vapiRef.current = null;
      }

      stopTimer();

      if (userSpeakingTimeoutRef.current) {
        clearTimeout(userSpeakingTimeoutRef.current);
      }
    };
  }, [vapiKey, startTimer, stopTimer, addMessage]);

  // Start Call
  const startCall = useCallback(
    async (assistantOptions: CreateAssistantDTO) => {
      console.log("[Vapi] Starting call with options:", assistantOptions.name);

      if (!vapiRef.current) {
        const msg = "Voice service not initialized. Please refresh the page.";
        console.error("[Vapi]", msg);
        setErrorMsg(msg);
        setCallStatus("error");
        toast.error(msg);
        return;
      }

      // Reset state
      setErrorMsg(null);
      setCallStatus("connecting");
      setTranscript([]);
      setPartial({});
      setDurationSec(0);
      messageIdsRef.current.clear();
      conversationRef.current = [];

      toast.info("Requesting microphone access...");

      try {
        // Request microphone permission
        console.log("[Vapi] Requesting microphone permission...");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Stop the test stream immediately
        stream.getTracks().forEach((track) => track.stop());
        console.log("[Vapi] ✅ Microphone permission granted");

        toast.info("Connecting to interview...");

        // Start the call
        console.log("[Vapi] Calling vapi.start()...");
        await vapiRef.current.start(assistantOptions);
        console.log("[Vapi] ✅ vapi.start() completed");
      } catch (err: unknown) {
        console.error("[Vapi] Start call error:", err);

        let message = "Failed to start the interview";

        const error = err as { name?: string; message?: string };

        if (
          error?.name === "NotAllowedError" ||
          error?.message?.includes("permission")
        ) {
          message =
            "Microphone permission denied. Please allow microphone access and try again.";
        } else if (error?.name === "NotFoundError") {
          message =
            "No microphone found. Please connect a microphone and try again.";
        } else if (error?.message) {
          message = error.message;
        }

        setCallStatus("error");
        setErrorMsg(message);
        toast.error(message);
        stopTimer();
      }
    },
    [stopTimer]
  );

  // Stop Call
  const stopCall = useCallback(() => {
    console.log("[Vapi] Stopping call...");
    console.log("[Vapi] Current conversation:", conversationRef.current);

    if (!vapiRef.current) {
      console.warn("[Vapi] No vapi instance to stop");
      return;
    }

    setCallStatus("ending");

    try {
      vapiRef.current.stop();
      console.log("[Vapi] ✅ Call stop initiated");
    } catch (err) {
      console.error("[Vapi] Stop error:", err);
      setCallStatus("error");
      toast.error("Failed to stop the call");
    }
  }, []);

  return {
    callStatus,
    durationSec,
    assistantSpeaking,
    userSpeaking,
    conversation: conversationRef.current,
    transcript,
    partialAssistant: partial.assistant || "",
    partialUser: partial.user || "",
    errorMsg,
    isReady,
    startCall,
    stopCall,
    resetState,
  };
};
