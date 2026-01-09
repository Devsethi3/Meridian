"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowRight,
  Loader2,
  RefreshCcw,
  Copy,
  Trash2,
  AlertCircle,
  Sparkle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase/supabase-client";
import { useUser } from "@/context/UserContext";
import { v4 as uuidv4 } from "uuid";
import type { InterviewFormData } from "@/lib/types";
import QuestionListContainer from "./QuestionListContainer";

interface QuestionListProps {
  formData: InterviewFormData;
  onCreateLink: (interview_id: string) => void;
}

export interface Question {
  question: string;
  type: string;
}

const DURATION_TO_COUNT: Record<string, number> = {
  "5 min": 4,
  "15 min": 6,
  "30 min": 8,
  "45 min": 10,
  "60 min": 12,
};

const getSuggestedCount = (duration?: string) => {
  if (!duration) return 8;
  return DURATION_TO_COUNT[duration] ?? 8;
};

const QuestionList = ({ formData, onCreateLink }: QuestionListProps) => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const generationCacheRef = useRef<Map<string, Question[]>>(new Map());

  const { user } = useUser();

  const promptKey = useMemo(() => {
    const { jobPosition, jobDescription, duration, type } = formData || {};
    if (!jobPosition || !jobDescription || !duration || !type) return "";
    return JSON.stringify({
      jobPosition: jobPosition.trim(),
      jobDescription: jobDescription.trim(),
      duration,
      type,
    });
  }, [formData]);

  const normalizeQuestions = useCallback((arr: unknown[]): Question[] => {
    const out: Question[] = [];
    const seen = new Set<string>();

    for (const item of arr as Record<string, unknown>[]) {
      const q = (
        typeof item === "string"
          ? item
          : item?.question ?? item?.q ?? item?.text ?? ""
      )
        ?.toString()
        .trim();

      if (!q) continue;

      const type =
        (item?.type ?? item?.category ?? "General")?.toString().trim() ||
        "General";

      const key = q.toLowerCase();
      if (seen.has(key)) continue;

      seen.add(key);
      out.push({ question: q, type });
    }
    return out;
  }, []);

  const extractQuestionsFromContent = useCallback(
    (content: unknown): Question[] => {
      if (!content) return [];

      const tryArrays = (obj: unknown): Question[] => {
        if (!obj || typeof obj !== "object") return [];

        const typed = obj as Record<string, unknown>;

        const possibleArrays = [
          typed.interviewQuestions,
          typed.questions,
          typed.items,
          typed.data,
          typed.questionList,
        ];

        for (const arr of possibleArrays) {
          if (Array.isArray(arr) && arr.length > 0) {
            const normalized = normalizeQuestions(arr);
            if (normalized.length > 0) return normalized;
          }
        }

        return [];
      };

      if (typeof content === "object") {
        const arr = tryArrays(content as unknown);
        if (arr.length) return arr;
      }

      let s = typeof content === "string" ? content : JSON.stringify(content);
      s = s.trim();

      s = s
        .replace(/^\s*```(?:json)?/i, "")
        .replace(/```$/i, "")
        .replace(/^[`'"]+|[`'"]+$/g, "")
        .trim();

      const jsonMatches = [
        /\{[\s\S]*\}/,
        /```math[\s\S]*?```/g, // ✅ FIXED: Removed literal newlines
        /"interviewQuestions":\s*```math[\s\S]*?```/g, // ✅ FIXED: Removed literal newlines
        /"questions":\s*```math[\s\S]*?```/g, // ✅ FIXED: Removed literal newlines
      ];

      let parsed = null;

      for (const regex of jsonMatches) {
        const match = s.match(regex);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
            break;
          } catch {
            const repaired = match[0]
              .replace(/,\s*([}```])/g, "$1")
              .replace(/[\u201C\u201D]/g, '"')
              .replace(/[\u2018\u2019]/g, "'")
              .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
              .replace(/:\s*'([^']*)'/g, ': "$1"');

            try {
              parsed = JSON.parse(repaired);
              break;
            } catch {
              continue;
            }
          }
        }
      }

      if (!parsed) {
        console.warn("Failed to parse AI response:", s);
        return [];
      }

      return tryArrays(parsed);
    },
    [normalizeQuestions]
  );

  const generateAiQuestionList = useCallback(
    async (force = false) => {
      if (!promptKey) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (!force && generationCacheRef.current.has(promptKey)) {
        const cached = generationCacheRef.current.get(promptKey)!;
        setQuestionList(cached);
        setHasGenerated(true);
        toast.success("Loaded cached questions");
        return;
      }

      setErrorMessage(null);
      setLoading(true);

      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const payload = {
          ...formData,
          jobPosition: formData.jobPosition?.trim(),
          jobDescription: formData.jobDescription?.trim(),
          suggestedCount: getSuggestedCount(formData.duration),
        };

        // Debug only: verify the type being sent
        if (process.env.NODE_ENV !== "production") {
          // Should log the normalized value like "technical", "behavioral", etc.
          console.debug("[QuestionList] AI payload:", payload);
        }

        const res = await axios.post("/api/ai-model", payload, {
          signal: controller.signal,
          timeout: 60000,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseData = res.data;
        if (!responseData) {
          throw new Error("Empty response from AI");
        }

        const content =
          responseData.content ?? responseData.data ?? responseData;
        const questions = extractQuestionsFromContent(content);

        if (!questions.length) {
          setQuestionList([]);
          setErrorMessage(
            "AI didn't return valid questions. Please try again."
          );
          toast.error("No valid questions generated. Please try again.");
        } else {
          setQuestionList(questions);
          setHasGenerated(true);
          generationCacheRef.current.set(promptKey, questions);
          toast.success(`Generated ${questions.length} interview questions`);
        }
      } catch (err: unknown) {
        if (axios.isCancel(err)) return;

        const error = err as {
          code?: string;
          response?: {
            status?: number;
            data?: { error?: string };
          };
        };

        console.error("AI generation error:", err);

        let errorMsg = "Failed to generate questions. Please try again.";

        if (error.code === "ECONNABORTED") {
          errorMsg = "Request timed out. Please try again.";
        } else if (
          typeof error.response?.status === "number" &&
          error.response.status === 429
        ) {
          errorMsg = "Too many requests. Please wait and try again.";
        } else if (
          typeof error.response?.status === "number" &&
          error.response.status >= 500
        ) {
          errorMsg = "Server error. Please try again in a moment.";
        } else if (typeof error.response?.data?.error === "string") {
          errorMsg = error.response.data.error;
        }

        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [promptKey, formData, extractQuestionsFromContent]
  );

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const onFinish = async () => {
    if (!questionList?.length && !loading) {
      await generateAiQuestionList();
      return;
    }

    if (!questionList?.length) {
      toast.error("No questions to save");
      return;
    }

    setSaveLoading(true);
    const interview_id = uuidv4();

    try {
      const { error } = await supabase.from("Interviews").insert([
        {
          ...formData,
          questionList,
          userEmail: user?.email,
          interview_id,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        toast.error(`Failed to save interview: ${error.message}`);
        return;
      }

      toast.success("Interview saved successfully");
      onCreateLink(interview_id);
    } catch (e) {
      console.error("Save error:", e);
      toast.error("Unexpected error while saving");
    } finally {
      setSaveLoading(false);
    }
  };

  const copyAsJson = async () => {
    try {
      const jsonData = JSON.stringify(
        {
          interviewQuestions: questionList,
          metadata: {
            jobPosition: formData.jobPosition,
            duration: formData.duration,
            type: formData.type,
            generatedAt: new Date().toISOString(),
          },
        },
        null,
        2
      );

      await navigator.clipboard.writeText(jsonData);
      toast.success("Copied JSON to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const clearList = () => {
    setQuestionList([]);
    setErrorMessage(null);
    setHasGenerated(false);
    if (promptKey) {
      generationCacheRef.current.delete(promptKey);
    }
  };

  const isContinueDisabled =
    loading || saveLoading || !hasGenerated || questionList.length === 0;
  const showGenerateButton =
    !hasGenerated && !loading && questionList.length === 0;

  return (
    <div className="space-y-4">
      {showGenerateButton && (
        <div className="rounded-lg border border-border bg-muted/30 p-6 text-center flex items-center justify-center flex-col">
          <p className="text-sm text-muted-foreground mb-4">
            Ready to generate personalized interview questions based on your job
            requirements.
          </p>
          <Button
            onClick={() => generateAiQuestionList()}
            className="gap-2 text-sm hidden lg:flex"
            size="lg"
          >
            <Sparkle className="h-4 w-4" />
            Generate Interview Questions
          </Button>
          <Button
            onClick={() => generateAiQuestionList()}
            className="text-sm lg:hidden"
            size="lg"
          >
            Generate Questions
          </Button>
        </div>
      )}

      {loading && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 flex gap-4 items-start">
          <Loader2 className="animate-spin h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <h2 className="font-medium">Generating interview questions…</h2>
            <p className="text-sm text-muted-foreground">
              Our AI is crafting personalized questions based on your job
              requirements. This may take a moment.
            </p>
          </div>
        </div>
      )}

      {errorMessage && !loading && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-destructive">Generation Failed</p>
            <p className="text-muted-foreground">{errorMessage}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => generateAiQuestionList(true)}
              >
                Try Again
              </Button>
              {questionList.length > 0 && (
                <Button size="sm" variant="outline" onClick={copyAsJson}>
                  Copy Partial Results
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {(questionList.length > 0 || hasGenerated) && !showGenerateButton && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {questionList?.length ? (
                <span>
                  {questionList.length} questions generated
                  {formData?.duration ? ` • ${formData.duration}` : ""}
                </span>
              ) : (
                <span>Waiting for questions...</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateAiQuestionList(true)}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCcw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Regenerate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyAsJson}
                disabled={!questionList?.length}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy JSON
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearList}
                disabled={!questionList?.length && !hasGenerated}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <div className="relative">
            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-border bg-card animate-pulse"
                  >
                    <div className="h-4 w-2/3 bg-muted rounded mb-2" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                ))}
              </div>
            )}

            {!loading && questionList && questionList.length > 0 && (
              <QuestionListContainer questionList={questionList} />
            )}

            {!loading &&
              hasGenerated &&
              questionList.length === 0 &&
              !errorMessage && (
                <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No questions were generated. Please try again.
                  </p>
                  <div className="mt-3">
                    <Button
                      onClick={() => generateAiQuestionList(true)}
                      className="gap-2"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </>
      )}

      <div className="flex justify-center sm:justify-end">
        <Button disabled={isContinueDisabled} size="lg" onClick={onFinish}>
          {saveLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Interview...
            </>
          ) : loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Questions...
            </>
          ) : !hasGenerated || questionList.length === 0 ? (
            <>
              Generate Questions First
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Continue to Next Step
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuestionList;
