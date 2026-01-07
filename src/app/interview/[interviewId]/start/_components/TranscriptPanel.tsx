// app/interview/[interviewId]/start/_components/TranscriptPanel.tsx
"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Bot,
  Check,
  Clipboard,
  Download,
  User2,
  ArrowDown,
  MessageSquare,
} from "lucide-react";
import type { TranscriptMessage, CallStatus } from "@/types/interview";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface MessageBubbleProps {
  message: TranscriptMessage;
  isPartial?: boolean;
}

const MessageBubble = ({ message, isPartial = false }: MessageBubbleProps) => {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[90%]",
        isAssistant ? "self-start" : "self-end flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
          isAssistant ? "bg-primary/10" : "bg-secondary/10"
        )}
      >
        {isAssistant ? (
          <Bot className="h-4 w-4 text-primary" />
        ) : (
          <User2 className="h-4 w-4 text-secondary-foreground" />
        )}
      </div>

      {/* Message */}
      <div
        className={cn(
          "rounded-2xl px-4 py-2.5 text-sm",
          isAssistant
            ? "bg-muted rounded-tl-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm",
          isPartial && "opacity-70"
        )}
      >
        <p className={cn("leading-relaxed", isPartial && "italic")}>
          {message.text}
        </p>
        {message.timestamp && !isPartial && (
          <p
            className={cn(
              "text-[10px] mt-1",
              isAssistant
                ? "text-muted-foreground"
                : "text-primary-foreground/70"
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
};

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
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [autoScroll, messages, partialAssistant, partialUser]);

  const hasContent = messages.length > 0 || partialAssistant || partialUser;

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="border-b py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-sm">Live Transcript</h3>
              <p className="text-xs text-muted-foreground">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onToggleAutoScroll}
              title={
                autoScroll ? "Auto-scroll enabled" : "Auto-scroll disabled"
              }
            >
              <ArrowDown
                className={cn(
                  "h-4 w-4 transition-colors",
                  autoScroll ? "text-primary" : "text-muted-foreground"
                )}
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!hasContent}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDownload("txt")}>
                  Download as TXT
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload("json")}>
                  Download as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onCopy}
              disabled={!hasContent}
            >
              {justCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Clipboard className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <div
          ref={containerRef}
          className="h-[400px] lg:h-[calc(100vh-28rem)] overflow-y-auto p-4"
        >
          {hasContent ? (
            <div className="flex flex-col gap-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}

              {/* Partial messages */}
              {partialAssistant && (
                <MessageBubble
                  message={{
                    id: "partial-assistant",
                    role: "assistant",
                    text: partialAssistant,
                  }}
                  isPartial
                />
              )}
              {partialUser && (
                <MessageBubble
                  message={{
                    id: "partial-user",
                    role: "user",
                    text: partialUser,
                  }}
                  isPartial
                />
              )}

              <div ref={bottomRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-muted-foreground">
                {callStatus === "in-call"
                  ? "Waiting for conversation..."
                  : "Transcript will appear here"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {callStatus === "in-call"
                  ? "Start speaking to see your conversation"
                  : "Join the interview to begin"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
