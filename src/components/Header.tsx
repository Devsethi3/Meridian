"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, User as UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggleButton } from "./ui/theme-toggle-button";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { HoverLink } from "./HoverLink";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
  { href: "#how", label: "How it works" },
  { href: "#cta", label: "Get started" },
];

export function Header() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAuthed = !!user;
  const initials = useMemo(
    () =>
      user?.name
        ?.split(" ")
        .map((n) => n?.[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase(),
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
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Meridian Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image
              src="/logo-light.svg"
              width={20}
              height={20}
              alt="logo"
              className="block dark:hidden"
              priority
            />
            <Image
              src="/logo-dark.svg"
              width={20}
              height={20}
              alt="logo"
              className="hidden dark:block"
              priority
            />
            <span className="text-base bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
              Meridian
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <HoverLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <div className="sm:block hidden">
            <ThemeToggleButton
              showLabel
              variant="circle-blur"
              start="top-right"
            />
          </div>

          {!isAuthed ? (
            <>
              <Link href="/auth?view=signup" className="hidden sm:block">
                <Button size="sm">Create account</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                <Button size="sm">Go to app</Button>
              </Link>

              {/* Avatar (links to dashboard) */}
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex rounded-full ring-1 ring-border hover:ring-primary/40 transition"
                aria-label={`Open dashboard${
                  user?.name ? ` for ${user.name}` : ""
                }`}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.picture} />
                  <AvatarFallback>
                    {initials || <UserIcon className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          )}

          <Link href="/auth?view=signup" className="sm:hidden block">
            <Button size="sm">Create account</Button>
          </Link>
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
      <AnimatePresence>
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
            />

            {/* Sliding panel */}
            <motion.aside
              key="panel"
              id="mobile-menu"
              className="fixed right-0 top-0 z-50 h-[100dvh] w-[85%] max-w-sm overflow-y-auto border-l border-border bg-background backdrop-blur-xl p-4 shadow-2xl md:hidden flex flex-col justify-between"
              role="dialog"
              aria-modal="true"
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <div>
                <div className="flex items-center justify-between pb-2">
                  <Link
                    href="/"
                    onClick={close}
                    className="flex items-center gap-2 font-semibold"
                  >
                    <Image
                      src="/logo-light.svg"
                      width={20}
                      height={20}
                      alt="logo"
                      className="block dark:hidden"
                    />
                    <Image
                      src="/logo-dark.svg"
                      width={20}
                      height={20}
                      alt="logo"
                      className="hidden dark:block"
                    />
                    <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
                      Meridian
                    </span>
                  </Link>
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
              <div className="mt-4 border-t border-border/60 pt-4 space-y-4">
                {!isAuthed ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/auth?view=signup"
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
                ) : (
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
                        <AvatarImage src={user?.picture} />
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
