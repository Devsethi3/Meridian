"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  FileText,
  ListChecks,
  Share2,
  ChevronLeft,
  ChevronRight,
  Clock,
  List,
  Calendar,
} from "lucide-react";

import FormContainer from "./_components/FormContainer";
import QuestionList from "./_components/QuestionList";
import InterviewLink from "./_components/InterviewLink";
import type { InterviewFormData } from "@/lib/types";

type StepMeta = {
  title: string;
  hint: string;
  icon: React.ElementType;
};

const stepsMeta: StepMeta[] = [
  { title: "Details", hint: "Role & settings", icon: FileText },
  { title: "Questions", hint: "Review & edit", icon: ListChecks },
  { title: "Share", hint: "Invite link", icon: Share2 },
];

const CreateInterviewPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<InterviewFormData>({});
  const [interviewId, setInterviewId] = useState<string | undefined>();

  const totalSteps = stepsMeta.length;

  const handleInputChange = (field: keyof InterviewFormData, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      console.log("formData", next);
      return next;
    });
  };

  const isStepOneComplete = useMemo(
    () =>
      !!formData?.jobPosition &&
      !!formData?.jobDescription &&
      !!formData?.duration &&
      !!formData?.type,
    [formData]
  );

  const onGoToNext = useCallback(() => {
    if (step === 1 && !isStepOneComplete) {
      toast.error("Please enter all details");
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps));
  }, [step, isStepOneComplete, totalSteps]);

  const onCreateLink = (interview_id: string) => {
    setInterviewId(interview_id);
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const goPrevStep = () => setStep((s) => Math.max(1, s - 1));

  // Smooth scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Keyboard navigation: Alt+Left = back, Alt+Right = next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        goPrevStep();
      }
      if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        onGoToNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onGoToNext]);

  const onClickStep = useCallback(
    (idx: number) => {
      // Allow jumping back
      if (idx < step) return setStep(idx);
      // Gate forward movement
      if (idx === 2) {
        if (!isStepOneComplete) {
          toast.error("Please complete the details first");
          return;
        }
        return setStep(2);
      }
      if (idx === 3) {
        if (!interviewId) {
          toast.message("Save your questions first", {
            description: "Generate and save questions to create a share link.",
          });
          return;
        }
        return setStep(3);
      }
    },
    [step, isStepOneComplete, interviewId]
  );

  const SegmentedProgress = ({
    total,
    current,
  }: {
    total: number;
    current: number;
  }) => (
    <div
      className="flex items-center gap-3"
      aria-label={`Step ${current} of ${total}`}
      role="status"
      aria-live="polite"
    >
      <span className="text-xs text-muted-foreground">
        Step {current} of {total}
      </span>
      <div className="flex items-center gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={[
              "h-1.5 w-6 sm:w-8 rounded-full transition-colors",
              i < current ? "bg-primary" : "bg-muted",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );

  const SummaryRow = () => {
    const hasAny =
      !!formData?.jobPosition || !!formData?.duration || !!formData?.type;
    if (!hasAny) return null;
    return (
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
        {formData?.jobPosition && (
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="truncate max-w-[14rem] sm:max-w-[18rem]">
              {formData.jobPosition}
            </span>
          </span>
        )}
        {formData?.duration && (
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            {formData.duration}
          </span>
        )}
        {formData?.type && (
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            {formData.type}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container px-2 sm:px-4 lg:px-6 py-4 md:py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg md:text-xl font-semibold tracking-tight">
              Create New Interview
            </h1>
            {/* <SummaryRow /> */}
          </div>

          {/* Compact progress indicator */}
          <SegmentedProgress total={totalSteps} current={step} />
        </div>

        {/* Mobile stepper: scrollable chips */}
        <div className="-mx-4 mt-4 sm:hidden">
          <div className="px-4 overflow-x-auto">
            <div className="flex gap-2 pb-1">
              {stepsMeta.map((s, i) => {
                const idx = i + 1;
                const isActive = idx === step;
                const isCompleted = idx < step;
                const canClickForward =
                  (idx === 2 && isStepOneComplete) ||
                  (idx === 3 && !!interviewId);
                const canClick = idx < step || canClickForward;

                return (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => canClick && onClickStep(idx)}
                    disabled={!canClick}
                    className={[
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 whitespace-nowrap text-xs transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isCompleted
                        ? "border-primary bg-primary/10 text-primary hover:bg-primary/15"
                        : isActive
                        ? "border-primary/60 bg-muted/60 hover:bg-muted"
                        : "border-border bg-card hover:bg-muted/40",
                      !canClick && "opacity-60 cursor-not-allowed",
                    ].join(" ")}
                    aria-current={isActive ? "step" : undefined}
                    aria-disabled={!canClick}
                  >
                    <span
                      className={[
                        "grid h-6 w-6 place-items-center rounded-full border text-xs font-semibold",
                        isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : isActive
                          ? "border-primary/60 bg-background"
                          : "border-border bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {isCompleted ? <Check className="h-3.5 w-3.5" /> : idx}
                    </span>
                    {s.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop stepper */}
        <ol className="mt-4 hidden sm:grid grid-cols-3 gap-3">
          {stepsMeta.map((s, i) => {
            const idx = i + 1;
            const isActive = idx === step;
            const isCompleted = idx < step;
            const Icon = s.icon;
            const canClickForward =
              (idx === 2 && isStepOneComplete) || (idx === 3 && !!interviewId);
            const canClick = idx < step || canClickForward;

            return (
              <li key={s.title} className="relative">
                <button
                  type="button"
                  onClick={() => canClick && onClickStep(idx)}
                  disabled={!canClick}
                  className={[
                    "w-full text-left flex items-center gap-3 rounded-lg border p-3 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isCompleted
                      ? "border-primary/40 bg-primary/10 hover:bg-primary/15"
                      : isActive
                      ? "border-primary/60 bg-muted/60 hover:bg-muted"
                      : "border-border bg-card hover:bg-muted/40",
                    !canClick && "cursor-not-allowed opacity-70",
                  ].join(" ")}
                  aria-current={isActive ? "step" : undefined}
                  aria-disabled={!canClick}
                >
                  <span
                    className={[
                      "grid h-9 w-9 place-items-center rounded-full border text-[0.8rem] font-semibold",
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : isActive
                        ? "border-primary/60 bg-background text-foreground"
                        : "border-border bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : idx}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {s.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.hint}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </header>

      {/* Main content */}
      <main className="container px-0 sm:px-4 lg:px-6 pb-10">
        <section
          key={step}
          className="rounded-xl border border-border bg-card p-4 sm:p-6 md:p-8 shadow-sm motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-2"
          aria-live="polite"
        >
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">Interview details</h2>
                  <p className="text-sm text-muted-foreground">
                    Fill in the role, description, duration, and interview type.
                  </p>
                </div>
                <div className="hidden sm:block">
                  <Button
                    variant="secondary"
                    onClick={onGoToNext}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    disabled={!isStepOneComplete}
                  >
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <FormContainer
                formData={formData}
                onInputChange={handleInputChange}
                GoToNext={() => onGoToNext()}
              />

              <div className="mt-4 sm:hidden">
                <Button
                  variant="secondary"
                  onClick={onGoToNext}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  disabled={!isStepOneComplete}
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">Review questions</h2>
                  <p className="text-sm text-muted-foreground">
                    Tweak, reorder, or remove questions before generating the
                    link.
                  </p>
                </div>
                <div className="hidden sm:flex gap-2">
                  <Button variant="outline" onClick={goPrevStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </div>
              </div>

              <QuestionList
                formData={formData}
                onCreateLink={(id) => onCreateLink(id)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">
                    Share your interview
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Copy the link and share it with candidates.
                  </p>
                </div>
                <div className="hidden sm:flex gap-2">
                  <Button variant="outline" onClick={goPrevStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                {interviewId && (
                  <InterviewLink
                    interview_id={interviewId}
                    formData={formData}
                  />
                )}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="order-2 sm:order-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to previous
                </Button>
                <Button className="order-1 sm:order-2">
                  Done
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CreateInterviewPage;
