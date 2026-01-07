// app/interview/[interviewId]/start/_components/InterviewDetails.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Briefcase, User, Mail, Clock, FileText } from "lucide-react";
import type { InterviewInfo } from "@/types/interview";

interface InterviewDetailsProps {
  interviewInfo?: InterviewInfo | null;
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

const DetailRow = ({ icon, label, value }: DetailRowProps) => (
  <div className="flex items-start gap-3">
    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-sm truncate">{value || "—"}</p>
    </div>
  </div>
);

export const InterviewDetails = ({ interviewInfo }: InterviewDetailsProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <h3 className="font-semibold">Interview Details</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailRow
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
          label="Position"
          value={interviewInfo?.jobPosition}
        />
        <DetailRow
          icon={<User className="h-4 w-4 text-muted-foreground" />}
          label="Candidate"
          value={interviewInfo?.userName}
        />
        <DetailRow
          icon={<Mail className="h-4 w-4 text-muted-foreground" />}
          label="Email"
          value={interviewInfo?.userEmail}
        />
        <DetailRow
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          label="Duration"
          value={
            interviewInfo?.duration
              ? `${interviewInfo.duration} minutes`
              : undefined
          }
        />
        <DetailRow
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          label="Type"
          value={interviewInfo?.type}
        />
      </CardContent>
    </Card>
  );
};
