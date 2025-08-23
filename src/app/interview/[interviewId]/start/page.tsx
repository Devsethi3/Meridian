"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/supabase/supabase-client";

import { useInterviewContext } from "@/hooks/useInterviewContext";
import { useVapiInterview } from "@/hooks/useVapiInterview";

import { CallHeader } from "@/app/interview/[interviewId]/start/_components/CallHeader";
import { CallPanel } from "@/app/interview/[interviewId]/start/_components/CallPanel";
import { TranscriptPanel } from "@/app/interview/[interviewId]/start/_components/TranscriptPanel";
import { InterviewDetails } from "@/app/interview/[interviewId]/start/_components/InterviewDetails";
import { OverlayLoader } from "@/app/interview/[interviewId]/start/_components/OverlayLoader";

import type { TranscriptMessage } from "@/types/interview";
import { Button } from "@/components/ui/button";
import { Download, Clipboard, Check } from "lucide-react";

const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

const StartInterviewPage = () => {
  const { interviewId } = useParams();
  const router = useRouter();
  const { interviewInfo } = useInterviewContext();

  const {
    callStatus,
    durationSec,
    assistantSpeaking,
    userSpeaking,
    conversation,
    transcript,
    partialAssistant,
    partialUser,
    errorMsg,
    startCall,
    stopCall,
  } = useVapiInterview(vapiKey);

  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [autoScrollTranscript, setAutoScrollTranscript] = useState(true);
  const [justCopied, setJustCopied] = useState(false);

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

  // Auto-start when interviewInfo becomes available
  useEffect(() => {
    if (interviewInfo && vapiKey) {
      startCall(assistantOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewInfo, vapiKey]);

  // Generate feedback after call ended
  useEffect(() => {
    if (callStatus === "ended") {
      generateFeedback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus]);

  const handleStart = useCallback(async () => {
    if (!interviewInfo) {
      toast.error("Missing interview info");
      return;
    }
    await startCall(assistantOptions);
  }, [assistantOptions, interviewInfo, startCall]);

  const handleStop = useCallback(() => {
    stopCall();
  }, [stopCall]);

  const generateFeedback = useCallback(async () => {
    try {
      setIsGeneratingFeedback(true);
      const convo = conversation;
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
  }, [conversation, interviewId, interviewInfo, router]);

  const downloadTranscript = useCallback(
    (format: "txt" | "json") => {
      if (!transcript.length) return;
      const filename = `interview-transcript.${format}`;
      let blob: Blob;

      if (format === "txt") {
        const txt = transcript
          .map((m) => `${m.role === "assistant" ? "AI" : "You"}: ${m.text}`)
          .join("\n\n");
        blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
      } else {
        blob = new Blob([JSON.stringify(transcript, null, 2)], {
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
    [transcript]
  );

  const copyTranscript = useCallback(async () => {
    if (!transcript.length) return;
    const txt = transcript
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
  }, [transcript]);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <CallHeader
        callStatus={callStatus}
        durationSec={durationSec}
        jobPosition={interviewInfo?.jobPosition}
      />

      <div className="mx-auto max-w-6xl px-6 py-8 grid gap-6 lg:grid-cols-12">
        {/* Left: Call visuals + controls */}
        <div className="lg:col-span-7 space-y-6">
          <CallPanel
            callStatus={callStatus}
            assistantSpeaking={assistantSpeaking}
            userSpeaking={userSpeaking}
            interviewInfo={interviewInfo as any}
            onStart={handleStart}
            onStop={handleStop}
            errorMsg={errorMsg}
            isGeneratingFeedback={isGeneratingFeedback}
            vapiKeyPresent={!!vapiKey}
          />
        </div>

        {/* Right: Transcript + details */}
        <div className="lg:col-span-5 space-y-6">
          <TranscriptPanel
            messages={transcript as TranscriptMessage[]}
            callStatus={callStatus}
            autoScroll={autoScrollTranscript}
            onToggleAutoScroll={() => setAutoScrollTranscript((v) => !v)}
            onDownload={downloadTranscript}
            onCopy={copyTranscript}
            justCopied={justCopied}
            partialAssistant={partialAssistant}
            partialUser={partialUser}
          />
          <InterviewDetails interviewInfo={interviewInfo as any} />
        </div>
      </div>

      <OverlayLoader
        show={callStatus === "connecting" || isGeneratingFeedback}
        text={
          isGeneratingFeedback
            ? "Generating feedback..."
            : "Connecting to the call..."
        }
      />
    </div>
  );
};

export default StartInterviewPage;
