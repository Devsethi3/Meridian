"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BadgeCheck, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { HeroVideoDialog } from "./ui/hero-video-dialog";

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

const staticRings = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeOut" as const,
    },
  },
};

export default function HeroSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background elements - Fixed z-index */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_-10%,hsl(var(--primary)/0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_110%,hsl(var(--secondary)/0.08),transparent_75%)]" />

        {/* Static Rings Container */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Ring 1 - Largest */}
          <motion.div
            variants={staticRings}
            initial="initial"
            animate="animate"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(600px,140vw,1600px)] h-[clamp(600px,140vw,1600px)]"
          >
            <div className="relative w-full h-full rounded-full border border-border/15 dark:border-border/8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 opacity-50" />
            </div>
          </motion.div>

          {/* Ring 2 */}
          <motion.div
            variants={staticRings}
            initial="initial"
            animate="animate"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(500px,120vw,1400px)] h-[clamp(500px,120vw,1400px)]"
          >
            <div className="relative w-full h-full rounded-full border border-border/20 dark:border-border/12">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-secondary/4 via-transparent to-primary/4 opacity-60" />
            </div>
          </motion.div>

          {/* Ring 3 */}
          <motion.div
            variants={staticRings}
            initial="initial"
            animate="animate"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(400px,100vw,1200px)] h-[clamp(400px,100vw,1200px)]"
          >
            <div className="relative w-full h-full rounded-full border border-border/25 dark:border-border/15">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/4 via-transparent to-secondary/4 opacity-45" />
            </div>
          </motion.div>

          {/* Ring 4 */}
          <motion.div
            variants={staticRings}
            initial="initial"
            animate="animate"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(320px,80vw,1000px)] h-[clamp(320px,80vw,1000px)]"
          >
            <div className="relative w-full h-full rounded-full border border-border/30 dark:border-border/18">
              <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-secondary/5 via-transparent to-primary/5 opacity-55" />
            </div>
          </motion.div>

          {/* Ring 5 */}
          <motion.div
            variants={staticRings}
            initial="initial"
            animate="animate"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(240px,60vw,800px)] h-[clamp(240px,60vw,800px)]"
          >
            <div className="relative w-full h-full rounded-full border border-border/35 dark:border-border/22">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-40" />
            </div>
          </motion.div>

          {/* Ring 6 - Smallest */}
          <motion.div
            variants={staticRings}
            initial="initial"
            animate="animate"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(160px,40vw,600px)] h-[clamp(160px,40vw,600px)]"
          >
            <div className="relative w-full h-full rounded-full border border-border/40 dark:border-border/25">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-secondary/6 via-primary/4 to-secondary/6 opacity-65" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content - Proper z-index */}
      <div className="relative z-10 container pb-20 pt-20 lg:pb-28 lg:pt-28">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={fadeUp}>
            <div className="mb-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
              <Badge
                variant="secondary"
                className="relative overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-colors"
              >
                <span className="relative z-10">
                  🚀 Free AI Interview Practice
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
              </Badge>
              <span className="text-xs text-muted-foreground/80">
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
            Create realistic, role-specific mock interviews with adjustable
            duration and get immediate feedback.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="shadow-lg shadow-primary/20 relative z-10"
            >
              <Link href="/sign-up">
                Create your interview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="relative z-10"
            >
              <Link href="#demo">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch demo
              </Link>
            </Button>
          </motion.div>

          {/* Feature chips */}
          <motion.div
            variants={fadeUp}
            className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2 relative z-10"
          >
            <Stat
              title="Role-specific questions"
              desc="Engineer, DS, PM, Design, and more"
            />
            <Stat
              title="Voice + transcription"
              desc="Speak naturally, see real-time text"
            />
          </motion.div>

          {/* Video section */}
          <motion.div
            id="demo"
            variants={fadeUp}
            className="relative mx-auto mt-10 w-full max-w-5xl z-10"
          >
            {/* Video frame with clean styling */}
            <div className="relative rounded-2xl border border-border bg-card/60 p-1 backdrop-blur-sm">
              <div className="rounded-xl border border-border bg-card">
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
        </motion.div>
      </div>
    </section>
  );
}

function FeatureChip({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4 transition-colors hover:bg-card backdrop-blur-sm">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
      <div className="text-left">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function Stat({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group rounded-xl bg-gradient-to-br from-primary/30 via-secondary/30 to-primary/30 p-[1px] transition-transform duration-300 hover:-translate-y-0.5">
      <div className="rounded-xl bg-card/80 p-4 ring-1 ring-border/50 backdrop-blur">
        <div className="flex items-start gap-3">
          <BadgeCheck className="h-5 w-5 shrink-0 text-primary mt-0.5" />
          <div className="text-left">
            <p className="text-sm">{title}</p>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
