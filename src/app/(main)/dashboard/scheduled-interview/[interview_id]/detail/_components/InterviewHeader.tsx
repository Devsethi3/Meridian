"use client";

import { CalendarDays, Clock, FileText, User, TrendingUp } from "lucide-react";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import ErrorState from "./ErrorState";
import { Card } from "@/components/ui/card";
import { InterviewDetail } from "@/lib/types";
import InterviewHeaderSkeleton from "@/components/skeletons/InterviewHeaderSkeleton";
import StatChip from "./StatChip";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";

interface InterviewHeaderProps {
  interview: InterviewDetail | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  interview,
  loading = false,
  error = null,
  onRetry,
}) => {
  const { user } = useUser();

  if (loading) return <InterviewHeaderSkeleton />;

  if (error) {
    return (
      <ErrorState
        title="Couldn't load interview details"
        description={error}
        onRetry={onRetry}
      />
    );
  }

  if (!interview) {
    return (
      <Card className="border-dashed">
        <div className="p-8 text-center text-muted-foreground">
          No interview details available.
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group rounded-xl bg-gradient-to-br from-primary/30 via-secondary/30 to-primary/30 p-[1px] transition-colors duration-300 hover:from-primary/40 hover:via-secondary/40 hover:to-primary/40"
    >
      <div className="relative overflow-hidden rounded-xl bg-card/80 ring-1 ring-border/50 backdrop-blur">
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 text-2xl font-semibold sm:text-3xl">
                {interview.jobPosition}
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Interview session analysis and performance insights
              </p>
            </div>

            <motion.div
              whileHover={{ y: -1 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 22,
                mass: 0.4,
              }}
              className="rounded-lg bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 p-[1px]"
            >
              <div className="flex items-center gap-2 rounded-lg bg-background/60 px-3 py-2 ring-1 ring-border/50">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-foreground">
                  {interview.duration ? "Completed" : "Upcoming"}
                </span>
              </div>
            </motion.div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatChip
              icon={<CalendarDays className="h-4 w-4" />}
              label="Interview Date"
              value={moment(interview.created_at).format("MMM DD, YYYY")}
            />
            <StatChip
              icon={<Clock className="h-4 w-4" />}
              label="Duration"
              value={interview.duration || "N/A"}
            />
            <StatChip
              icon={<User className="h-4 w-4" />}
              label="Created by"
              value={user?.name || "Anonymous"}
              truncate
            />
            <StatChip
              icon={<FileText className="h-4 w-4" />}
              label="Interview Type"
              value={interview.type || "General"}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewHeader;
