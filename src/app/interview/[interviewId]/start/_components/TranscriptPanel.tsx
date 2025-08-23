"use client";

import { Button } from "@/components/ui/button";
import { Bot, Check, Clipboard, Download, User2 } from "lucide-react";
import type { TranscriptMessage, CallStatus } from "@/types/interview";
import { useRef, useEffect } from "react";

interface TranscriptPanelProps {
  messages: TranscriptMessage[];
  callStatus: CallStatus;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
  onDownload: (format: "txt" | "json") => void;
  onCopy: () => void;
  justCopied: boolean;
  partialAssistant?: string;
  partialUser?: string;
}

export const TranscriptPanel = ({
  messages,
  callStatus,
  autoScroll,
  onToggleAutoScroll,
  onDownload,
  onCopy,
  justCopied,
  partialAssistant,
  partialUser,
}: TranscriptPanelProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!autoScroll || !containerRef.current) return;
    const el = containerRef.current;
    el.scrollTop = el.scrollHeight;
  }, [autoScroll, messages, partialAssistant, partialUser]);

  return (
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
            onClick={onToggleAutoScroll}
            title={`Auto-scroll ${autoScroll ? "On" : "Off"}`}
          >
            {autoScroll ? (
              <span className="text-xs font-medium">AS</span>
            ) : (
              <span className="text-xs font-medium opacity-60">AS</span>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDownload("txt")}
            title="Download .txt"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onCopy}
            title="Copy transcript"
          >
            {justCopied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="p-4 sm:p-6 max-h-[calc(100dvh-16rem)] lg:max-h-[calc(100dvh-10rem)] overflow-y-auto"
        aria-live="polite"
      >
        {messages?.length ? (
          <div className="flex flex-col gap-3">
            {messages.map((m) => {
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

            {/* Live partial bubbles */}
            {partialAssistant && (
              <div className="max-w-[85%] self-start rounded-lg px-3 py-2 border bg-primary/5 border-primary/20">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Bot className="h-3.5 w-3.5" /> AI
                </div>
                <div className="text-sm italic text-muted-foreground">
                  {partialAssistant}
                </div>
              </div>
            )}
            {partialUser && (
              <div className="max-w-[85%] self-end rounded-lg px-3 py-2 border bg-secondary/10 border-secondary/30">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <User2 className="h-3.5 w-3.5" /> You
                </div>
                <div className="text-sm italic text-muted-foreground">
                  {partialUser}
                </div>
              </div>
            )}
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
  );
};
