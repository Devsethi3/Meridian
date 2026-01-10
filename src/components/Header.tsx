"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Menu,
  X,
  ChevronRight,
  User as UserIcon,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggleButton } from "./ui/theme-toggle-button";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { HoverLink } from "./HoverLink";
import UserDropdown from "./UserDropdown";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
  { href: "#how", label: "How it works" },
  { href: "#cta", label: "Get started" },
];

type AuthState = "loading" | "error" | "authed" | "guest";

export function Header() {
  // Extend or adapt to your UserContext shape
  const {
    user,
    isLoading: ctxLoading,
    error: ctxError,
    status,
    refetch,
  } = useUser() as {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      picture?: string | null;
    } | null;
    isLoading?: boolean;
    error?: unknown;
    status?: "idle" | "loading" | "authenticated" | "unauthenticated" | "error";
    refetch?: () => void | Promise<void>;
  };

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  const loading = (ctxLoading ?? false) || status === "loading";
  const hasError = Boolean(ctxError) || status === "error";
  const isAuthed = Boolean(user) && !hasError;

  const authState: AuthState = loading
    ? "loading"
    : hasError
    ? "error"
    : isAuthed
    ? "authed"
    : "guest";

  const initials = useMemo(
    () => user?.name?.trim()?.charAt(0)?.toUpperCase() ?? "",
    [user?.name]
  );

  // Solidify header on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);

  const headerClass = useMemo(
    () =>
      [
        "sticky top-0 z-50 w-full border-b",
        scrolled
          ? "bg-background/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50",
      ].join(" "),
    [scrolled]
  );

  return (
    <header className={headerClass}>
      <div className="container flex lg:h-16 h-14 items-center justify-between">
        {/* Logo */}
        <Logo size="lg" />

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <HoverLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle (desktop only visible) */}
          <div className="sm:block hidden">
            <ThemeToggleButton
              showLabel
              variant="circle-blur"
              start="top-right"
            />
          </div>

          {/* Desktop: auth actions */}
          <div className="hidden items-center gap-2 sm:flex">
            {authState === "loading" && (
              <>
                <Skeleton className="h-8 w-[120px] rounded-md" aria-busy />
                <Skeleton className="h-9 w-9 rounded-full" aria-busy />
              </>
            )}

            {authState === "error" && (
              <>
                <Link href="/auth?view=auth">
                  <Button size="sm">Sign in</Button>
                </Link>
                <span className="inline-flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-xs text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Error
                  {typeof refetch === "function" && (
                    <button
                      onClick={() => refetch()}
                      className="underline underline-offset-2 hover:opacity-90"
                    >
                      Retry
                    </button>
                  )}
                </span>
              </>
            )}

            {authState === "guest" && (
              <Link href="/auth?view=auth">
                <Button>Create account</Button>
              </Link>
            )}

            {authState === "authed" && (
              <>
                <Link href="/dashboard">
                  <Button>Go to app</Button>
                </Link>
                <UserDropdown
                  user={
                    user
                      ? {
                          ...user,
                          picture: user.picture ?? null,
                          email: user.email ?? null,
                          name: user.name ?? null,
                        }
                      : null
                  }
                  initials={initials || null}
                />
              </>
            )}
          </div>

          {/* Mobile: auth actions */}
          <div className="flex items-center gap-2 sm:hidden">
            {authState === "loading" && (
              <Skeleton className="h-9 w-9 rounded-full" aria-busy />
            )}
            {authState === "error" && (
              <>
                <Link href="/auth?view=auth">
                  <Button size="sm">Sign in</Button>
                </Link>
              </>
            )}
            {authState === "guest" && (
              <Link href="/auth?view=auth">
                <Button size="sm">Create account</Button>
              </Link>
            )}
            {authState === "authed" && (
              <div>
                <UserDropdown
                  user={
                    user
                      ? {
                          ...user,
                          picture: user.picture ?? null,
                          email: user.email ?? null,
                          name: user.name ?? null,
                        }
                      : null
                  }
                  initials={initials || null}
                />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu (framer-motion) */}
      <AnimatePresence initial={false}>
        {open && (
          <>
            {/* Backdrop */}
            <motion.button
              key="backdrop"
              onClick={close}
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : undefined}
            />

            {/* Sliding panel */}
            <motion.aside
              key="panel"
              id="mobile-menu"
              className="fixed right-0 top-0 z-50 flex h-[100dvh] w-[85%] max-w-sm flex-col justify-between overflow-y-auto border-l border-border bg-background p-4 shadow-2xl backdrop-blur-xl md:hidden"
              role="dialog"
              aria-modal="true"
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 24, opacity: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 260, damping: 30 }
              }
            >
              <div>
                <div className="flex items-center justify-between pb-2">
                  <Logo size="lg" />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={close}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="mt-2 border-t border-border/60 pt-2" />

                <motion.ul
                  className="mt-2 space-y-1"
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{
                    hidden: {
                      transition: {
                        staggerChildren: 0.03,
                        staggerDirection: -1,
                      },
                    },
                    show: { transition: { staggerChildren: 0.04 } },
                  }}
                >
                  {NAV_LINKS.map((link) => (
                    <motion.li
                      key={link.href}
                      variants={{
                        hidden: { opacity: 0, x: 10 },
                        show: { opacity: 1, x: 0 },
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={close}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted/60"
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              {/* CTA + Theme + Avatar on mobile */}
              <div className="mt-4 space-y-4 border-t border-border/60 pt-4">
                {authState === "loading" && (
                  <>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-full rounded-md" aria-busy />
                      <ThemeToggleButton />
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border p-2">
                      <Skeleton className="h-9 w-9 rounded-full" aria-busy />
                      <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" aria-busy />
                        <Skeleton className="h-3 w-36" aria-busy />
                      </div>
                    </div>
                  </>
                )}

                {authState === "error" && (
                  <>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/auth?view=auth"
                        onClick={close}
                        className="flex-1"
                      >
                        <Button className="w-full">Sign in</Button>
                      </Link>
                      <ThemeToggleButton />
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-2 text-destructive">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          <AlertTriangle className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          Error loading user
                        </div>
                        <div className="truncate text-xs opacity-80">
                          You can retry or sign in
                        </div>
                      </div>
                      {typeof refetch === "function" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="shrink-0"
                          onClick={() => refetch()}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </>
                )}

                {authState === "guest" && (
                  <>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/auth?view=auth"
                        onClick={close}
                        className="flex-1"
                      >
                        <Button className="w-full">Create account</Button>
                      </Link>
                      <ThemeToggleButton />
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border p-2">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          Guest
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          Not signed in
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {authState === "authed" && (
                  <>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/dashboard"
                        onClick={close}
                        className="flex-1"
                      >
                        <Button className="w-full">Go to app</Button>
                      </Link>
                      <ThemeToggleButton />
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={close}
                      className="flex items-center gap-3 rounded-lg border border-border p-2"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user?.picture ?? ""}
                          alt={user?.name ?? "User"}
                        />
                        <AvatarFallback>
                          {initials || <UserIcon className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {user?.name || "User"}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {user?.email || "Signed in"}
                        </div>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
