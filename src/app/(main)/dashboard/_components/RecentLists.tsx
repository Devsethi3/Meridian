"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Files, Plus, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase-client";
import RecentListCard from "./RecentListCard";
import type { Interview } from "@/lib/types";

const RecentLists = () => {
  const [recentList, setRecentList] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { user } = useUser();

  const getInterviewList = useCallback(async () => {
    if (!user?.email) return;
    setIsLoading(true);
    setErrorMsg(null);

    const { data: Interviews, error } = await supabase
      .from("Interviews")
      .select("*")
      .eq("userEmail", user.email)
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setErrorMsg(error.message || "Something went wrong");
    } else {
      setRecentList(Interviews ?? []);
    }

    setIsLoading(false);
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) getInterviewList();
  }, [user?.email, getInterviewList]);

  return (
    <section className="my-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Previously Created Interviews</h2>
          <p className="text-sm text-muted-foreground">
            Quickly access your most recent sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={getInterviewList}
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Link href="/dashboard/create-interview">
            <Button className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Interview
            </Button>
          </Link>
        </div>
      </div>

      {errorMsg && (
        <ErrorBanner message={errorMsg} onRetry={getInterviewList} />
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={`sk-${i}`} />
          ))}
        </div>
      ) : recentList.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {recentList.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.22,
                  delay: idx * 0.03,
                  ease: "easeOut",
                }}
              >
                <RecentListCard interview={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};

export default RecentLists;

/* -------------------- Local UI helpers -------------------- */

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2 bg-muted" />
          <Skeleton className="h-3 w-1/3 bg-muted" />
        </div>
      </div>
      <Skeleton className="mb-3 h-5 w-3/4 bg-muted" />
      <Skeleton className="mb-4 h-4 w-1/3 bg-muted" />
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-12 w-full rounded-md bg-muted" />
        <Skeleton className="h-12 w-full rounded-md bg-muted" />
        <Skeleton className="h-12 w-full rounded-md bg-muted" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-9 w-28 rounded-md bg-muted" />
        <Skeleton className="h-9 w-24 rounded-md bg-muted" />
      </div>
    </div>
  );
}

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mb-6 rounded-md border border-border bg-destructive/10 p-4 text-sm text-destructive">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>{message}</span>
        </div>
        <Button
          variant="secondary"
          onClick={onRetry}
          className="h-8 px-3 text-xs"
        >
          Retry
        </Button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Files className="h-6 w-6" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">No Interviews Found</h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        You haven&apos;t created any interviews yet. Once you do, they&apos;ll
        show up here.
      </p>
      <Link href="/dashboard/create-interview">
        <Button className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Interview
        </Button>
      </Link>
    </div>
  );
}
