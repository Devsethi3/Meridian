"use client";

import Image from "next/image";
import { Bot, Loader2, Mic, Phone, PhoneOff, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CallStatus, InterviewInfo } from "@/types/interview";

interface CallPanelProps {
  callStatus: CallStatus;
  assistantSpeaking: boolean;
  userSpeaking: boolean;
  interviewInfo?: InterviewInfo;
  onStart: () => void;
  onStop: () => void;
  errorMsg?: string | null;
  isGeneratingFeedback?: boolean;
  vapiKeyPresent?: boolean;
}

export const CallPanel = ({
  callStatus,
  assistantSpeaking,
  userSpeaking,
  interviewInfo,
  onStart,
  onStop,
  errorMsg,
  isGeneratingFeedback,
  vapiKeyPresent = true,
}: CallPanelProps) => {
  const canStart =
    callStatus !== "connecting" &&
    callStatus !== "in-call" &&
    !!interviewInfo &&
    vapiKeyPresent;

  const canStop =
    callStatus === "in-call" ||
    callStatus === "connecting" ||
    callStatus === "ending";

  return (
    <div className="rounded-xl border bg-background p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Assistant */}
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20">
            <div
              className={`absolute inset-0 rounded-full border bg-muted grid place-items-center overflow-hidden
              ${assistantSpeaking ? "ring-4 ring-primary animate-pulse" : ""}`}
            >
              <Image
                src="/ai-robot.png"
                width={80}
                height={80}
                className="object-cover"
                alt="AI Recruiter"
              />
            </div>
            {/* Subtle halo */}
            {assistantSpeaking && (
              <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            )}
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
          <div className="relative h-20 w-20">
            <div
              className={`absolute inset-0 rounded-full border bg-muted grid place-items-center text-2xl font-semibold
              ${userSpeaking ? "ring-4 ring-secondary animate-pulse" : ""}`}
            >
              {interviewInfo?.userName?.[0]?.toUpperCase() ?? (
                <User2 className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            {userSpeaking && (
              <span className="absolute inset-0 rounded-full bg-secondary/20 animate-ping" />
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
        Keep your answers concise. You can ask for a hint anytime.
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <Button
          onClick={onStart}
          disabled={!canStart}
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
          onClick={onStop}
          disabled={!canStop}
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

      {!vapiKeyPresent && (
        <div className="mt-4 rounded-md border bg-destructive/10 text-destructive-foreground p-3 text-sm">
          Missing Vapi public key (NEXT_PUBLIC_VAPI_PUBLIC_KEY).
        </div>
      )}

      {errorMsg && callStatus === "error" && (
        <div className="mt-4 rounded-md border bg-destructive/10 text-destructive-foreground p-3 text-sm">
          {errorMsg}
        </div>
      )}

      {isGeneratingFeedback && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating feedback...
        </div>
      )}
    </div>
  );
};
