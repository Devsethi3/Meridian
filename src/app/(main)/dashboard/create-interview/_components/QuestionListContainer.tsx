"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { FC } from "react";

interface Question {
  question: string;
  type: string;
}

interface QuestionListContainerProps {
  questionList: Question[];
}

// Refactored to a map for better readability and maintainability.
const typeColors: { [key: string]: string } = {
  system:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 border-indigo-300/50",
  behavioral:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-amber-300/50",
  design:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200 border-purple-300/50",
  technical:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-300/50",
  general:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-300/50",
};

const getTypeColor = (type: string) => {
  const key = type.toLowerCase();
  return typeColors[key] || typeColors.general;
};

const QuestionListContainer: FC<QuestionListContainerProps> = ({
  questionList,
}) => {
  if (!questionList || questionList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          No Questions Found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The generated question list is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="list">
      {questionList.map((item, index) => (
        <QuestionItem
          key={`${index}-${item.question.slice(0, 16)}`}
          index={index}
          item={item}
        />
      ))}
    </div>
  );
};

const QuestionItem = ({ item, index }: { item: Question; index: number }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(item.question);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      className="rounded-lg border bg-card lg:p-4 p-2 transition-colors hover:bg-muted/40"
      role="listitem"
      aria-labelledby={`question-text-${index}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Question Content */}
        <div className="flex flex-1 items-start gap-4">
          <span className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border bg-background text-xs font-semibold text-muted-foreground">
            {index + 1}
          </span>
          <div className="flex-1">
            <p
              id={`question-text-${index}`}
              className="lg:text-base text-sm leading-relaxed text-foreground"
            >
              {item.question}
            </p>
            <div className="mt-2.5">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${getTypeColor(
                  item.type || "General"
                )}`}
              >
                {item.type || "General"}
              </span>
            </div>
          </div>
        </div>

        {/* Copy Button - stacks on mobile */}
        <div className="flex-shrink-0 self-end sm:self-start">
          <button
            onClick={copyToClipboard}
            className="inline-flex cursor-pointer h-9 w-24 items-center justify-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1 text-sm font-medium text-muted-foreground transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Copy question to clipboard"
            title="Copy question"
            disabled={copied}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionListContainer;
