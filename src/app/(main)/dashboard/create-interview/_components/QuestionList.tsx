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
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [saveLoading, setSaveLoading] = useState(false);
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false); // Track if questions were generated
  const abortRef = useRef<AbortController | null>(null);
  const generationCacheRef = useRef<Map<string, Question[]>>(new Map());

  const { user } = useUser();

  // Stable key from the fields that influence generation
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

  const normalizeQuestions = useCallback((arr: any[]): Question[] => {
    const out: Question[] = [];
    const seen = new Set<string>();

    for (const item of arr) {
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

      // If already structured
      const tryArrays = (obj: any): Question[] => {
        if (!obj) return [];
        if (Array.isArray(obj)) return normalizeQuestions(obj);

        // Try different property names
        const possibleArrays = [
          obj.interviewQuestions,
          obj.questions,
          obj.items,
          obj.data,
          obj.questionList,
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
        const arr = tryArrays(content as any);
        if (arr.length) return arr;
      }

      // String content parsing
      let s = typeof content === "string" ? content : JSON.stringify(content);
      s = s.trim();

      // Remove common wrappers
      s = s
        .replace(/^\s*```(?:json)?/i, "")
        .replace(/```$/i, "")
        .replace(/^[`'"]+|[`'"]+$/g, "")
        .trim();

      // Try to extract JSON from the text
      const jsonMatches = [
        /\{[\s\S]*\}/,
        /\[[\s\S]*\]/,
        /"interviewQuestions":\s*\[[\s\S]*?\]/,
        /"questions":\s*\[[\s\S]*?\]/,
      ];

      let parsed = null;

      for (const regex of jsonMatches) {
        const match = s.match(regex);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
            break;
          } catch {
            // Try with repairs
            const repaired = match[0]
              .replace(/,\s*([}\]])/g, "$1")
              .replace(/[\u201C\u201D]/g, '"')
              .replace(/[\u2018\u2019]/g, "'")
              .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes to unquoted keys
              .replace(/:\s*'([^']*)'/g, ': "$1"'); // Convert single quotes to double

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

      // Check cache first (unless forced)
      if (!force && generationCacheRef.current.has(promptKey)) {
        const cached = generationCacheRef.current.get(promptKey)!;
        setQuestionList(cached);
        setHasGenerated(true);
        toast.success("Loaded cached questions");
        return;
      }

      setErrorMessage(null);
      setLoading(true);

      // Cancel any in-flight request
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

        const res = await axios.post("/api/ai-model", payload, {
          signal: controller.signal,
          timeout: 60000, // 60 second timeout
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Better response handling
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
          // Cache the result
          generationCacheRef.current.set(promptKey, questions);
          toast.success(`Generated ${questions.length} interview questions`);
        }
      } catch (err: any) {
        if (axios.isCancel(err)) {
          return; // Ignore cancellation
        }

        console.error("AI generation error:", err);

        let errorMsg = "Failed to generate questions. Please try again.";

        if (err.code === "ECONNABORTED") {
          errorMsg = "Request timed out. Please try again.";
        } else if (err.response?.status === 429) {
          errorMsg = "Too many requests. Please wait and try again.";
        } else if (err.response?.status >= 500) {
          errorMsg = "Server error. Please try again in a moment.";
        } else if (err.response?.data?.error) {
          errorMsg = err.response.data.error;
        }

        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [promptKey, formData, extractQuestionsFromContent]
  );

  // Don't auto-generate on mount - wait for user action
  useEffect(() => {
    return () => {
      // Cleanup: abort any pending requests
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const onFinish = async () => {
    // If no questions yet, generate them first
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
    // Clear cache for current prompt
    if (promptKey) {
      generationCacheRef.current.delete(promptKey);
    }
  };

  const isContinueDisabled = loading || saveLoading;
  const showGenerateButton =
    !hasGenerated && !loading && questionList.length === 0;

  return (
    <div className="space-y-4">
      {/* Initial state - show generate button */}
      {showGenerateButton && (
        <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Ready to generate personalized interview questions based on your job
            requirements.
          </p>
          <Button
            onClick={() => generateAiQuestionList()}
            className="gap-2"
            size="lg"
          >
            <RefreshCcw className="h-4 w-4" />
            Generate Interview Questions
          </Button>
        </div>
      )}

      {/* Loading state */}
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

      {/* Error state */}
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

      {/* Questions generated - show toolbar and list */}
      {(questionList.length > 0 || hasGenerated) && !showGenerateButton && (
        <>
          {/* Toolbar */}
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

          {/* Questions List */}
          <div className="relative">
            {/* Loading skeletons */}
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

            {/* Actual questions */}
            {!loading && questionList && questionList.length > 0 && (
              <QuestionListContainer questionList={questionList} />
            )}

            {/* Empty state after generation attempt */}
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

      {/* Continue Button */}
      <div className="flex justify-center sm:justify-end">
        <Button
          disabled={isContinueDisabled}
          size="lg"
          className="text-base sm:text-lg py-5 sm:py-6 gap-2"
          onClick={onFinish}
        >
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
