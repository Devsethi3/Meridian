"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Copy, Send, Timer, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { Interview } from "../page";
import { formatDuration } from "@/lib/utils";
import { useMemo } from "react";

interface InterviewCardProps {
  interview: Interview;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ interview }) => {
  const host = useMemo(
    () =>
      process.env.NEXT_PUBLIC_HOST_URL ||
      (typeof window !== "undefined" ? window.location.origin : ""),
    []
  );
  const shareUrl = `${host}/${interview.interview_id || ""}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const sendLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: interview.jobPosition || "Interview",
          text: "Here’s the interview link",
          url: shareUrl,
        });
      } catch {
        // user dismissed share dialog
      }
    } else {
      await copyLink();
    }
  };

  const durationLabel = formatDuration(interview.duration);
  const feedbackCount = interview["interview-feedback"]?.length ?? 0;

  const initials =
    (interview.jobPosition || "I")
      .split(" ")
      .map((s) => s?.[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "I";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.7 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm"
      role="article"
      aria-label={`Interview card for ${interview.jobPosition || "Untitled"}`}
    >
      {/* Soft gradient hover */}
      <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
      </div>

      {/* Accent bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-secondary/60 to-primary/60 opacity-70" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="mb-4 flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground ring-1 ring-border">
            <span className="text-sm font-medium">{initials}</span>
          </div>
          <h3 className="truncate text-base font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
            {interview.jobPosition || "Untitled Interview"}
          </h3>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-secondary/30 bg-secondary/20 px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          <Users className="h-3.5 w-3.5" />
          {feedbackCount} {feedbackCount === 1 ? "Candidate" : "Candidates"}
        </span>
      </div>

      {/* Meta */}
      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md border border-border bg-muted/50 px-2.5 py-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Timer className="h-3.5 w-3.5" />
            <span>Duration</span>
          </div>
          <div className="mt-1 font-medium text-foreground">
            {durationLabel}
          </div>
        </div>

        <div className="rounded-md border border-border bg-muted/50 px-2.5 py-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>Feedback</span>
          </div>
          <div className="mt-1 font-medium text-foreground">
            {feedbackCount}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <Link
          href={`/dashboard/scheduled-interview/${interview?.interview_id}/detail`}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Open interview details"
        >
          Open
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={copyLink}
            className="inline-flex items-center gap-2"
            aria-label="Copy interview link"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button
            variant="secondary"
            onClick={sendLink}
            className="inline-flex items-center gap-2"
            aria-label="Share interview link"
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewCard;
