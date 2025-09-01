"use client";

import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ErrorState from "./ErrorState";
import JobInformationSkeleton from "@/components/skeletons/JobInformationSkeleton";
import ExpandableDescription from "./ExpandableDescription";

interface JobInformationCardProps {
  position?: string | null;
  description?: string | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const JobInformationCard: React.FC<JobInformationCardProps> = ({
  position,
  description,
  loading = false,
  error = null,
  onRetry,
}) => {
  if (loading) return <JobInformationSkeleton />;
  if (error)
    return (
      <ErrorState
        title="Couldn't load job information"
        description={error}
        onRetry={onRetry}
      />
    );

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-foreground">
          <div className="rounded-lg bg-primary/10 p-2">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <span>Job Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Position
          </h3>
          <p className="text-lg font-semibold text-foreground">
            {position || "—"}
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Description
          </h3>
          {description ? (
            <div className="prose prose-sm max-w-none">
              <ExpandableDescription text={description} collapsedHeight={70} />
            </div>
          ) : (
            <p className="text-muted-foreground">No description provided.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobInformationCard;
