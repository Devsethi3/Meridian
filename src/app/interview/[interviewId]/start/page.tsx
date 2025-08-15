"use client";

import { Button } from "@/components/ui/button";
import { useInterviewContext } from "@/hooks/useInterviewContext";
import {
  Bot,
  Clipboard,
  Check,
  Download,
  Loader2,
  Mic,
  Phone,
  PhoneOff,
  Timer as TimerIcon,
  User2,
} from "lucide-react";
import Image from "next/image";
import Vapi from "@vapi-ai/web";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/supabase/supabase-client";
import { useParams, useRouter } from "next/navigation";

type CallStatus =
  | "idle"
  | "connecting"
  | "in-call"
  | "ending"
  | "ended"
  | "error";

type TranscriptMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const formatDuration = (sec: number) => {
  const h = Math.floor(sec / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((sec % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const StartInterviewPage = () => {
  const { interviewId } = useParams();
  const router = useRouter();
  const { interviewInfo } = useInterviewContext();

  const vapiRef = useRef<Vapi | null>(null);

  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [conversation, setConversation] = useState<any>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // UI/Transcript helpers
  const [autoScrollTranscript, setAutoScrollTranscript] = useState(true);
  const [justCopied, setJustCopied] = useState(false);

  const conversationRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStartedRef = useRef(false);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);

  const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

  const jobPosition = interviewInfo?.jobPosition ?? "your role";
  const userName = interviewInfo?.userName ?? "there";

  const questionList =
    interviewInfo?.questionList?.map((q: any) => q?.question).join(", ") || "";

  const assistantOptions: CreateAssistantDTO = useMemo(
    () => ({
      name: "AI Recruiter",
      firstMessage: `Hi ${userName}, how are you? Ready for your interview on ${jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "Jennifer",
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
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${jobPosition} interview, Let’s get started with a few questions!"
Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below are the questions ask one by one:
Questions: ${questionList}
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That's a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
✔ Be friendly, engaging, and witty
✔ Keep responses short and natural, like a real conversation
✔ Adapt based on the candidate's confidence level
✔ Ensure the interview remains focused on React
`.trim(),
          },
        ],
      },
    }),
    [jobPosition, questionList, userName]
  );

  // Setup Vapi and listeners once
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
      startTimer();
      toast.success("Connected");
    };

    const onCallEnd = () => {
      setCallStatus("ended");
      setAssistantSpeaking(false);
      stopTimer();
      toast("Interview ended");
      generateFeedback();
    };

    const onSpeechStart = () => setAssistantSpeaking(true);
    const onSpeechEnd = () => setAssistantSpeaking(false);

    const onMessage = (message: any) => {
      // Conversation updates flow through here
      if (message?.type === "conversation-update") {
        setConversation(message.conversation);
      }
      // Optional: if Vapi emits partial transcription events in your plan,
      // you could handle them here and set "partial" states.
      // e.g. if (message?.type === 'transcription.partial') setPartial(...)
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vapiKey]);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  // Auto-start when interviewInfo becomes available
  useEffect(() => {
    if (!autoStartedRef.current && interviewInfo && vapiRef.current) {
      autoStartedRef.current = true;
      handleStart();
    }
  }, [interviewInfo]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDurationSec(0);
    timerRef.current = setInterval(() => {
      setDurationSec((s) => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const handleStart = useCallback(async () => {
    if (!vapiRef.current) return;
    if (!interviewInfo) {
      toast.error("Missing interview info");
      return;
    }
    setErrorMsg(null);
    setCallStatus("connecting");
    setConversation(null); // fresh transcript
    setDurationSec(0);
    toast("Connecting...");
    try {
      await vapiRef.current.start(assistantOptions);
    } catch (err: any) {
      console.error(err);
      setCallStatus("error");
      setErrorMsg(err?.message || "Failed to start the interview.");
      toast.error("Failed to connect");
      stopTimer();
    }
  }, [assistantOptions, interviewInfo]);

  const handleStop = useCallback(() => {
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

  const generateFeedback = useCallback(async () => {
    try {
      setIsGeneratingFeedback(true);
      const convo = conversationRef.current;
      if (!convo) {
        toast.error("No conversation found to generate feedback.");
        return;
      }

      const result = await axios.post("/api/ai-feedback", {
        conversation: convo,
      });
      const content = result?.data?.content || "";

      const parsedFeedback = JSON.parse(content);

      const { data, error } = await supabase
        .from("interview-feedback")
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id: Array.isArray(interviewId)
              ? interviewId[0]
              : interviewId,
            feedback: parsedFeedback,
            recommended: false,
          },
        ])
        .select();

      if (error) {
        console.error("Error saving feedback:", error);
        toast.error("Failed to save feedback.");
      } else {
        toast.success("Feedback saved.");
        router.replace(
          `/interview/${
            Array.isArray(interviewId) ? interviewId[0] : interviewId
          }/completed`
        );
      }
    } catch (error) {
      console.error("Failed to parse or save feedback:", error);
      toast.error("Failed to generate feedback.");
    } finally {
      setIsGeneratingFeedback(false);
    }
  }, [interviewId, interviewInfo, router]);

  // Derive transcript messages
  const transcriptMessages: TranscriptMessage[] = useMemo(() => {
    const convo = conversation;
    const messages = (convo?.messages || []) as any[];
    return messages
      .filter((m) => m?.role === "assistant" || m?.role === "user")
      .map((m, idx) => {
        const text =
          typeof m?.content === "string"
            ? m.content
            : Array.isArray(m?.content)
            ? m.content.map((c: any) => c?.text || c?.content || "").join(" ")
            : m?.text || m?.message || "";
        return {
          id: m?.id || String(idx),
          role: m.role as "assistant" | "user",
          text: text || "",
        };
      });
  }, [conversation]);

  // Auto-scroll transcript
  useEffect(() => {
    if (!autoScrollTranscript || !transcriptContainerRef.current) return;
    const el = transcriptContainerRef.current;
    el.scrollTop = el.scrollHeight;
  }, [autoScrollTranscript, transcriptMessages]);

  const statusBadge = (() => {
    const base =
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border";
    switch (callStatus) {
      case "idle":
        return `${base} bg-muted text-muted-foreground`;
      case "connecting":
        return `${base} bg-secondary text-secondary-foreground`;
      case "in-call":
        return `${base} bg-primary text-primary-foreground`;
      case "ending":
        return `${base} bg-muted text-muted-foreground`;
      case "ended":
        return `${base} bg-muted text-muted-foreground`;
      case "error":
        return `${base} bg-destructive text-destructive-foreground`;
      default:
        return `${base} bg-muted text-muted-foreground`;
    }
  })();

  const downloadTranscript = useCallback(
    (format: "txt" | "json") => {
      if (!transcriptMessages.length) return;
      const filename = `interview-transcript.${format}`;
      let blob: Blob;

      if (format === "txt") {
        const txt = transcriptMessages
          .map((m) => `${m.role === "assistant" ? "AI" : "You"}: ${m.text}`)
          .join("\n\n");
        blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
      } else {
        blob = new Blob([JSON.stringify(transcriptMessages, null, 2)], {
          type: "application/json;charset=utf-8",
        });
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    [transcriptMessages]
  );

  const copyTranscript = useCallback(async () => {
    if (!transcriptMessages.length) return;
    const txt = transcriptMessages
      .map((m) => `${m.role === "assistant" ? "AI" : "You"}: ${m.text}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(txt);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 1500);
      toast.success("Transcript copied");
    } catch {
      toast.error("Failed to copy transcript");
    }
  }, [transcriptMessages]);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md grid place-items-center bg-primary text-primary-foreground">
              <Mic className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold">AI Interview</div>
              <div className="text-sm text-muted-foreground">
                {interviewInfo?.jobPosition || "—"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={statusBadge}>
              {callStatus === "in-call" && (
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
              )}
              {callStatus.replace("-", " ")}
            </span>
            <div className="flex items-center gap-1.5 text-sm tabular-nums">
              <TimerIcon className="h-4 w-4 text-muted-foreground" />
              <span>{formatDuration(durationSec)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-6 py-8 grid gap-6 lg:grid-cols-12">
        {/* Left: Call visuals + controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Call panel */}
          <div className="rounded-xl border bg-background p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Assistant */}
              <div className="flex items-center gap-4">
                <div
                  className={`relative h-20 w-20 rounded-full border bg-muted overflow-hidden grid place-items-center ${
                    assistantSpeaking ? "ring-4 ring-primary animate-pulse" : ""
                  }`}
                >
                  <Image
                    src="/ai-robot.png"
                    width={80}
                    height={80}
                    className="object-cover"
                    alt="AI Recruiter"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    AI Recruiter
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {assistantSpeaking
                      ? "Speaking..."
                      : callStatus === "in-call"
                      ? "Listening"
                      : "Idle"}
                  </div>
                </div>
              </div>

              {/* Candidate */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full border bg-muted grid place-items-center text-2xl font-semibold">
                  {interviewInfo?.userName?.[0]?.toUpperCase() ?? (
                    <User2 className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="font-semibold">
                    {interviewInfo?.userName || "Candidate"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {interviewInfo?.userEmail || ""}
                  </div>
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="mt-6 rounded-md border bg-muted/40 text-muted-foreground text-sm p-3">
              Keep your answers concise and to the point. You can ask for a hint
              anytime.
            </div>

            {/* Controls (bigger, centered) */}
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <Button
                onClick={handleStart}
                disabled={
                  callStatus === "connecting" ||
                  callStatus === "in-call" ||
                  !interviewInfo ||
                  !vapiKey
                }
                className="min-w-[120px]"
              >
                {callStatus === "connecting" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-4 w-4" /> Start
                  </>
                )}
              </Button>

              <Button
                variant="destructive"
                onClick={handleStop}
                disabled={
                  callStatus !== "in-call" &&
                  callStatus !== "connecting" &&
                  callStatus !== "ending"
                }
                className="min-w-[120px]"
              >
                {callStatus === "ending" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ending
                  </>
                ) : (
                  <>
                    <PhoneOff className="mr-2 h-4 w-4" /> End
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground ml-auto">
                Tip: You can end anytime; feedback is generated automatically.
              </div>
            </div>

            {callStatus === "error" && (
              <div className="mt-4 rounded-md border bg-destructive/10 text-destructive-foreground p-3 text-sm">
                {errorMsg || "Something went wrong. Please try again."}
              </div>
            )}

            {isGeneratingFeedback && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating feedback...
              </div>
            )}
          </div>
        </div>

        {/* Right: Transcript (sticky) + details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Transcript */}
          <div className="rounded-xl border bg-background overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <div className="font-semibold">Transcript</div>
                <div className="text-xs text-muted-foreground">
                  Live conversation updates
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setAutoScrollTranscript((v) => !v)}
                  title={`Auto-scroll ${autoScrollTranscript ? "On" : "Off"}`}
                >
                  {autoScrollTranscript ? (
                    <span className="text-xs font-medium">AS</span>
                  ) : (
                    <span className="text-xs font-medium opacity-60">AS</span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => downloadTranscript("txt")}
                  title="Download .txt"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyTranscript}
                  title="Copy transcript"
                >
                  {justCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clipboard className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div
              ref={transcriptContainerRef}
              className="p-4 sm:p-6 max-h-[calc(100dvh-16rem)] lg:max-h-[calc(100dvh-10rem)] overflow-y-auto"
              aria-live="polite"
            >
              {transcriptMessages?.length ? (
                <div className="flex flex-col gap-3">
                  {transcriptMessages.map((m) => {
                    const isAssistant = m.role === "assistant";
                    return (
                      <div
                        key={m.id}
                        className={`max-w-[85%] rounded-lg px-3 py-2 border shadow-sm ${
                          isAssistant
                            ? "self-start bg-primary/10 border-primary/20"
                            : "self-end bg-secondary/20 border-secondary/30"
                        }`}
                      >
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          {isAssistant ? (
                            <>
                              <Bot className="h-3.5 w-3.5" /> AI
                            </>
                          ) : (
                            <>
                              <User2 className="h-3.5 w-3.5" /> You
                            </>
                          )}
                        </div>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {m.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-[280px] grid place-items-center text-sm text-muted-foreground">
                  {callStatus === "in-call"
                    ? "Say hello to begin..."
                    : "Transcript will appear here during the call."}
                </div>
              )}
            </div>
          </div>

          {/* Interview details */}
          <div className="rounded-xl border bg-background p-6">
            <div className="font-semibold mb-2">Interview Details</div>
            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground">Position</div>
              <div className="font-medium">
                {interviewInfo?.jobPosition || "—"}
              </div>
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <div className="text-muted-foreground">Candidate</div>
              <div className="font-medium">
                {interviewInfo?.userName || "—"}
              </div>
              <div className="text-muted-foreground">
                {interviewInfo?.userEmail || ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen overlay during connecting/feedback */}
      {(callStatus === "connecting" || isGeneratingFeedback) && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm grid place-items-center z-30">
          <div className="rounded-lg border bg-background p-5 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div className="text-sm">
              {isGeneratingFeedback
                ? "Generating feedback..."
                : "Connecting to the call..."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartInterviewPage;
