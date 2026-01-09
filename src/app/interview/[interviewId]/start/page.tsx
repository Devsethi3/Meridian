"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { supabase } from "@/supabase/supabase-client";
import { useInterviewContext } from "@/hooks/useInterviewContext";
import { useVapiService } from "@/hooks/useVapiService";

import { CallHeader } from "./_components/CallHeader";
import { CallPanel } from "./_components/CallPanel";
import { TranscriptPanel } from "./_components/TranscriptPanel";
import { InterviewDetails } from "./_components/InterviewDetails";
import { OverlayLoader } from "./_components/OverlayLoader";
import { TranscriptMessage } from "@/lib/types";

export default function StartInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const { interviewInfo } = useInterviewContext();

  const interviewId =
    typeof params.interviewId === "string"
      ? params.interviewId
      : params.interviewId?.[0] || "";

  // Handle call end and generate feedback
  const handleCallEnd = useCallback(
    async (conversation: TranscriptMessage[]) => {
      console.log("[Page] Generating feedback for conversation:", conversation);

      if (!conversation || conversation.length < 2) {
        toast.error("Conversation too short to generate feedback");
        router.replace(
          `/interview/${interviewId}/completed?error=short-conversation`
        );
        return;
      }

      try {
        // Call feedback API
        const result = await axios.post("/api/ai-feedback", {
          conversation,
        });

        const content = result?.data?.content;
        if (!content) {
          throw new Error("No feedback received");
        }

        const parsedFeedback = JSON.parse(content);

        // Save to database
        const { error: dbError } = await supabase
          .from("interview-feedback")
          .insert([
            {
              userName: interviewInfo?.userName || "Unknown",
              userEmail: interviewInfo?.userEmail || "unknown@example.com",
              interview_id: interviewId,
              feedback: parsedFeedback,
              recommended:
                parsedFeedback.recommendation === "Strong Hire" ||
                parsedFeedback.recommendation === "Hire",
            },
          ]);

        if (dbError) {
          console.error("[Page] Database error:", dbError);
        }

        toast.success("Feedback generated!");
        router.replace(`/interview/${interviewId}/completed`);
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        console.error("[Page] Feedback error:", error);
        toast.error("Failed to generate feedback");
        router.replace(
          `/interview/${interviewId}/completed?error=feedback-failed`
        );
      }
    },
    [interviewId, interviewInfo, router]
  );

  // Use the Vapi service
  const {
    transcript,
    currentTranscript,
    callDuration,
    connectionStatus,
    isProcessingFeedback,
    isAssistantSpeaking,
    isUserSpeaking,
    errorMessage,
    startInterview,
    stopInterview,
  } = useVapiService({
    interviewInfo,
    onCallEnd: handleCallEnd,
  });

  // Map connection status to call status for components
  const callStatus =
    connectionStatus === "connected"
      ? "in-call"
      : connectionStatus === "connecting"
      ? "connecting"
      : "idle";

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-background to-muted/20">
      <CallHeader
        callStatus={callStatus}
        durationSec={callDuration}
        jobPosition={interviewInfo?.jobPosition}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <CallPanel
              callStatus={callStatus}
              assistantSpeaking={isAssistantSpeaking}
              userSpeaking={isUserSpeaking}
              interviewInfo={interviewInfo}
              onStart={startInterview}
              onStop={stopInterview}
              errorMsg={errorMessage}
              isGeneratingFeedback={isProcessingFeedback}
              vapiKeyPresent={!!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY}
              isReady={true}
            />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <TranscriptPanel
              messages={transcript}
              callStatus={callStatus}
              autoScroll={true}
              onToggleAutoScroll={() => {}}
              onDownload={() => {}}
              onCopy={() => {}}
              justCopied={false}
              partialAssistant={isAssistantSpeaking ? currentTranscript : ""}
              partialUser={isUserSpeaking ? currentTranscript : ""}
            />
            <InterviewDetails interviewInfo={interviewInfo} />
          </div>
        </div>
      </main>

      <OverlayLoader
        show={connectionStatus === "connecting" || isProcessingFeedback}
        text={
          isProcessingFeedback ? "Analyzing your interview..." : "Connecting..."
        }
      />
    </div>
  );
}
