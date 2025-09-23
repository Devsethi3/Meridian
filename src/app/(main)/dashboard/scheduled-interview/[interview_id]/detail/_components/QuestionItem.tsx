"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { getTypeBadgeClass } from "./utils";

interface QuestionItemProps {
  index: number;
  text: string;
  type?: string;
  copied?: boolean;
  isExpanded: boolean;
  onCopy: () => void;
  onToggle: () => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  index,
  text,
  type,
  copied = false,
  isExpanded,
  onCopy,
  onToggle,
}) => {
  const showToggle = text && text.length > 140;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card/60 p-4 transition-colors hover:bg-card hover:shadow-md sm:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-secondary" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted/40 text-xs font-semibold text-foreground">
            {index + 1}
          </div>

          {type ? (
            <Badge
              variant="outline"
              className={`px-2 py-0.5 text-xs ${getTypeBadgeClass(type)}`}
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

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onCopy}
          aria-label={`Copy question ${index + 1}`}
        >
          {copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="mt-3">
        <p className={["text-foreground leading-relaxed", isExpanded ? "" : "line-clamp-3"].join(" ")}>
          {text}
        </p>

        {showToggle && (
          <button
            className="mt-2 text-xs font-medium text-primary underline-offset-2 hover:underline"
            onClick={onToggle}
            aria-expanded={isExpanded}
            aria-controls={`q-${index}`}
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionItem;