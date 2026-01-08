// app/interview/[interviewId]/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  Clock,
  Info,
  Loader2,
  Sparkles,
  Video,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useInterviewContext } from "@/hooks/useInterviewContext";
import { supabase } from "@/supabase/supabase-client";
import { InterviewInfo } from "@/lib/types";

const InterviewJoinPage = () => {
  const params = useParams();
  const router = useRouter();
  const { setInterviewInfo } = useInterviewContext();

  const interviewId =
    typeof params.interviewId === "string"
      ? params.interviewId
      : params.interviewId?.[0];

  const [interviewData, setInterviewData] = useState<InterviewInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      if (!interviewId) {
        toast.error("Invalid interview link");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("Interviews")
          .select("*")
          .eq("interview_id", interviewId)
          .single();

        if (error || !data) {
          throw new Error(error?.message || "Interview not found");
        }

        setInterviewData(data as InterviewInfo);
      } catch (error) {
        console.error("Failed to fetch interview:", error);
        toast.error("Failed to load interview details");
        setInterviewData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [interviewId]);

  const handleJoinInterview = (e: FormEvent) => {
    e.preventDefault();

    if (!interviewData) {
      toast.error("Interview data not available");
      return;
    }

    if (!userName.trim() || !userEmail.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSubmitting(true);

    setInterviewInfo({
      ...interviewData,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
    });

    router.push(`/interview/${interviewId}/start`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading interview details...</p>
        </div>
      </div>
    );
  }

  // Error state - Interview not found
  if (!interviewData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <Info className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold">Interview Not Found</h1>
              <p className="text-muted-foreground">
                The interview link may be invalid or the interview has been
                removed.
              </p>
              <Button onClick={() => router.push("/")} className="mt-4">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-card shadow-xl border lg:grid-cols-2">
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-primary/5 to-primary/10 p-10">
          <div className="flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-primary" />
            <h2 className="text-4xl font-bold">
              <span className="text-primary">Meri</span>dian
            </h2>
          </div>
          <p className="text-muted-foreground text-center max-w-xs">
            AI-Powered Interview Platform for Modern Hiring
          </p>
          <Image
            src="/interview.svg"
            width={280}
            height={280}
            alt="Interview illustration"
            priority
            className="mt-4"
          />

          {/* Features */}
          <div className="space-y-3 mt-4">
            {[
              "Real-time AI conversation",
              "Instant feedback & scoring",
              "Professional PDF reports",
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <div className="w-full max-w-md mx-auto space-y-6">
            {/* Mobile branding */}
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">
                <span className="text-primary">Meri</span>dian
              </span>
            </div>

            {/* Header */}
            <header className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
                <Briefcase className="h-4 w-4" />
                Interview Session
              </div>
              <h1 className="text-2xl font-bold">
                {interviewData.jobPosition}
              </h1>
              <div className="mt-3 flex items-center flex-wrap justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {interviewData.duration} Minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <Video className="h-4 w-4" />
                  {interviewData.type} Interview
                </span>
              </div>
            </header>

            {/* Form */}
            <form onSubmit={handleJoinInterview} className="space-y-4">
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
                >
                  Full Name
                </label>
                <Input
                  id="userName"
                  placeholder="e.g., John Doe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  disabled={submitting}
                  className="h-11"
                />
              </div>

              <div>
                <label
                  htmlFor="userEmail"
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
                >
                  Email Address
                </label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="e.g., name@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  disabled={submitting}
                  className="h-11"
                />
              </div>

              {/* Tips */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-primary text-sm">
                      Before you begin
                    </h3>
                    <ul className="mt-2 space-y-1.5 text-sm text-primary/80">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                        Ensure stable internet connection
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                        Test your microphone beforehand
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                        Find a quiet, well-lit space
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting || !userName.trim() || !userEmail.trim()}
                className="w-full h-12 text-base font-semibold mt-6"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Preparing Interview...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-5 w-5" />
                    Join Interview
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground">
              By joining, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewJoinPage;
