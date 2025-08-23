"use client";

import type { InterviewInfo } from "@/types/interview";

export const InterviewDetails = ({
  interviewInfo,
}: {
  interviewInfo?: InterviewInfo;
}) => {
  return (
    <div className="rounded-xl border bg-background p-6">
      <div className="font-semibold mb-2">Interview Details</div>
      <div className="space-y-2 text-sm">
        <div className="text-muted-foreground">Position</div>
        <div className="font-medium">{interviewInfo?.jobPosition || "—"}</div>
      </div>
      <div className="mt-4 space-y-1 text-sm">
        <div className="text-muted-foreground">Candidate</div>
        <div className="font-medium">{interviewInfo?.userName || "—"}</div>
        <div className="text-muted-foreground">
          {interviewInfo?.userEmail || ""}
        </div>
      </div>
    </div>
  );
};
