"use client";

import * as React from "react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase-client";
import { useParams } from "next/navigation";
import DetailsContainer from "./_components/DetailsContainer";
import CandidateList from "./_components/CandidateList";
import { InterviewDetail } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const InterviewDetailsPage: React.FC = () => {
  const { interview_id } = useParams();
  const interviewId =
    Array.isArray(interview_id) ? interview_id[0] : (interview_id as string | undefined);

  const { user } = useUser();

  const [interviewDetail, setInterviewDetail] = React.useState<InterviewDetail | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<number | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const fetchInterviewDetail = React.useCallback(async () => {
    if (!user?.email || !interviewId) return;

    setLoading(true);
    setError(null);

    let isActive = true;
    try {
      const { data, error: qError } = await supabase
        .from("Interviews")
        .select(`*, "interview-feedback"(userEmail, userName, feedback, created_at)`)
        .eq("userEmail", user.email)
        .eq("interview_id", interviewId)
        .limit(1);

      if (!isActive) return;

      if (qError) {
        setError(qError.message);
        setInterviewDetail(null);
        setLoading(false);
        return;
      }

      const row = data && data.length > 0 ? (data[0] as InterviewDetail) : null;
      setInterviewDetail(row);
      setLastUpdated(Date.now());
    } catch (e: any) {
      if (!isActive) return;
      setError(e?.message || "Unexpected error");
      setInterviewDetail(null);
    } finally {
      if (isActive) setLoading(false);
    }

    return () => {
      isActive = false;
    };
  }, [user?.email, interviewId]);

  React.useEffect(() => {
    if (!user?.email || !interviewId) return;
    fetchInterviewDetail();
  }, [user?.email, interviewId, fetchInterviewDetail, refreshKey]);

  const handleRetry = () => setRefreshKey((k) => k + 1);

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">Interview Details</h1>
          <p className="text-sm text-muted-foreground">
            {lastUpdated ? `Last updated ${new Date(lastUpdated).toLocaleTimeString()}` : "—"}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRetry}
          disabled={loading}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <DetailsContainer
        interviewDetail={interviewDetail}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />

      <CandidateList
        candidates={interviewDetail?.["interview-feedback"]}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default InterviewDetailsPage;