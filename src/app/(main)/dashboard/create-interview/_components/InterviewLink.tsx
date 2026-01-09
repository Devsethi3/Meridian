"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InterviewFormData } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  ExternalLink,
  List,
  Mail,
  Plus,
  Share2,
  Slack,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";

interface InterviewLinkProps {
  formData: InterviewFormData;
  interview_id: string;
}

const DURATION_TO_COUNT: Record<string, number> = {
  "5 min": 4,
  "15 min": 6,
  "30 min": 8,
  "45 min": 10,
  "60 min": 12,
};

const InterviewLink = ({ formData, interview_id }: InterviewLinkProps) => {
  const [copied, setCopied] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_HOST_URL?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const interviewUrl = useMemo(() => {
    return `${baseUrl}/${interview_id}`;
  }, [baseUrl, interview_id]);

  const questionsCount = useMemo(() => {
    return DURATION_TO_COUNT[formData?.duration || ""] ?? 10;
  }, [formData?.duration]);

  const expiresOn = useMemo(() => {
    const date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(interviewUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const onOpenLink = () => {
    window.open(interviewUrl, "_blank", "noopener,noreferrer");
  };

  const canNativeShare =
    typeof navigator !== "undefined" && "share" in navigator;

  const shareMessage = `You're invited to an AI interview for ${
    formData?.jobPosition ?? "a role"
  } (${formData?.duration ?? "duration"}).`;
  const shareBody = `${shareMessage}\n\nType: ${
    formData?.type ?? "—"
  }\nLink: ${interviewUrl}`;

  const onShareNative = async () => {
    if (!("share" in navigator)) return;

    try {
      await navigator.share({
        title: "AI Interview",
        text: shareMessage,
        url: interviewUrl,
      });
    } catch {
      // user canceled or unsupported
    }
  };

  const onShareEmail = () => {
    const subject = encodeURIComponent(
      `Interview link: ${formData?.jobPosition ?? "Interview"}`
    );
    const body = encodeURIComponent(shareBody);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const onShareWhatsApp = () => {
    const text = encodeURIComponent(shareBody);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const onShareSlack = async () => {
    try {
      await navigator.clipboard.writeText(shareBody);
      toast.success("Copied link. Paste it into Slack.");
      // Optional attempt to open Slack if installed (may be ignored by the browser)
      setTimeout(() => {
        window.open("slack://open", "_self");
      }, 150);
    } catch {
      toast.error("Failed to copy for Slack");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center mt-6 sm:mt-8">
        <Image src="/check.png" alt="Success" width={80} height={80} priority />
        <h2 className="font-bold text-xl sm:text-2xl mt-4">
          Your AI interview is ready
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Share this link with your candidates to start the interview.
        </p>
      </div>

      {/* Link card */}
      <div className="w-full mt-6 sm:mt-8 rounded-xl border border-border bg-card text-card-foreground shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-sm sm:text-base font-semibold">Interview link</h3>
          <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs bg-muted text-muted-foreground">
            Valid for 30 days • until {expiresOn}
          </span>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <Input
            value={interviewUrl}
            readOnly
            className="font-mono text-xs sm:text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={onCopyLink} variant="secondary" className="gap-2">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button onClick={onOpenLink} variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Open
            </Button>
            {canNativeShare && (
              <Button onClick={onShareNative} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            )}
          </div>
        </div>

        <hr className="my-5" />

        {/* Meta row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formData?.duration || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <List className="h-4 w-4" />
            <span>{questionsCount} questions</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formData?.type || "—"}</span>
          </div>
        </div>
      </div>

      {/* Share via */}
      <div className="mt-6 sm:mt-7 w-full rounded-xl border border-border bg-card text-card-foreground p-5">
        <h3 className="text-sm sm:text-base font-semibold">Share via</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" onClick={onShareEmail} className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" onClick={onShareSlack} className="gap-2">
            <Slack className="h-4 w-4" />
            Slack
          </Button>
          <Button variant="outline" onClick={onShareWhatsApp} className="gap-2">
            <FaWhatsapp className="h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Footer CTAs */}
      <div className="mt-6 flex flex-col sm:flex-row w-full gap-3 sm:justify-between">
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Button>
        </Link>
        <Link href="/create-interview" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto gap-2">
            <Plus className="h-4 w-4" />
            Create new interview
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewLink;
