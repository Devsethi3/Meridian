"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import type { CallStatus, TranscriptMessage } from "@/types/interview";

type Role = "assistant" | "user";

const extractText = (m: any): string => {
  if (!m) return "";
  if (typeof m.content === "string") return m.content;
  if (Array.isArray(m.content)) {
    return m.content
      .map((c: any) => c?.text || c?.content || c?.transcript || "")
      .filter(Boolean)
      .join(" ");
  }
  return m?.text || m?.message || m?.transcript || "";
};

const normalizeRole = (r?: string): Role | undefined => {
  if (!r) return undefined;
  const lower = r.toLowerCase();
  if (["assistant", "bot", "ai"].includes(lower)) return "assistant";
  if (["user", "client", "human", "speaker", "caller"].includes(lower))
    return "user";
  return undefined;
};

export const useVapiInterview = (vapiKey?: string) => {
  const vapiRef = useRef<Vapi | null>(null);

  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [durationSec, setDurationSec] = useState(0);

  const [conversation, setConversation] = useState<any>(null);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [partial, setPartial] = useState<{ assistant?: string; user?: string }>(
    {}
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userSpeakingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    if (!vapiKey) {
      setErrorMsg("Missing Vapi public key (NEXT_PUBLIC_VAPI_PUBLIC_KEY).");
      setCallStatus("error");
      return;
    }
    const vapi = new Vapi(vapiKey);
    vapiRef.current = vapi;

    const onCallStart = () => {
      setCallStatus("in-call");
      setAssistantSpeaking(false);
      setUserSpeaking(false);
      setPartial({});
      startTimer();
      toast.success("Connected");
    };

    const onCallEnd = () => {
      setCallStatus("ended");
      setAssistantSpeaking(false);
      setUserSpeaking(false);
      stopTimer();
      toast("Interview ended");
    };

    const onSpeechStart = () => setAssistantSpeaking(true);
    const onSpeechEnd = () => setAssistantSpeaking(false);

    const pushFinal = (role: Role, text: string, id?: string) => {
      const finalText = (text || "").trim();
      if (!finalText) return;
      setTranscript((prev) => [
        ...prev,
        {
          id: id || `${Date.now()}-${prev.length}`,
          role,
          text: finalText,
          timestamp: Date.now(),
        },
      ]);
    };

    const onMessage = (raw: any) => {
      const msg = raw?.data || raw || {};
      const type = String(msg?.type || msg?.event || "").toLowerCase();

      // 1) Full conversation updates
      const conv = msg?.conversation || msg?.data?.conversation;
      if (conv?.messages) {
        setConversation(conv);
        const derived = (conv.messages as any[])
          .filter((m: any) => m?.role === "assistant" || m?.role === "user")
          .map(
            (m: any, idx: number): TranscriptMessage => ({
              id: m?.id || String(idx),
              role: m.role,
              text: extractText(m) || "",
              timestamp: m?.timestamp ? Date.parse(m.timestamp) : undefined,
            })
          )
          .filter((m) => m.text.trim().length > 0);
        setTranscript(derived);
        setPartial({});
        return;
      }

      // 2) Streaming / partials / message units
      const role = normalizeRole(
        msg?.role || msg?.speaker || msg?.from || msg?.message?.role
      );
      const text =
        msg?.transcript ??
        msg?.text ??
        (msg?.message ? extractText(msg?.message) : undefined) ??
        extractText(msg);

      // Heuristic: mark user speaking for a moment when partials arrive
      if (
        /vad\.start|speech[-_ ]?start|input_audio_buffer\.speech_started|transcript\.partial|transcription\.partial/i.test(
          type
        )
      ) {
        setUserSpeaking(true);
        if (userSpeakingTimeoutRef.current)
          clearTimeout(userSpeakingTimeoutRef.current);
        userSpeakingTimeoutRef.current = setTimeout(
          () => setUserSpeaking(false),
          800
        );
      }
      if (
        /vad\.stop|speech[-_ ]?end|input_audio_buffer\.speech_ended/i.test(type)
      ) {
        setUserSpeaking(false);
      }

      // Partial transcripts
      if (/partial|delta/.test(type) && role && typeof text === "string") {
        setPartial((p) => ({ ...p, [role]: text }));
        return;
      }

      // Final transcripts / assistant or user messages
      if (
        (/final|completed|assistant\.message|user\.message|message\.created/.test(
          type
        ) &&
          role) ||
        (role && typeof text === "string")
      ) {
        // Some events don't separate partial/final clearly; treat as final if it looks complete
        const finalText = (text || (partial as any)[role] || "").trim();
        if (finalText) {
          pushFinal(role, finalText, msg?.id);
          setPartial((p) => ({ ...p, [role]: undefined }));
        }
        return;
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("message", onMessage);

    return () => {
      try {
        vapi.stop();
      } catch {
        // ignore
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (userSpeakingTimeoutRef.current)
        clearTimeout(userSpeakingTimeoutRef.current);
    };
  }, [vapiKey]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDurationSec(0);
    timerRef.current = setInterval(() => setDurationSec((s) => s + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startCall = useCallback(
    async (assistantOptions: CreateAssistantDTO) => {
      if (!vapiRef.current) return;
      setErrorMsg(null);
      setCallStatus("connecting");
      setConversation(null);
      setTranscript([]);
      setPartial({});
      setDurationSec(0);
      toast("Connecting...");

      try {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
          throw new Error(
            "Microphone permission denied. Please allow mic access and try again."
          );
        }

        await vapiRef.current.start(assistantOptions);
      } catch (err: any) {
        console.error(err);
        setCallStatus("error");
        const msg = err?.message || "Failed to start the interview.";
        setErrorMsg(msg);
        toast.error(msg);
        stopTimer();
      }
    },
    []
  );

  const stopCall = useCallback(() => {
    if (!vapiRef.current) return;
    setCallStatus("ending");
    try {
      vapiRef.current.stop();
    } catch (err) {
      console.error(err);
      setCallStatus("error");
      toast.error("Failed to stop the call");
    }
  }, []);

  return {
    // state
    callStatus,
    durationSec,
    assistantSpeaking,
    userSpeaking,
    conversation,
    transcript,
    partialAssistant: partial.assistant || "",
    partialUser: partial.user || "",
    errorMsg,
    // actions
    startCall,
    stopCall,
  };
};
