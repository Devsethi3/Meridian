"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const QuestionsSkeleton: React.FC = () => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center space-x-2">
            <div className="rounded-lg bg-secondary/10 p-2">
              <div className="h-5 w-5 rounded bg-secondary/30" />
            </div>
            <span>Interview Questions</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-semibold">
              <Skeleton className="h-4 w-24" />
            </Badge>
            <Button variant="outline" size="sm" disabled>
              <Skeleton className="h-4 w-16" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card/60 p-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="mt-3 h-12 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuestionsSkeleton;