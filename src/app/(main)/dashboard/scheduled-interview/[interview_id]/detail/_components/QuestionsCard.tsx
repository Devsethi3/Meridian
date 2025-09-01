"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import ErrorState from "./ErrorState";
import QuestionItem from "./QuestionItem";
import EmptyState from "./EmptyState";
import { NormalizedQuestion } from "./utils";
import QuestionsSkeleton from "@/components/skeletons/QuestionsSkeleton";

interface QuestionsCardProps {
  questions: NormalizedQuestion[] | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const QuestionsCard: React.FC<QuestionsCardProps> = ({
  questions,
  loading = false,
  error = null,
  onRetry,
}) => {
  const [copiedAll, setCopiedAll] = React.useState(false);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [expanded, setExpanded] = React.useState<Set<number>>(new Set());

  const safeQuestions = React.useMemo(() => questions ?? [], [questions]);

  const toggleExpanded = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const handleCopyQuestion = async (idx: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      toast.success("Question copied");
      setTimeout(() => setCopiedIndex((cur) => (cur === idx ? null : cur)), 1000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleCopyAll = async () => {
    try {
      const combined = safeQuestions.map((q, i) => `Q${i + 1}. ${q.question}`).join("\n");
      await navigator.clipboard.writeText(combined);
      setCopiedAll(true);
      toast.success("All questions copied");
      setTimeout(() => setCopiedAll(false), 1200);
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (loading) return <QuestionsSkeleton />;
  if (error)
    return (
      <ErrorState title="Couldn't load interview questions" description={error} onRetry={onRetry} />
    );

  return (
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
              {safeQuestions.length} Questions
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAll}
              disabled={safeQuestions.length === 0}
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
        {safeQuestions.length === 0 ? (
          <EmptyState
            icon={<FileText className="mx-auto h-10 w-10 text-muted-foreground" />}
            title="No questions available"
            description="This interview currently has no questions."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 sm:gap-4">
            {safeQuestions.map((q, index) => {
              const isExpanded = expanded.has(index);
              return (
                <QuestionItem
                  key={index}
                  index={index}
                  text={q.question || ""}
                  type={q.type}
                  copied={copiedIndex === index}
                  isExpanded={isExpanded}
                  onCopy={() => handleCopyQuestion(index, q.question || "")}
                  onToggle={() => toggleExpanded(index)}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionsCard;