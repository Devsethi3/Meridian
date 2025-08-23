"use client";

import * as React from "react";
import { InterviewFeedback } from "@/lib/types";
import { Button } from "@/components/ui/button";
import FeedbackDialog from "./FeedbackDialog";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Users,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronRight,
} from "lucide-react";

interface CandidateListProps {
  candidates: InterviewFeedback[] | undefined;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const getInitials = (name?: string) => {
  if (!name) return "NA";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  const initials = (first + last).toUpperCase();
  return initials || name.slice(0, 2).toUpperCase();
};

const CandidateRowSkeleton = () => (
  <div className="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 sm:gap-5">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="min-w-0">
          <Skeleton className="mb-2 h-4 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-10 w-full sm:w-28" />
    </div>
  </div>
);

const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  loading = false,
  error = null,
  onRetry,
}) => {
  const [selectedCandidate, setSelectedCandidate] =
    React.useState<InterviewFeedback | null>(null);

  const sortedCandidates = React.useMemo(() => {
    if (!candidates) return [];
    return [...candidates].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [candidates]);

  const getAverage = (c: InterviewFeedback) => {
    const r = c.feedback?.feedback?.rating;
    if (!r) return 0;
    const vals = Object.values(r).map((v) => Number(v) || 0);
    if (!vals.length) return 0;
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.round(avg * 10) / 10;
  };

  const getRecommendationState = (c: InterviewFeedback) => {
    const raw = (c.feedback?.feedback?.recommendation || "")
      .toString()
      .trim()
      .toLowerCase();
    if (raw === "yes") return { state: "yes" as const, label: "Recommended" };
    if (raw === "no") return { state: "no" as const, label: "Not Recommended" };
    return { state: "neutral" as const, label: "Needs Review" };
  };

  if (loading) {
    return (
      <div>
        <h2 className="my-5 font-bold">Candidates</h2>
        <div className="space-y-3">
          <CandidateRowSkeleton />
          <CandidateRowSkeleton />
          <CandidateRowSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="border-destructive/30">
        <AlertTitle>Couldn&apos;t load candidates</AlertTitle>
        <AlertDescription>
          {error}
          {onRetry && (
            <div className="mt-3">
              <Button variant="outline" onClick={onRetry}>
                Try again
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (!sortedCandidates || sortedCandidates.length === 0) {
    return (
      <div className="my-6 rounded-xl border border-dashed bg-card/50 p-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/40">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="font-medium">No candidates yet</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Candidates who complete this interview will appear here.
        </div>
        {onRetry && (
          <div className="mt-4">
            <Button variant="outline" onClick={onRetry}>
              Refresh
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div>
        <h2 className="my-5 font-bold">
          Candidates ({sortedCandidates.length})
        </h2>

        <div className="space-y-3">
          {sortedCandidates.map((candidate, index) => {
            const avg = getAverage(candidate);
            const { state, label } = getRecommendationState(candidate);

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-border bg-card/50 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: Avatar + Info */}
                  <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                    {/* Stable avatar (never shrinks) */}
                    <div className="grid size-12 flex-shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-1 ring-border sm:size-14">
                      <span className="select-none">
                        {getInitials(candidate.userName)}
                      </span>
                    </div>

                    {/* Name + Meta */}
                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold sm:text-base">
                          {candidate.userName || "Unnamed Candidate"}
                        </h3>

                        {/* Status Badge */}
                        {state === "yes" && (
                          <Badge
                            variant="outline"
                            className="inline-flex items-center gap-1 border-primary/30 bg-primary/10 text-primary"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {label}
                          </Badge>
                        )}
                        {state === "no" && (
                          <Badge
                            variant="outline"
                            className="inline-flex items-center gap-1 border-destructive/30 bg-destructive/10 text-destructive"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            {label}
                          </Badge>
                        )}
                        {state === "neutral" && (
                          <Badge
                            variant="outline"
                            className="inline-flex items-center gap-1 border-muted-foreground/30 bg-muted/20 text-muted-foreground"
                          >
                            <MinusCircle className="h-3.5 w-3.5" />
                            {label}
                          </Badge>
                        )}
                      </div>

                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground sm:text-sm">
                        Completed on{" "}
                        {moment(candidate.created_at).format("MMM DD, YYYY")}
                        {avg > 0 ? ` • Avg ${avg}/10` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Right: CTA */}
                  <div className="sm:ml-6">
                    <Button
                      className="w-full gap-1 sm:w-auto"
                      onClick={() => setSelectedCandidate(candidate)}
                      aria-label={`View report for ${
                        candidate.userName || "candidate"
                      }`}
                    >
                      View Report
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Dialog */}
      {selectedCandidate && (
        <FeedbackDialog
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </>
  );
};

export default CandidateList;
