"use client";

import {
  Briefcase,
  CalendarDays,
  Clock,
  FileText,
  Mail,
  Copy,
} from "lucide-react";
import { InterviewDetail } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import moment from "moment";
import StatChip from "./StatChip";
import * as React from "react";
import ExpandableDescription from "./ExpandableDescription";

interface DetailsContainerProps {
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
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    if (!interviewDetail?.userEmail) return;
    try {
      await navigator.clipboard.writeText(interviewDetail.userEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // noop
    }
  }, [interviewDetail?.userEmail]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/10 to-muted/10" />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-7 w-44" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="rounded-lg border border-border bg-background/60 px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Job Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-5 w-64" />
            </div>
            <div>
              <Skeleton className="mb-2 h-4 w-28" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Interview Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-l-4 border-muted pl-4">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="mt-2 h-5 w-3/4" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="border border-destructive/30">
        <AlertTitle>Couldn’t load interview details</AlertTitle>
        <AlertDescription className="mt-1">
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

  if (!interviewDetail) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">
          No interview details available.
        </CardContent>
      </Card>
    );
  }

  // Convert questionList object to array for easier rendering
  const questions = Object.keys(interviewDetail.questionList || {})
    .filter((key) => key !== "length" && !isNaN(Number(key)))
    .map((key) => interviewDetail.questionList[Number(key)]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/5 to-muted/5" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">
                {interviewDetail.jobPosition}
              </h1>
              <div className="text-sm text-muted-foreground">
                Interview overview and metadata
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background/60 px-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground truncate max-w-[220px]">
                  {interviewDetail.userEmail}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopy}
                  aria-label="Copy email"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {copied && <span className="text-xs text-primary">Copied</span>}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatChip
              icon={<CalendarDays className="h-4 w-4" />}
              label="Created"
              value={moment(interviewDetail.created_at).format("MMM DD, YYYY")}
            />
            <StatChip
              icon={<Clock className="h-4 w-4" />}
              label="Duration"
              value={interviewDetail.duration || "—"}
            />
            <StatChip
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={interviewDetail.userEmail}
              truncate
            />
            <StatChip
              icon={<FileText className="h-4 w-4" />}
              label="Interview Type"
              value={interviewDetail.type || "—"}
            />
          </div>
        </div>
      </div>

      {/* Job Information */}
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
              {interviewDetail.jobPosition}
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Description
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed">
                <ExpandableDescription
                  text={interviewDetail.jobDescription}
                  collapsedHeight={70}
                />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <div className="rounded-lg bg-secondary/10 p-2">
                <FileText className="h-5 w-5 text-secondary-foreground" />
              </div>
              <span>Interview Questions</span>
            </CardTitle>
            <Badge variant="outline" className="font-semibold">
              {questions.length} Questions
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No questions available for this interview.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="group relative rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors p-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Badge
                        variant="secondary"
                        className="font-bold group-hover:scale-105 transition-transform"
                      >
                        Q{index + 1}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground leading-relaxed font-medium">
                        {question.question}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsContainer;
