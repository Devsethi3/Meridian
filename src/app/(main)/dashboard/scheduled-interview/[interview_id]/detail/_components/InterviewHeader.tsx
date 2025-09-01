"use client";

import { CalendarDays, Clock, FileText, Mail, Copy, Check } from "lucide-react";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ErrorState from "./ErrorState";
import { Card } from "@/components/ui/card";
import * as React from "react";
import { InterviewDetail } from "@/lib/types";
import InterviewHeaderSkeleton from "@/components/skeletons/InterviewHeaderSkeleton";
import StatChip from "./StatChip";

interface InterviewHeaderProps {
  interview: InterviewDetail | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  interview,
  loading = false,
  error = null,
  onRetry,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    if (!interview?.userEmail) return;
    try {
      await navigator.clipboard.writeText(interview.userEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // noop
    }
  }, [interview?.userEmail]);

  if (loading) return <InterviewHeaderSkeleton />;
  if (error) {
    return (
      <ErrorState
        title="Couldn't load interview header"
        description={error}
        onRetry={onRetry}
      />
    );
  }
  if (!interview) {
    return (
      <Card className="border-dashed">
        <div className="p-8 text-center text-muted-foreground">
          No interview details available.
        </div>
      </Card>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/5 to-muted/5" />
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-foreground">
              {interview.jobPosition}
            </h1>
            <div className="text-sm text-muted-foreground">
              Interview overview and metadata
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background/60 px-3 py-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground truncate max-w-[220px]">
                {interview.userEmail}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleCopy}
                aria-label="Copy email"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              {copied && <Badge variant="outline">Copied</Badge>}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatChip
            icon={<CalendarDays className="h-4 w-4" />}
            label="Created"
            value={moment(interview.created_at).format("MMM DD, YYYY")}
          />
          <StatChip
            icon={<Clock className="h-4 w-4" />}
            label="Duration"
            value={interview.duration || "—"}
          />
          <StatChip
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={interview.userEmail}
            truncate
          />
          <StatChip
            icon={<FileText className="h-4 w-4" />}
            label="Interview Type"
            value={interview.type || "—"}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewHeader;
