"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InterviewContext } from "@/context/InterviewContext";
import type { InterviewFormData, InterviewInfo } from "@/lib/types";
import { supabase } from "@/supabase/supabase-client";
import { Clock, Info, Loader2, Sparkles, Video } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState, FormEvent } from "react";
import { toast } from "sonner";

const InterviewIdPage = () => {
  const { interviewId } = useParams() as { interviewId: string };
  const router = useRouter();
  const [interviewData, setInterviewData] = useState<InterviewFormData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("InterviewContext must be used within a provider");
  }
  const { setInterviewInfo } = context;

  useEffect(() => {
    const getInterviewDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Interviews")
          .select("*")
          .eq("interview_id", interviewId)
          .single();

        if (error || !data) {
          throw new Error(error?.message || "Interview not found");
        }

        setInterviewData(data as InterviewInfo); // <-- cast here
      } catch (error) {
        toast.error(
          "Failed to fetch interview details. Please check the link."
        );
        setInterviewData(null);
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      getInterviewDetails();
    }
  }, [interviewId]);

  const onJoinInterview = (e: FormEvent) => {
    e.preventDefault();
    if (!interviewData) {
      toast.error("Interview data is not available. Cannot proceed.");
      return;
    }

    setSubmitting(true);
    setInterviewInfo({
      ...(interviewData as InterviewInfo),
      userName,
      userEmail,
    });

    router.push(`/interview/${interviewId}/start`);
    // No need to setSubmitting(false) as the user is navigated away
  };

  // Initial Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Error State if interview not found
  if (!interviewData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Interview Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The link may be invalid or the interview may have been deleted.
        </p>
        <Button onClick={() => router.push("/")} className="mt-6">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-card shadow-xl lg:grid-cols-2">
        {/* Left Side: Branding & Image */}
        <div className="hidden flex-col items-center justify-center gap-6 bg-muted/50 p-8 text-center lg:flex">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-widest">
              <span className="text-primary">First</span>View
            </h2>
          </div>
          <p className="text-muted-foreground">AI-Powered Interview Platform</p>
          <Image
            src="/interview.svg"
            width={300}
            height={300}
            alt="An illustration of a person being interviewed online"
            priority
          />
        </div>

        {/* Right Side: Form & Details */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md space-y-6">
            <header className="text-center">
              <h1 className="text-2xl font-bold text-foreground">
                {interviewData.jobPosition}
              </h1>
              <div className="mt-3 flex items-center flex-wrap justify-center lg:gap-6 gap-1 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {interviewData.duration} Minutes
                </span>
                <span className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  {interviewData.type} Interview
                </span>
              </div>
            </header>

            <form onSubmit={onJoinInterview} className="space-y-4">
              <div>
                <label
                  htmlFor="userName"
                  className="mb-1.5 block text-sm font-medium text-muted-foreground"
                >
                  Full Name
                </label>
                <Input
                  id="userName"
                  placeholder="e.g., John Doe"
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="userEmail"
                  className="mb-1.5 block text-sm font-medium text-muted-foreground"
                >
                  Email Address
                </label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="e.g., name@example.com"
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>

              <div className="!mt-6 rounded-lg border border-primary/20 bg-primary/10 p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">
                      Before you begin
                    </h3>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-primary/80">
                      <li>Ensure you have a stable internet connection.</li>
                      <li>Test your camera and microphone beforehand.</li>
                      <li>Find a quiet, well-lit place for the interview.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting || !userName || !userEmail}
                className="w-full !mt-6 h-12 text-base font-semibold"
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Video className="mr-2 h-5 w-5" />
                )}
                Join Interview
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewIdPage;
