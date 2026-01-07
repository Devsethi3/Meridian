// app/interview/[interviewId]/start/_components/CallPanel.tsx
"use client";

import Image from "next/image";
import {
  Bot,
  Loader2,
  Mic,
  Phone,
  PhoneOff,
  User2,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// Import types from the hook
import type { CallStatus } from "@/hooks/useVapiInterview";

interface InterviewInfo {
  userName?: string;
  userEmail?: string;
  jobPosition?: string;
}

interface CallPanelProps {
  callStatus: CallStatus;
  assistantSpeaking: boolean;
  userSpeaking: boolean;
  interviewInfo?: InterviewInfo | null;
  onStart: () => void;
  onStop: () => void;
  errorMsg?: string | null;
  isGeneratingFeedback?: boolean;
  vapiKeyPresent?: boolean;
  isReady?: boolean;
}

interface ParticipantAvatarProps {
  isActive: boolean;
  isSpeaking: boolean;
  type: "assistant" | "user";
  name?: string;
}

const ParticipantAvatar = ({
  isActive,
  isSpeaking,
  type,
  name,
}: ParticipantAvatarProps) => {
  const isAssistant = type === "assistant";

  return (
    <div className="relative">
      {/* Outer pulse animation when speaking */}
      {isSpeaking && (
        <>
          <div
            className={cn(
              "absolute inset-0 -m-3 rounded-full animate-ping opacity-20",
              isAssistant ? "bg-primary" : "bg-green-500"
            )}
          />
          <div
            className={cn(
              "absolute inset-0 -m-2 rounded-full animate-pulse opacity-30",
              isAssistant ? "bg-primary" : "bg-green-500"
            )}
          />
        </>
      )}

      {/* Avatar container */}
      <div
        className={cn(
          "relative h-24 w-24 rounded-full border-4 transition-all duration-300 overflow-hidden",
          "flex items-center justify-center bg-muted",
          isSpeaking &&
            isAssistant &&
            "border-primary shadow-lg shadow-primary/25",
          isSpeaking &&
            !isAssistant &&
            "border-green-500 shadow-lg shadow-green-500/25",
          !isSpeaking && isActive && "border-muted-foreground/30",
          !isActive && "border-muted-foreground/10 opacity-60"
        )}
      >
        {isAssistant ? (
          <Image
            src="/ai-robot.png"
            width={96}
            height={96}
            className="object-cover"
            alt="AI Interviewer"
            priority
          />
        ) : (
          <div className="text-3xl font-bold text-muted-foreground">
            {name?.[0]?.toUpperCase() || <User2 className="h-10 w-10" />}
          </div>
        )}
      </div>

      {/* Speaking indicator badge */}
      {isSpeaking && (
        <div
          className={cn(
            "absolute -bottom-2 left-1/2 -translate-x-1/2",
            "flex items-center gap-1 rounded-full px-2.5 py-1",
            "text-[11px] font-medium shadow-lg",
            isAssistant
              ? "bg-primary text-primary-foreground"
              : "bg-green-500 text-white"
          )}
        >
          <Mic className="h-3 w-3 animate-pulse" />
          Speaking
        </div>
      )}
    </div>
  );
};

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
  isReady = false,
}: CallPanelProps) => {
  const isActive = callStatus === "in-call";
  const isConnecting = callStatus === "connecting";
  const isEnding = callStatus === "ending";
  const isEnded = callStatus === "ended";
  const isError = callStatus === "error";
  const isIdle = callStatus === "idle";

  const canStart = (isIdle || isEnded || isError) && isReady && vapiKeyPresent;
  const canStop = isActive || isConnecting;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Interview Session</h2>
            {!isReady && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Initializing...
              </span>
            )}
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium",
              isActive && "bg-green-500/10 text-green-600",
              isConnecting && "bg-yellow-500/10 text-yellow-600",
              isEnding && "bg-orange-500/10 text-orange-600",
              (isIdle || isEnded) && "bg-muted text-muted-foreground",
              isError && "bg-destructive/10 text-destructive"
            )}
          >
            {isActive && (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Live
              </>
            )}
            {isConnecting && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Connecting
              </>
            )}
            {isEnding && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Ending
              </>
            )}
            {isIdle && (
              <>
                <WifiOff className="h-3 w-3" />
                Ready
              </>
            )}
            {isEnded && (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Ended
              </>
            )}
            {isError && (
              <>
                <AlertCircle className="h-3 w-3" />
                Error
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Participants */}
        <div className="flex items-center justify-center gap-8 sm:gap-16 py-8">
          {/* AI Interviewer */}
          <div className="flex flex-col items-center gap-4">
            <ParticipantAvatar
              type="assistant"
              isActive={isActive}
              isSpeaking={assistantSpeaking}
            />
            <div className="text-center">
              <div className="flex items-center gap-1.5 font-medium justify-center">
                <Bot className="h-4 w-4 text-primary" />
                <span>AI Interviewer</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {assistantSpeaking
                  ? "Speaking..."
                  : isActive
                  ? "Listening"
                  : "Waiting"}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-24 w-px bg-border" />

          {/* Candidate */}
          <div className="flex flex-col items-center gap-4">
            <ParticipantAvatar
              type="user"
              isActive={isActive}
              isSpeaking={userSpeaking}
              name={interviewInfo?.userName}
            />
            <div className="text-center">
              <p className="font-medium">
                {interviewInfo?.userName || "Candidate"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[120px] truncate">
                {interviewInfo?.userEmail || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-2 rounded-xl border bg-muted/30 p-4">
          <div className="flex gap-3">
            <div className="h-9 w-9 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Interview Tips</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Speak clearly and at a natural pace</li>
                <li>• Take a moment to think before answering</li>
                <li>• You can ask for clarification anytime</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {!vapiKeyPresent && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Voice service is not configured. Please contact support.
            </AlertDescription>
          </Alert>
        )}

        {errorMsg && isError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {isGeneratingFeedback && (
          <Alert className="mt-4 border-primary/20 bg-primary/5">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <AlertDescription className="text-primary">
              Analyzing your interview and generating personalized feedback...
            </AlertDescription>
          </Alert>
        )}

        {!isReady && !errorMsg && (
          <Alert className="mt-4 border-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Initializing voice service... Please wait.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="border-t bg-muted/30 p-4">
        <div className="flex w-full items-center gap-3">
          <Button
            onClick={onStart}
            disabled={!canStart}
            className="flex-1 h-12 text-base"
            size="lg"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : !isReady ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Phone className="mr-2 h-5 w-5" />
                {isEnded || isError ? "Restart Interview" : "Start Interview"}
              </>
            )}
          </Button>

          <Button
            variant="destructive"
            onClick={onStop}
            disabled={!canStop}
            className="flex-1 h-12 text-base"
            size="lg"
          >
            {isEnding ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Ending...
              </>
            ) : (
              <>
                <PhoneOff className="mr-2 h-5 w-5" />
                End Interview
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
