"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const JobInformationSkeleton: React.FC = () => {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <div className="h-5 w-5 rounded bg-primary/30" />
          </div>
          <span>Job Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-64" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-20 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default JobInformationSkeleton;