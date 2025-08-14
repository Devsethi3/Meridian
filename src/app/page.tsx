"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Get Started", href: "#cta" },
];

export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="AI Interview Home"
          >
            <SparklesIcon className="h-6 w-6 text-primary" />
            <span className="text-base font-semibold">
              Interview<span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <ThemeToggleButton
              showLabel
              variant="circle-blur"
              start="top-right"
            />
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="#cta"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Sign in
              </Link>
              <Link
                href="#cta"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Get started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Toggle menu</span>
            {open ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        <div
          id="mobile-nav"
          className={`grid gap-2 border-t border-border bg-background px-4 py-4 md:hidden ${
            open ? "" : "hidden"
          }`}
        >
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              {label}
            </Link>
          ))}

          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link
              href="#cta"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Sign in
            </Link>
            <Link
              href="#cta"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section
          id="hero"
          className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  <SparklesIcon className="h-4 w-4 text-primary" />
                  Now with role-specific simulations
                </div>
                <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]">
                  Ace your next interview with Artificial Intelligence
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                  Practice real interviews with an AI that adapts to your role,
                  seniority, and resume. Get instant, actionable feedback to
                  level up fast.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="#cta"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Start practicing
                  </Link>
                  <Link
                    href="#features"
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-3 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    See features
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <StarIcon className="h-4 w-4 text-primary" />
                    4.9/5 average rating
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldIcon className="h-4 w-4 text-primary" />
                    Privacy-first by design
                  </div>
                </div>
              </div>

              {/* Demo Card */}
              <div className="relative">
                <div
                  className="absolute inset-0 -z-10 rounded-3xl bg-primary/20 blur-3xl"
                  aria-hidden="true"
                />
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary">
                        <MicIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          AI Interviewer
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Senior Frontend Role
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                      Live
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                    </div>
                  </div>

                  <div className="space-y-3 py-4">
                    <div className="max-w-[85%] rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                      Tell me about a time you resolved a complex UI performance
                      issue. What steps did you take?
                    </div>
                    <div className="ml-auto max-w-[85%] rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground">
                      I profiled a React app with the DevTools Profiler,
                      identified a prop-drilling rerender cascade, and
                      introduced memoization + virtualization. Paint time
                      dropped 45%.
                    </div>
                    <div className="max-w-[85%] rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                      Great. Which metrics informed the optimization, and how
                      did you verify improvements?
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2 border-t border-border pt-3">
                    <input
                      type="text"
                      placeholder="Type your answer..."
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <button
                      className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Send"
                    >
                      <SendIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="border-t border-border">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl font-semibold sm:text-3xl">
                Built for realistic, repeatable practice
              </h2>
              <p className="mt-4 text-muted-foreground">
                InterviewAI simulates real interviewers across roles and levels,
                adapts follow-ups based on your answers, and delivers concise,
                personalized feedback you can act on immediately.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-foreground">
                    Role and seniority specific scenarios
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-foreground">
                    Instant, evidence-based feedback rubrics
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-foreground">
                    Progress tracking and targeted drills
                  </span>
                </li>
              </ul>
            </div>

            {/* Visual */}
            <div className="order-1 md:order-2">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
                <div
                  className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl"
                  aria-hidden
                />
                <div
                  className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/20 blur-2xl"
                  aria-hidden
                />

                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        Feedback summary
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Session • 18 min
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <Metric label="Communication" value={86} />
                      <Metric label="Problem solving" value={91} />
                      <Metric label="Technical depth" value={82} />
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-4">
                    <div className="text-sm font-medium">Action items</div>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                      <li>
                        Use a structured approach (STAR) for behavioral answers.
                      </li>
                      <li>Quantify outcomes to demonstrate impact.</li>
                      <li>Highlight trade-offs when explaining decisions.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold sm:text-3xl">
                Everything you need to practice smarter
              </h2>
              <p className="mt-3 text-muted-foreground">
                From dynamic questioning to calibrated scoring, InterviewAI
                helps you improve faster.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<ChatIcon className="h-5 w-5 text-primary" />}
                title="Adaptive AI interviewer"
                desc="Follow-up questions adapt in real time to your answers and seniority."
              />
              <FeatureCard
                icon={<TargetIcon className="h-5 w-5 text-primary" />}
                title="Role-specific drills"
                desc="Target PM, FE, BE, DS, or system design with calibrated difficulty."
              />
              <FeatureCard
                icon={<LightningIcon className="h-5 w-5 text-primary" />}
                title="Instant feedback"
                desc="Clear rubrics, examples, and next steps after every response."
              />
              <FeatureCard
                icon={<ShieldIcon className="h-5 w-5 text-primary" />}
                title="Privacy-first"
                desc="Your data stays yours. Fine-grained controls and exports."
              />
              <FeatureCard
                icon={<BarChartIcon className="h-5 w-5 text-primary" />}
                title="Progress tracking"
                desc="Trends, strengths, and gaps to guide your next practice."
              />
              <FeatureCard
                icon={<MicIcon className="h-5 w-5 text-primary" />}
                title="Voice & video"
                desc="Practice phone screens or live interviews with realistic timing."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section id="cta" className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="relative isolate overflow-hidden rounded-2xl border border-border bg-secondary p-10 text-center text-secondary-foreground sm:p-16">
              <div
                className="pointer-events-none absolute inset-0 -z-10 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0",
                }}
                aria-hidden="true"
              />
              <h3 className="text-2xl font-semibold sm:text-3xl">
                Ready to land the offer?
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-secondary-foreground/90">
                Join thousands leveling up with InterviewAI. Practice for
                free—upgrade anytime.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="#"
                  className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary sm:w-auto"
                >
                  Create free account
                </Link>
                <Link
                  href="#features"
                  className="inline-flex w-full items-center justify-center rounded-md border border-input bg-secondary px-5 py-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
                >
                  Explore features
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <Link href="/" className="flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-primary" />
                <span className="text-base font-semibold">
                  Interview<span className="text-primary">AI</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Practice smarter. Interview better. Get hired.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold">Product</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#cta" className="hover:text-foreground">
                    Get started
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold">Company</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold">Stay in the loop</div>
              <p className="mt-3 text-sm text-muted-foreground">
                Tips, templates, and exclusive updates.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-3 flex items-center gap-2"
              >
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="h-10 w-full flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
            <p>
              © {new Date().getFullYear()} InterviewAI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                aria-label="Twitter"
                className="hover:text-foreground"
              >
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="GitHub"
                className="hover:text-foreground"
              >
                <GitHubIcon className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="hover:text-foreground"
              >
                <LinkedInIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Small Components ---------- */

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40 hover:shadow-sm">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold">{value}%</span>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ---------- Icons (SVG, currentColor) ---------- */

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3l1.5 3L10 7.5 6.5 9 5 12 3.5 9 0 7.5 3.5 6 5 3zM16 10l1.2 2.4L20 13.6 17.2 14.8 16 17.2 14.8 14.8 12 13.6l2.8-1.2L16 10zM10 16l.9 1.8L13 19l-2.1.9L10 21.8 9.1 19.9 7 19l2.1-.9L10 16z"
      />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 17.27l5.18 3.05-1.64-5.81L20 9.24l-5.92-.51L12 3 9.92 8.73 4 9.24l4.46 5.27-1.64 5.81L12 17.27z" />
    </svg>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      />
    </svg>
  );
}

function MicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="9" y="2" width="6" height="12" rx="3" strokeWidth="2" />
      <path d="M5 11a7 7 0 0 0 14 0" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 19v3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M22 2l-7 20-4-9-9-4 20-7z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <circle cx="12" cy="12" r="6" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" strokeWidth="2" />
    </svg>
  );
}

function LightningIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}

function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="3" y="10" width="4" height="11" rx="1" />
      <rect x="10" y="6" width="4" height="15" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M20 6L9 17l-5-5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23 4.8a9.2 9.2 0 0 1-2.6.7 4.6 4.6 0 0 0 2-2.5 9.2 9.2 0 0 1-2.9 1.1 4.6 4.6 0 0 0-7.9 4.2A13 13 0 0 1 3 3.6 4.6 4.6 0 0 0 4.4 10 4.5 4.5 0 0 1 2 9.4v.1a4.6 4.6 0 0 0 3.7 4.5 4.7 4.7 0 0 1-2.1.1 4.6 4.6 0 0 0 4.3 3.2A9.3 9.3 0 0 1 1 20.5 13 13 0 0 0 8 22.6c8 0 12.4-6.7 12.4-12.4v-.6A8.8 8.8 0 0 0 23 4.8z" />
    </svg>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.5 1.1 3.1.8.1-.7.4-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-5a4 4 0 0 1 1.1-2.8 3.7 3.7 0 0 1 .1-2.7s.8-.3 2.7 1.1a9.3 9.3 0 0 1 5 0c1.9-1.4 2.7-1.1 2.7-1.1.4.9.2 1.9.1 2.7a4 4 0 0 1 1.1 2.8c0 3.9-2.3 4.8-4.5 5 .4.4.7 1 .7 2v3c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-1 1.8-2.2 3.7-2.2 4 0 4.8 2.6 4.8 6V24h-4v-7.3c0-1.8 0-4.1-2.5-4.1s-2.9 2-2.9 4V24h-4V8z" />
    </svg>
  );
}

/* ---------- End ---------- */
