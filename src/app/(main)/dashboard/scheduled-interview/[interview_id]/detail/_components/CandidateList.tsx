"use client";

import * as React from "react";
import { InterviewFeedback } from "@/lib/types";
import { Button } from "@/components/ui/button";
import FeedbackDialog from "./FeedbackDialog";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, CheckCircle2, XCircle } from "lucide-react";

interface CandidateListProps {
  candidates: InterviewFeedback[] | undefined;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const getInitials = (name?: string) => {
  if (!name) return "NA";
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase() || name.slice(0, 2).toUpperCase();
};

const CandidateRowSkeleton = () => (
  <div className="flex items-center justify-between rounded-lg bg-card/50 p-5">
    <div className="flex items-center gap-5">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div>
        <Skeleton className="mb-2 h-4 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <Skeleton className="h-9 w-28" />
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
    const vals = Object.values(r);
    if (!vals.length) return 0;
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.round(avg * 10) / 10;
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
        <AlertTitle>Couldn’t load candidates</AlertTitle>
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
      <div className="rounded-xl border border-dashed bg-card/50 p-10 text-center">
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
            const recommended =
              (
                candidate.feedback?.feedback?.recommendation || ""
              ).toLowerCase() === "yes";

            return (
              <div
                key={index}
                className="group flex items-center justify-between rounded-lg border bg-gradient-to-br from-primary/10 via-secondary/10 to-muted/10 p-5"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {getInitials(candidate.userName)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{candidate.userName}</h3>
                      {recommended ? (
                        <Badge
                          variant="outline"
                          className="border-primary/30 text-primary inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Recommended
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-destructive/30 text-destructive inline-flex items-center gap-1"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Not Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Completed on{" "}
                      {moment(candidate.created_at).format("MMM DD, YYYY")} •
                      Avg {avg}/10
                    </p>
                  </div>
                </div>

                <Button onClick={() => setSelectedCandidate(candidate)}>
                  View Report
                </Button>
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
