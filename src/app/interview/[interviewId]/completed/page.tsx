// app/interview/[interviewId]/completed/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/supabase/supabase-client";
import { toast } from "sonner";
import {
  CheckCircle2,
  Download,
  Home,
  Loader2,
  AlertCircle,
  Trophy,
  Target,
  MessageSquare,
  TrendingUp,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { downloadInterviewPDF } from "@/lib/pdf-generator";
import type {
  FeedbackContent,
  InterviewInfo,
  InterviewFeedback,
} from "@/types/interview";

interface FeedbackData {
  feedback: FeedbackContent;
  interviewInfo: InterviewInfo;
  createdAt: string;
}

const getScoreColor = (score: number): string => {
  if (score >= 8) return "text-green-500";
  if (score >= 6) return "text-emerald-500";
  if (score >= 4) return "text-yellow-500";
  return "text-red-500";
};

const getScoreBgColor = (score: number): string => {
  if (score >= 8) return "bg-green-500/10";
  if (score >= 6) return "bg-emerald-500/10";
  if (score >= 4) return "bg-yellow-500/10";
  return "bg-red-500/10";
};

const getRecommendationVariant = (
  recommendation: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (recommendation) {
    case "Strong Hire":
    case "Hire":
      return "default";
    case "Maybe":
      return "secondary";
    case "No Hire":
      return "destructive";
    default:
      return "outline";
  }
};

const ScoreCard = ({
  label,
  score,
  icon: Icon,
}: {
  label: string;
  score: number;
  icon: React.ElementType;
}) => (
  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
    <div className={cn("p-2 rounded-lg", getScoreBgColor(score))}>
      <Icon className={cn("h-5 w-5", getScoreColor(score))} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-muted-foreground truncate">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        <Progress value={score * 10} className="h-2 flex-1" />
        <span className={cn("text-sm font-bold", getScoreColor(score))}>
          {score}/10
        </span>
      </div>
    </div>
  </div>
);

const CompletedInterviewPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const interviewId =
    typeof params.interviewId === "string"
      ? params.interviewId
      : params.interviewId?.[0];

  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Check for error params
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "no-conversation") {
      setError("No conversation was recorded. Unable to generate feedback.");
    } else if (errorParam === "feedback-failed") {
      setError("Failed to generate feedback. Please try again.");
    }
  }, [searchParams]);

  // Fetch feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!interviewId) {
        setError("Interview ID not found");
        setLoading(false);
        return;
      }

      try {
        // Fetch feedback
        const { data: feedbackResult, error: feedbackError } = await supabase
          .from("interview-feedback")
          .select("*")
          .eq("interview_id", interviewId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (feedbackError) {
          console.error("Feedback fetch error:", feedbackError);
          setError("Feedback not found for this interview.");
          setLoading(false);
          return;
        }

        // Fetch interview info
        const { data: interviewResult, error: interviewError } = await supabase
          .from("Interviews")
          .select("*")
          .eq("interview_id", interviewId)
          .single();

        if (interviewError) {
          console.error("Interview fetch error:", interviewError);
        }

        const feedback = feedbackResult as InterviewFeedback;

        setFeedbackData({
          feedback: feedback.feedback,
          interviewInfo: {
            interview_id: interviewId,
            jobPosition: interviewResult?.jobPosition || "N/A",
            jobDescription: interviewResult?.jobDescription || "",
            duration: interviewResult?.duration || "N/A",
            type: interviewResult?.type || "N/A",
            userName: feedback.userName,
            userEmail: feedback.userEmail,
            questionList: interviewResult?.questionList || [],
          },
          createdAt: feedback.created_at,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while loading the feedback.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [interviewId]);

  const handleDownloadPDF = async () => {
    if (!feedbackData) return;

    setDownloading(true);
    try {
      await downloadInterviewPDF({
        feedback: feedbackData.feedback,
        interviewInfo: feedbackData.interviewInfo,
        completedAt: new Date(feedbackData.createdAt),
      });
      toast.success("PDF report downloaded successfully!");
    } catch (err) {
      console.error("PDF download error:", err);
      toast.error("Failed to download PDF report");
    } finally {
      setDownloading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your feedback...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !feedbackData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold">Unable to Load Feedback</h2>
              <p className="text-muted-foreground">
                {error || "Something went wrong. Please try again."}
              </p>
              <Button onClick={() => router.push("/")} className="mt-4">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { feedback, interviewInfo } = feedbackData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Interview Completed</h1>
                <p className="text-sm text-muted-foreground">
                  {interviewInfo.jobPosition}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => router.push("/")}>
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button onClick={handleDownloadPDF} disabled={downloading}>
                {downloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Overall Score Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Score Circle */}
              <div className="flex items-center gap-6">
                <div
                  className={cn(
                    "h-24 w-24 rounded-full flex flex-col items-center justify-center",
                    getScoreBgColor(feedback.rating.overall)
                  )}
                >
                  <span
                    className={cn(
                      "text-3xl font-bold",
                      getScoreColor(feedback.rating.overall)
                    )}
                  >
                    {feedback.rating.overall.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">/10</span>
                </div>

                <div>
                  <Badge
                    variant={getRecommendationVariant(feedback.recommendation)}
                    className="text-sm px-3 py-1"
                  >
                    {feedback.recommendation}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Overall Performance Score
                  </p>
                </div>
              </div>

              {/* Candidate Info */}
              <div className="md:ml-auto text-sm space-y-1">
                <p>
                  <span className="text-muted-foreground">Candidate:</span>{" "}
                  <span className="font-medium">{interviewInfo.userName}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  <span className="font-medium">{interviewInfo.userEmail}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Date:</span>{" "}
                  <span className="font-medium">
                    {new Date(feedbackData.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Score Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Performance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <ScoreCard
                label="Technical Skills"
                score={feedback.rating.technicalSkills}
                icon={TrendingUp}
              />
              <ScoreCard
                label="Communication"
                score={feedback.rating.communication}
                icon={MessageSquare}
              />
              <ScoreCard
                label="Problem Solving"
                score={feedback.rating.problemSolving}
                icon={Target}
              />
              <ScoreCard
                label="Experience"
                score={feedback.rating.experience}
                icon={Star}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {feedback.summary}
            </p>
          </CardContent>
        </Card>

        {/* Strengths & Improvements */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Trophy className="h-5 w-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feedback.strengths?.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <Target className="h-5 w-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feedback.improvements?.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feedback */}
        {feedback.detailedFeedback && feedback.detailedFeedback.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedback.detailedFeedback.map((item, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{item.category}</h4>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", getScoreColor(item.score))}
                        >
                          {item.score}/10
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.comments}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Final Recommendation */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Final Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {feedback.recommendationMsg}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CompletedInterviewPage;
