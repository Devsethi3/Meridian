"use client";

import { useId, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import { InterviewType } from "@/lib/constants";
import { InterviewFormData } from "@/lib/types";

interface FormContainerProps {
  formData: InterviewFormData;
  onInputChange: (field: keyof InterviewFormData, value: string) => void;
  GoToNext: () => void;
}

const MAX_DESC = 500;

const FormContainer = ({
  formData,
  onInputChange,
  GoToNext,
}: FormContainerProps) => {
  const positionId = useId();
  const descId = useId();
  const durationId = useId();
  const typeId = useId();

  const descLength = (formData.jobDescription || "").length;

  const isComplete = useMemo(() => {
    return Boolean(
      formData?.jobPosition &&
        formData?.jobPosition.trim() &&
        formData?.jobDescription &&
        formData?.jobDescription.trim() &&
        formData?.duration &&
        formData?.type
    );
  }, [formData]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    GoToNext();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="p-5 md:p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Job Position */}
          <div className="flex flex-col">
            <label htmlFor={positionId} className="text-sm font-medium">
              Job Position <span className="text-destructive">*</span>
            </label>
            <Input
              id={positionId}
              placeholder="e.g. Full Stack Developer"
              value={formData.jobPosition || ""}
              onChange={(e) => onInputChange("jobPosition", e.target.value)}
              className="mt-1"
              autoComplete="off"
              aria-required="true"
              aria-invalid={!formData.jobPosition ? "true" : "false"}
              aria-describedby={`${positionId}-help`}
            />
            <p
              id={`${positionId}-help`}
              className="mt-1 text-xs text-muted-foreground"
            >
              Use a clear, concise title to generate relevant questions.
            </p>
          </div>

          {/* Interview Duration */}
          <div className="flex flex-col">
            <label htmlFor={durationId} className="text-sm font-medium">
              Interview Duration <span className="text-destructive">*</span>
            </label>
            <Select
              value={formData.duration}
              onValueChange={(value) => onInputChange("duration", value)}
            >
              <SelectTrigger id={durationId} className="w-full mt-1">
                <SelectValue placeholder="Select Duration" />
              </SelectTrigger>
              <SelectContent>
                {["5 min", "15 min", "30 min", "45 min", "60 min"].map(
                  (duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose the total time candidates will get.
            </p>
          </div>

          {/* Job Description */}
          <div className="md:col-span-2">
            <label htmlFor={descId} className="text-sm font-medium">
              Job Description <span className="text-destructive">*</span>
            </label>
            <Textarea
              id={descId}
              placeholder="Describe the role, responsibilities, and key skills."
              className="mt-2 min-h-28"
              maxLength={MAX_DESC}
              value={formData.jobDescription || ""}
              onChange={(e) => onInputChange("jobDescription", e.target.value)}
              aria-required="true"
              aria-invalid={!formData.jobDescription ? "true" : "false"}
              aria-describedby={`${descId}-help ${descId}-count`}
            />
            <div className="mt-1 flex items-center justify-between">
              <p
                id={`${descId}-help`}
                className="text-xs text-muted-foreground"
              >
                Be specific. Mention tech stack, level, and must-have skills.
              </p>
              <span
                id={`${descId}-count`}
                className="text-xs text-muted-foreground"
                aria-live="polite"
              >
                {descLength}/{MAX_DESC}
              </span>
            </div>
          </div>

          {/* Interview Type */}
          <div className="md:col-span-2">
            <span id={typeId} className="text-sm font-medium">
              Interview Type <span className="text-destructive">*</span>
            </span>

            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {InterviewType.map((type, index) => {
                const selected = formData.type === type.title;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onInputChange("type", type.title)}
                    aria-pressed={selected}
                    aria-labelledby={`${typeId}-${index}`}
                    className={[
                      "flex items-center gap-2 rounded-lg border px-3 py-2 lg:text-sm text-xs transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 hover:bg-muted border-border",
                    ].join(" ")}
                  >
                    <type.icon
                      className={[
                        "h-4 w-4",
                        selected ? "opacity-90" : "text-muted-foreground",
                      ].join(" ")}
                    />
                    <span id={`${typeId}-${index}`}>{type.title}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Pick how candidates will respond (e.g., video, audio, or text).
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={!isComplete}
          aria-disabled={!isComplete}
        >
          Generate Questions
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default FormContainer;
