"use client";

import * as React from "react";
import { InterviewDetail } from "@/lib/types";
import InterviewHeader from "./InterviewHeader";
import JobInformationCard from "./JobInformationCard";
import QuestionsCard from "./QuestionsCard";
import { normalizeQuestions } from "./utils";
import EmptyState from "./EmptyState";
import { FileText } from "lucide-react";

export interface DetailsContainerProps {
  interviewDetail: InterviewDetail | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const DetailsContainer: React.FC<DetailsContainerProps> = ({
  interviewDetail,
  loading = false,
  error = null,
  onRetry,
}) => {
  const questions = React.useMemo(
    () => normalizeQuestions(interviewDetail?.questionList),
    [interviewDetail?.questionList]
  );

  // If nothing to render
  if (!loading && !error && !interviewDetail) {
    return (
      <EmptyState
        icon={<FileText className="mx-auto h-10 w-10 text-muted-foreground" />}
        title="No interview details available"
        description="We couldn't find any data for this interview."
      />
    );
  }

  return (
    <div className="space-y-6">
      <InterviewHeader
        interview={interviewDetail}
        loading={loading}
        error={error}
        onRetry={onRetry}
      />

      <JobInformationCard
        position={interviewDetail?.jobPosition}
        description={interviewDetail?.jobDescription}
        loading={loading}
        error={error}
        onRetry={onRetry}
      />

      <QuestionsCard
        questions={questions}
        loading={loading}
        error={error}
        onRetry={onRetry}
      />
    </div>
  );
};

export default DetailsContainer;
