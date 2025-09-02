"use client";

import { CalendarDays, Clock, FileText, Mail, Copy, Check } from "lucide-react";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ErrorState from "./ErrorState";
import { Card } from "@/components/ui/card";
import { InterviewDetail } from "@/lib/types";
import InterviewHeaderSkeleton from "@/components/skeletons/InterviewHeaderSkeleton";
import StatChip from "./StatChip";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

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
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group rounded-xl bg-gradient-to-br from-primary/30 via-secondary/30 to-primary/30 p-[1px] transition-colors duration-300 hover:from-primary/40 hover:via-secondary/40 hover:to-primary/40"
    >
      <div className="relative overflow-hidden rounded-xl bg-card/80 ring-1 ring-border/50 backdrop-blur">
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h1 className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 text-2xl font-semibold sm:text-3xl">
                {interview.jobPosition}
              </h1>
              <div className="text-sm text-muted-foreground">
                Interview overview and metadata
              </div>
            </div>

            <motion.div
              whileHover={{ y: -1 }}
              transition={{ type: "spring", stiffness: 350, damping: 22, mass: 0.4 }}
              className="rounded-lg bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 p-[1px]"
            >
              <div className="flex items-center gap-2 rounded-lg bg-background/60 px-3 py-2 ring-1 ring-border/50">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="max-w-[220px] truncate text-foreground">
                  {interview.userEmail}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopy}
                  aria-label="Copy email"
                  aria-live="polite"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </motion.div>
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
    </motion.div>
  );
};

export default InterviewHeader;