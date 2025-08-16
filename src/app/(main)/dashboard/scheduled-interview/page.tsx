"use client";

import { useUser } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase-client";
import { useEffect, useState, useCallback } from "react";
import InterviewCard from "./_components/InterviewCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface ScheduledInterviewEntry {
  userEmail: string;
}

export interface Interview {
  duration: string;
  "interview-feedback": ScheduledInterviewEntry[];
  interview_id: string;
  jobPosition: string;
}

const InterviewCardSkeleton = () => (
  <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-5 w-40" />
      </div>
      <Skeleton className="h-6 w-28 rounded-full" />
    </div>
    <div className="mb-3 grid grid-cols-2 gap-2">
      <div className="rounded-md border border-border bg-muted/50 p-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-2 h-4 w-24" />
      </div>
      <div className="rounded-md border border-border bg-muted/50 p-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-2 h-4 w-16" />
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between gap-2">
      <Skeleton className="h-9 w-24 rounded-md" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  </div>
);

const ScheduledInterview = () => {
  const [interviewList, setInterviewList] = useState<Interview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const getInterviewResult = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("Interviews")
      .select(`*, interview-feedback(userEmail)`)
      .eq("userEmail", user.email)
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching interview results:", error);
      setError(error.message || "Failed to load interviews.");
      setLoading(false);
      return;
    }

    setInterviewList((data as unknown as Interview[]) ?? []);
    setLoading(false);
  }, [user?.email]);

  useEffect(() => {
    getInterviewResult();
  }, [getInterviewResult]);

  const isEmpty = !loading && (!interviewList || interviewList.length === 0);

  return (
    <div className="my-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold">
          Interview List with Candidate Feedback
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your interviews and share links with candidates.
        </p>
      </div>

      {error && (
        <div className="mt-6">
          <Alert variant="destructive" className="border border-destructive/30">
            <AlertTitle>Couldn’t load interviews</AlertTitle>
            <AlertDescription className="mt-1">
              {error}
              <div className="mt-3">
                <Button
                  variant="outline"
                  onClick={getInterviewResult}
                  className="gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {loading && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
          <InterviewCardSkeleton />
          <InterviewCardSkeleton />
          <InterviewCardSkeleton />
        </div>
      )}

      {isEmpty && (
        <div className="mt-6 rounded-xl border border-dashed bg-card/50 p-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <span className="text-lg text-muted-foreground">🗂️</span>
          </div>
          <div className="font-medium">No interviews yet</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Create an interview to get started and share it with candidates.
          </div>
        </div>
      )}

      {!loading && !error && !isEmpty && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
          {interviewList.map((interview) => (
            <InterviewCard interview={interview} key={interview.interview_id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledInterview;
