// app/interview/[interviewId]/start/_components/CallHeader.tsx
"use client";

import { Timer as TimerIcon, Radio, Briefcase } from "lucide-react";
import { formatDuration } from "@/lib/format-duration";
import type { CallStatus } from "@/types/interview";
import { cn } from "@/lib/utils";

interface CallHeaderProps {
  callStatus: CallStatus;
  durationSec: number;
  jobPosition?: string;
}

const statusConfig: Record<
  CallStatus,
  { label: string; className: string; dot?: boolean }
> = {
  idle: {
    label: "Ready",
    className: "bg-muted text-muted-foreground border-muted-foreground/20",
  },
  connecting: {
    label: "Connecting",
    className:
      "bg-yellow-500/10 text-yellow-600 border-yellow-500/30 dark:text-yellow-400",
  },
  "in-call": {
    label: "Live",
    className:
      "bg-green-500/10 text-green-600 border-green-500/30 dark:text-green-400",
    dot: true,
  },
  ending: {
    label: "Ending",
    className:
      "bg-orange-500/10 text-orange-600 border-orange-500/30 dark:text-orange-400",
  },
  ended: {
    label: "Ended",
    className: "bg-muted text-muted-foreground border-muted-foreground/20",
  },
  error: {
    label: "Error",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
};

export const CallHeader = ({
  callStatus,
  durationSec,
  jobPosition,
}: CallHeaderProps) => {
  const status = statusConfig[callStatus];

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Position */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground line-clamp-1">
                {jobPosition || "Interview Session"}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                AI-Powered Interview
              </p>
            </div>
          </div>

          {/* Right: Status & Timer */}
          <div className="flex items-center gap-4">
            {/* Status Badge */}
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                status.className
              )}
            >
              {status.dot && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                </span>
              )}
              {callStatus === "connecting" && (
                <Radio className="h-3 w-3 animate-pulse" />
              )}
              {status.label}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
              <TimerIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-sm font-medium tabular-nums">
                {formatDuration(durationSec)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
