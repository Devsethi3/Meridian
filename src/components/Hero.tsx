"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { HeroVideoDialog } from "./ui/hero-video-dialog";
import { Glow } from "./ui/glow";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.21, 1, 0.21, 1] },
};

const stagger = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export default function HeroSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background spotlights */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_-10%,hsl(var(--primary)/0.16),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_110%,hsl(var(--secondary)/0.12),transparent_65%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={fadeUp}>
            <div className="mb-4 flex items-center justify-center gap-2">
              <Badge variant="secondary" className="border border-border">
                Free AI Interview Practice
              </Badge>
              <span className="text-xs text-muted-foreground">
                No credit card required
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mx-auto max-w-5xl text-center text-3xl tracking-tighter sm:text-4xl lg:text-5xl xl:text-6xl"
          >
            <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
              Ace Interviews with AI: Personalized Practice for Your Dream Job
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            Create realistic, role‑specific mock interviews with adjustable
            duration and get immediate feedback.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="shadow-lg shadow-primary/20">
              <Link href="/sign-up">
                Create your interview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#demo">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch demo
              </Link>
            </Button>
          </motion.div>

          {/* Feature chips */}
          <motion.div
            variants={fadeUp}
            className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2"
          >
            <FeatureChip
              title="Role-specific questions"
              desc="Engineer, DS, PM, Design, and more"
            />
            <FeatureChip
              title="Voice + transcription"
              desc="Speak naturally, see real-time text"
            />
          </motion.div>

          {/* Demo video with animated glow */}
          <motion.div
            id="demo"
            variants={fadeUp}
            className="relative mx-auto mt-10 w-full max-w-5xl"
          >
            {/* Animated gradient aura */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-4 rounded-3xl"
              style={{
                background:
                  "conic-gradient(from 0deg, hsl(var(--primary)/0.45), hsl(var(--secondary)/0.35), transparent 30%, hsl(var(--primary)/0.45))",
              }}
              animate={
                prefersReduced ? {} : { rotate: 360, opacity: [0.6, 0.85, 0.6] }
              }
              transition={
                prefersReduced
                  ? {}
                  : { duration: 28, repeat: Infinity, ease: "linear" }
              }
            />
            {/* Soft blurred orbs */}
            {!prefersReduced && (
              <>
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -top-10 -left-8 h-44 w-44 rounded-full bg-primary/25 blur-3xl"
                  animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0] }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-10 -right-8 h-48 w-48 rounded-full bg-secondary/25 blur-3xl"
                  animate={{ x: [0, -15, 10, 0], y: [0, 12, -8, 0] }}
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </>
            )}

            {/* Video frame */}
            <div className="relative rounded-2xl border border-border bg-card/60 p-1 backdrop-blur">
              <div className="rounded-xl border border-border bg-card">
                {/* Light/Dark thumbnails handled internally; keep both for theme */}
                <div className="relative overflow-hidden rounded-xl">
                  <HeroVideoDialog
                    className="block dark:hidden"
                    animationStyle="from-center"
                    videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                    thumbnailAlt="Product demo video"
                  />
                  <HeroVideoDialog
                    className="hidden dark:block"
                    animationStyle="from-center"
                    videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                    thumbnailAlt="Product demo video"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Powered by */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <span className="text-xs text-muted-foreground">Powered by</span>
            <TechBadge>OpenAI</TechBadge>
            <TechBadge>Deepgram</TechBadge>
            <TechBadge>Vapi</TechBadge>
            <TechBadge>Supabase</TechBadge>
            <TechBadge>Clerk</TechBadge>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureChip({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4">
      <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
      {children}
    </span>
  );
}
