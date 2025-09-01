"use client";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const InterviewHeaderSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/10 to-muted/10" />
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="rounded-lg border border-border bg-background/60 px-3 py-2">
            <div className="flex items-center gap-2 text-sm">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewHeaderSkeleton;