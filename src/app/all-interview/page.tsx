"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { supabase } from "@/supabase/supabase-client";
import { useUser } from "@/context/UserContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { titleCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type SortKey =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "duration-asc"
  | "duration-desc";

const TYPE_OPTIONS = [
  "all",
  "technical",
  "behaviour",
  "experienced",
  "problem solving",
] as const;

type Interview = /*unresolved*/ any

const AllInterviewPage = () => {
  type TypeFilter = (typeof TYPE_OPTIONS)[number];

  const router = useRouter();

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const [interviewList, setInterviewList] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");

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
      setInterviewList(Interviews ?? []);
    }

    setIsLoading(false);
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      getInterviewList();
    }
  }, [user?.email, getInterviewList]);

  const uniqueTypes = useMemo(() => {
    return Array.from(
      new Set(
        (interviewList || [])
          .map((i) => i.type?.trim())
          .filter(Boolean) as string[]
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [interviewList]);

  function normalizeType(s?: string) {
    const t = (s || "")
      .toLowerCase()
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (["behavioral", "behavioural", "behavior", "behaviour"].includes(t))
      return "behaviour";
    if (["problem solving", "problem-solving", "problem_solving"].includes(t))
      return "problem solving";
    if (["tech", "technical"].includes(t)) return "technical";
    if (["experienced", "experience"].includes(t)) return "experienced";
    return t;
  }

  const filteredAndSorted = useMemo(() => {
    let data = [...interviewList];

    if (typeFilter !== "all") {
      const tf = normalizeType(typeFilter);
      data = data.filter((i) => normalizeType(i.type) === tf);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      data = data.filter(
        (i) =>
          i.jobPosition?.toLowerCase().includes(q) ||
          i.jobDescription?.toLowerCase().includes(q) ||
          i.interview_id?.toLowerCase().includes(q)
      );
    }

    data.sort((a, b) => compareSort(a, b, sortBy));
    return data;
  }, [interviewList, typeFilter, search, sortBy]);

  const hasActiveFilters = search.trim().length > 0 || typeFilter !== "all";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-10">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.back()}
                size="icon"
                variant={"outline"}
              >
                <ArrowLeft />
              </Button>
              <h1 className="text-2xl font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 tracking-tight sm:text-3xl">
                Your Interviews
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage and review all your sessions in one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/create-interview"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground shadow transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Create new interview"
              title="Create new interview"
            >
              <PlusIcon className="size-4" />
              New Interview
            </Link>
            <button
              onClick={getInterviewList}
              className="inline-flex items-center gap-2 rounded-md bg-secondary px-3.5 py-2.5 text-sm font-medium text-secondary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Refresh"
              title="Refresh"
            >
              <RefreshIcon className="size-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by role, description, or ID..."
                className="w-full rounded-md border border-border bg-muted px-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:col-span-6 sm:flex-row sm:items-center sm:justify-end">
            {/* Type filter - visible on all breakpoints */}
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Type:
              </span>
              <div className="w-full sm:w-[220px]">
                <Select
                  value={typeFilter}
                  onValueChange={(v) =>
                    setTypeFilter(v as (typeof TYPE_OPTIONS)[number])
                  }
                >
                  <SelectTrigger className="w-full border border-border bg-muted">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover text-popover-foreground">
                    {TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {titleCase(opt)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sort */}
            <div className="flex w-full items-center sm:w-auto">
              <span className="sr-only" id="sort-label">
                Sort by
              </span>
              <div className="relative w-full sm:w-auto">
                <SortIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as SortKey)}
                >
                  <SelectTrigger
                    aria-labelledby="sort-label"
                    className="w-full border border-border bg-muted pr-9 text-sm sm:w-[180px]"
                  >
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover text-popover-foreground">
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="title-asc">Title A–Z</SelectItem>
                    <SelectItem value="title-desc">Title Z–A</SelectItem>
                    <SelectItem value="duration-asc">Duration ↑</SelectItem>
                    <SelectItem value="duration-desc">Duration ↓</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Error state */}
        {errorMsg && (
          <ErrorBanner message={errorMsg} onRetry={getInterviewList} />
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={`s-${idx}`} />
            ))}
          </div>
        )}

        {/* Empty states */}
        {!isLoading && filteredAndSorted.length === 0 && (
          <EmptyState
            hasFilters={hasActiveFilters}
            onClearFilters={() => {
              setSearch("");
              setTypeFilter("all");
              setSortBy("newest");
            }}
          />
        )}

        {/* Results */}
        {!isLoading && filteredAndSorted.length > 0 && (
          <>
            <div className="mb-3 text-sm text-muted-foreground">
              Showing {filteredAndSorted.length}{" "}
              {filteredAndSorted.length === 1 ? "result" : "results"}
              {hasActiveFilters && <span> • filters applied</span>}
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredAndSorted.map((interview, idx) => (
                  <motion.div
                    key={interview.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{
                      duration: 0.22,
                      delay: idx * 0.02,
                      ease: "easeOut",
                    }}
                  >
                    <InterviewCard interview={interview} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllInterviewPage;

/* ------------------------------ Components ------------------------------ */

function InterviewCard({ interview }: { interview: Interview }) {
  const {
    jobPosition,
    jobDescription,
    created_at,
    duration,
    questionList,
    type,
    interview_id,
  } = interview;

  const questionCount = questionList?.length ?? 0;
  const relTime = relativeTimeFromNow(created_at);
  const dur = formatDuration(duration);

  const truncatedDesc = useMemo(
    () => truncate(jobDescription || "", 140),
    [jobDescription]
  );

  const href = `${process.env.NEXT_PUBLIC_URL}/dashboard/scheduled-interview/${interview_id}/detail`;

  // Get interview status based on duration
  const getInterviewStatus = () => {
    return duration ? "Completed" : "Scheduled";
  };

  const getStatusColor = () => {
    return duration ? "text-emerald-600" : "text-blue-600";
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group relative h-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm"
    >
      <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
      </div>

      <div className="flex h-full flex-col p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate lg:text-xl text-lg font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
              {jobPosition || "Untitled"}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <TimeIcon className="size-3.5" />
              <span>{relTime}</span>
            </div>
          </div>

          <span className="inline-flex shrink-0 items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {type ? capitalize(type) : "General"}
          </span>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-muted-foreground">{truncatedDesc}</p>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-md border border-border bg-muted px-2.5 py-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ClockIcon className="size-3.5" />
              <span>Duration</span>
            </div>
            <div className="mt-1 font-medium text-foreground">{dur}</div>
          </div>

          <div className="rounded-md border border-border bg-muted px-2.5 py-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ListIcon className="size-3.5" />
              <span>Questions</span>
            </div>
            <div className="mt-1 font-medium text-foreground">
              {questionCount}
            </div>
          </div>

          <div className="rounded-md border border-border bg-muted px-2.5 py-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <StatusIcon className="size-3.5" />
              <span>Status</span>
            </div>
            <div className={`mt-1 font-medium ${getStatusColor()}`}>
              {getInterviewStatus()}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <Link
            href={`${process.env.NEXT_PUBLIC_URL}/interview/${interview_id}`}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Open
            <ArrowRightIcon className="size-4" />
          </Link>

          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            View details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="h-full animate-pulse rounded-xl border border-border bg-card p-5">
      <div className="mb-6 flex items-start justify-between">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-6 w-16 rounded-full bg-muted" />
      </div>
      <div className="mb-4 space-y-2">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-3/4 rounded bg-muted" />
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="h-14 rounded-md bg-muted" />
        <div className="h-14 rounded-md bg-muted" />
        <div className="h-14 rounded-md bg-muted" />
      </div>
      <div className="h-9 w-28 rounded-md bg-muted" />
    </div>
  );
}

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mb-6 rounded-md border border-border bg-destructive/10 p-4 text-sm text-destructive">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertIcon className="size-4" />
          <span>{message}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <FolderIcon className="size-6" />
      </div>
      <h3 className="mb-1 text-lg font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
        No interviews found
      </h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        {hasFilters
          ? "No results match your current filters. Try adjusting the search or filter settings."
          : "You haven't created any interviews yet. Start by creating a new one."}
      </p>

      <div className="flex items-center gap-3">
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 rounded-md bg-secondary px-3.5 py-2 text-sm font-medium text-secondary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <EraserIcon className="size-4" />
            Clear filters
          </button>
        )}
        <Link
          href="/dashboard/create-interview"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <PlusIcon className="size-4" />
          Create interview
        </Link>
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border bg-muted text-foreground hover:opacity-90",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ------------------------------ Helpers ------------------------------ */

function truncate(s: string, n: number) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function relativeTimeFromNow(isoDate: string) {
  if (!isoDate) return "—";
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = date.getTime() - now.getTime();

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const absMs = Math.abs(diffMs);
  const minutes = Math.round(diffMs / (1000 * 60));
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (absMs < 1000 * 60) return "just now";
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(days, "day");
}

function durationToMinutes(d: string | null | undefined): number {
  if (!d) return 0;
  // ISO 8601 (e.g., PT1H30M)
  if (/^P(T.*)?/i.test(d)) {
    const h = d.match(/(\d+)H/i)?.[1];
    const m = d.match(/(\d+)M/i)?.[1];
    const s = d.match(/(\d+)S/i)?.[1];
    const minutes =
      (h ? parseInt(h) * 60 : 0) +
      (m ? parseInt(m) : 0) +
      (s ? Math.round(parseInt(s) / 60) : 0);
    return minutes;
  }
  // Fallback: extract digits
  const num = parseInt(String(d).replace(/[^\d]/g, ""), 10);
  return isNaN(num) ? 0 : num;
}

function formatDuration(d: string | null | undefined): string {
  if (!d) return "—";
  if (/^P(T.*)?/i.test(d)) {
    const h = parseInt(d.match(/(\d+)H/i)?.[1] || "0", 10);
    const m = parseInt(d.match(/(\d+)M/i)?.[1] || "0", 10);
    const s = parseInt(d.match(/(\d+)S/i)?.[1] || "0", 10);
    const parts: string[] = [];
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (s && !h && !m) parts.push(`${s}s`);
    return parts.join(" ") || "0m";
  }
  const mins = durationToMinutes(d);
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins}m`;
}

function compareSort(a: Interview, b: Interview, key: SortKey): number {
  switch (key) {
    case "newest":
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case "oldest":
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    case "title-asc":
      return (a.jobPosition || "").localeCompare(b.jobPosition || "");
    case "title-desc":
      return (b.jobPosition || "").localeCompare(a.jobPosition || "");
    case "duration-asc":
      return durationToMinutes(a.duration) - durationToMinutes(b.duration);
    case "duration-desc":
      return durationToMinutes(b.duration) - durationToMinutes(a.duration);
    default:
      return 0;
  }
}

/* ------------------------------ Icons (inline SVG, no deps) ------------------------------ */

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function RefreshIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path
        d="M20 12a8 8 0 1 1-2.34-5.66M20 4v6h-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M20 20l-3-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SortIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path
        d="M3 6h12M3 12h8M3 18h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function TimeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 8v4l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return <TimeIcon {...props} />;
}
function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function StatusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path
        d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9 11 3 3L22 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path
        d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path
        d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function EraserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path
        d="m19 14-7-7-8 8 4 4h8l3-3ZM5 13l6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
