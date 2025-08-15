"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Copy, Send, Timer, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Interview } from "../page";

interface InterviewCardProps {
  interview: Interview;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ interview }) => {
  const href = `/interviews/${encodeURIComponent(interview.interview_id)}`;
  const host =
    process.env.NEXT_PUBLIC_HOST_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
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
        /* user cancelled */
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
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "I";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm"
    >
      <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
      </div>

      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <span className="text-sm font-semibold">{initials}</span>
        </div>
        <h3 className="truncate text-base font-semibold">
          {interview.jobPosition || "Untitled Interview"}
        </h3>
      </div>

      {/* Meta */}
      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md border border-border bg-muted px-2.5 py-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Timer className="h-3.5 w-3.5" />
            <span>Duration</span>
          </div>
          <div className="mt-1 font-medium text-foreground">
            {durationLabel}
          </div>
        </div>

        <div className="rounded-md border border-border bg-muted px-2.5 py-2">
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
          href={href}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Open
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={copyLink}
            className="inline-flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button
            variant="secondary"
            onClick={sendLink}
            className="inline-flex items-center gap-2"
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

/* -------------------- Local helpers -------------------- */
function formatDuration(d: string | null | undefined): string {
  if (!d) return "—";
  // ISO 8601 format
  if (/^P(T.*)?/i.test(d)) {
    const h = parseInt(d.match(/(\d+)H/i)?.[1] || "0", 10);
    const m = parseInt(d.match(/(\d+)M/i)?.[1] || "0", 10);
    const s = parseInt(d.match(/(\d+)S/i)?.[1] || "0", 10);
    const parts: string[] = [];
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (s && !h && !m) parts.push(`${s}s`);
    return parts.join(" ") || "0m";
  }
  // Fallback minutes
  const mins = parseInt(String(d).replace(/[^\d]/g, ""), 10);
  if (!isNaN(mins)) {
    if (mins >= 60) {
      const hh = Math.floor(mins / 60);
      const mm = mins % 60;
      return mm ? `${hh}h ${mm}m` : `${hh}h`;
    }
    return `${mins}m`;
  }
  return String(d);
}
