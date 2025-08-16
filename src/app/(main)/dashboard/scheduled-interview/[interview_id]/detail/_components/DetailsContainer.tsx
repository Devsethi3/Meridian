"use client";

import {
  Briefcase,
  CalendarDays,
  Clock,
  FileText,
  Mail,
  Copy,
  Check,
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
import { toast } from "sonner";

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
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [copiedAll, setCopiedAll] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Set<number>>(new Set());

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

  const handleCopyQuestion = async (idx: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      toast.success("Question copied");
      setTimeout(
        () => setCopiedIndex((cur) => (cur === idx ? null : cur)),
        1000
      );
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleCopyAll = async (questions: Array<{ question: string }>) => {
    try {
      const combined = questions
        .map((q, i) => `Q${i + 1}. ${q.question}`)
        .join("\n");
      await navigator.clipboard.writeText(combined);
      setCopiedAll(true);
      toast.success("All questions copied");
      setTimeout(() => setCopiedAll(false), 1200);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const toggleExpanded = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const getTypeBadgeClass = (type?: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes("technical"))
      return "border-primary/30 bg-primary/10 text-primary";
    if (t.includes("behavior"))
      return "border-amber-400/30 bg-amber-400/10 text-amber-500";
    if (t.includes("experience"))
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-600";
    if (t.includes("problem"))
      return "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-600";
    if (t.includes("system"))
      return "border-sky-400/30 bg-sky-400/10 text-sky-600";
    return "border-muted-foreground/30 bg-muted/20 text-muted-foreground";
  };

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

  // Normalize question list to array
  const rawList: any = interviewDetail.questionList ?? [];
  const questions: Array<{ question: string; type?: string }> = Array.isArray(
    rawList
  )
    ? rawList
    : Object.keys(rawList || {})
        .filter((key) => key !== "length" && !isNaN(Number(key)))
        .map((key) => rawList[Number(key)])
        .filter(Boolean);

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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <div className="rounded-lg bg-secondary/10 p-2">
                <FileText className="h-5 w-5 text-secondary-foreground" />
              </div>
              <span>Interview Questions</span>
            </CardTitle>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-semibold">
                {questions.length} Questions
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyAll(questions)}
                disabled={questions.length === 0}
                className="gap-2"
                aria-label="Copy all questions"
              >
                {copiedAll ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy All
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {questions.length === 0 ? (
            <div className="py-10 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                No questions available for this interview.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 sm:gap-4">
              {questions.map((q, index) => {
                const text = q?.question || "";
                const type = q?.type as string | undefined;
                const isExpanded = expanded.has(index);

                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card/60 p-4 transition-colors hover:bg-card hover:shadow-md sm:p-5"
                  >
                    {/* Accent bar */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-secondary/60 to-primary/60 opacity-70 group-hover:opacity-100" />

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {/* Number bubble */}
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted/40 text-xs font-semibold text-foreground">
                          {index + 1}
                        </div>

                        {/* Type badge (if available) */}
                        {type ? (
                          <Badge
                            variant="outline"
                            className={`px-2 py-0.5 text-xs ${getTypeBadgeClass(
                              type
                            )}`}
                            title={type}
                          >
                            {type}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="px-2 py-0.5 text-xs border-muted-foreground/20 text-muted-foreground"
                          >
                            General
                          </Badge>
                        )}
                      </div>

                      {/* Copy single */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopyQuestion(index, text)}
                        aria-label={`Copy question ${index + 1}`}
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Text */}
                    <div className="mt-3">
                      <p
                        className={[
                          "text-foreground leading-relaxed",
                          isExpanded ? "" : "line-clamp-3",
                        ].join(" ")}
                      >
                        {text}
                      </p>

                      {/* Expand/Collapse */}
                      {text && text.length > 140 && (
                        <button
                          className="mt-2 text-xs font-medium text-primary underline-offset-2 hover:underline"
                          onClick={() => toggleExpanded(index)}
                          aria-expanded={isExpanded}
                          aria-controls={`q-${index}`}
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsContainer;
