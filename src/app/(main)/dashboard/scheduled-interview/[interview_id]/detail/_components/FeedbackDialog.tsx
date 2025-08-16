"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import moment from "moment";
import { InterviewFeedback } from "@/lib/types";
import { Award, CheckCircle2, XCircle } from "lucide-react";

interface FeedbackDialogProps {
  candidate: InterviewFeedback | null;
  onClose: () => void;
}

function useIsMobile(query = "(max-width: 640px)") {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      // Safari
      // @ts-ignore
      mql.addListener(onChange);
    }
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        // @ts-ignore
        mql.removeListener(onChange);
      }
    };
  }, [query]);

  return isMobile;
}

const MAX_RATING = 10;

const getInitials = (name?: string) => {
  if (!name) return "NA";
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase() || name.slice(0, 2).toUpperCase();
};

const clampPercent = (val: number) =>
  Math.max(0, Math.min(100, Math.round(val)));

const RatingBar: React.FC<{ label: string; value?: number }> = ({
  label,
  value = 0,
}) => {
  const pct = clampPercent((value / MAX_RATING) * 100);
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {value}/{MAX_RATING}
        </span>
      </div>
      <Progress value={pct} className="h-2 bg-muted" />
    </div>
  );
};

const FeedbackBody: React.FC<{ candidate: InterviewFeedback }> = ({
  candidate,
}) => {
  const fb = candidate.feedback?.feedback;
  const ratings = fb?.rating;

  const ratingValues = ratings ? Object.values(ratings) : [];
  const avg =
    ratingValues.length > 0
      ? Math.round(
          (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length) * 10
        ) / 10
      : 0;
  const avgPct = clampPercent((avg / MAX_RATING) * 100);

  const recommendation = (fb?.recommendation || "").toLowerCase();
  const recommended = recommendation === "yes";

  return (
    <div className="space-y-4">
      {/* Header card with identity and meta */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-4 p-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-secondary text-foreground">
              {getInitials(candidate.userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold leading-none">
                {candidate.userName}
              </h3>
              <Badge variant="secondary" className="text-xs">
                Candidate
              </Badge>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {candidate.userEmail}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Received {moment(candidate.created_at).fromNow()} •{" "}
              {moment(candidate.created_at).format("MMM D, YYYY h:mm A")}
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
          <div
            className={`rounded-md p-3 border ${
              recommended
                ? "bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border-primary/20"
                : "bg-gradient-to-br from-destructive/10 via-destructive/5 to-muted/10 border-destructive/20"
            }`}
          >
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Recommendation
            </div>
            <div className="mt-2 inline-flex items-center gap-2">
              {recommended ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-primary"
                  >
                    Recommended
                  </Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  <Badge
                    variant="outline"
                    className="border-destructive/30 text-destructive"
                  >
                    Not Recommended
                  </Badge>
                </>
              )}
            </div>
          </div>
          <div className="rounded-md border bg-gradient-to-br from-secondary/10 to-muted/10 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Overall
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Award className="h-5 w-5 text-primary" />
              <div className="min-w-[64px] text-sm font-medium">
                {avg}/{MAX_RATING}
              </div>
              <Progress value={avgPct} className="h-2 flex-1 bg-muted" />
            </div>
          </div>
        </div>
      </div>

      {/* Ratings */}
      <div className="rounded-lg border bg-card p-4">
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">
          Ratings
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RatingBar label="Experience" value={ratings?.experience} />
          <RatingBar label="Communication" value={ratings?.communication} />
          <RatingBar label="Problem Solving" value={ratings?.problemSolving} />
          <RatingBar
            label="Technical Skills"
            value={ratings?.technicalSkills}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg border bg-card p-4">
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
          Summary
        </h4>
        <p className="text-sm leading-6">{fb?.summary || "—"}</p>
      </div>

      {/* Recommendation Notes */}
      <div className="rounded-lg border bg-card p-4">
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
          Additional Notes
        </h4>
        <p className="text-sm leading-6">{fb?.recommendationMsg || "—"}</p>
      </div>
    </div>
  );
};

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  candidate,
  onClose,
}) => {
  const isMobile = useIsMobile();
  const open = !!candidate;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) onClose();
    },
    [onClose]
  );

  if (!candidate) return null;

  const Header = (
    <div className="mb-4">
      <DialogHeader className="space-y-1">
        <DialogTitle>Candidate Feedback</DialogTitle>
        <DialogDescription>Feedback for {candidate.userName}</DialogDescription>
      </DialogHeader>
    </div>
  );

  const DrawerHeaderBlock = (
    <DrawerHeader className="px-6">
      <DrawerTitle>Candidate Feedback</DrawerTitle>
      <DrawerDescription>Feedback for {candidate.userName}</DrawerDescription>
    </DrawerHeader>
  );

  const Body = (
    <div className="px-6 pb-6">
      <FeedbackBody candidate={candidate} />
    </div>
  );

  // Mobile: Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="p-0">
          {/* Give the drawer a real height on mobile; dvh works better on iOS */}
          <div className="h-[90dvh] overflow-y-auto">
            <ScrollArea className="h-full">
              {DrawerHeaderBlock}
              <div className="px-6 pb-6">
                <FeedbackBody candidate={candidate} />
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Dialog
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="
          w-[96vw]
          sm:max-w-[720px]
          md:max-w-[860px]
          lg:max-w-[980px]
          xl:max-w-[1100px]
          p-0
          overflow-hidden
        "
      >
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 pt-6">
            {Header}
            <FeedbackBody candidate={candidate} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
