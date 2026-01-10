"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BadgeCheck, PlayCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const subtleFadeUp = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const headerStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const ctaStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3,
    },
  },
};

const statStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.4,
    },
  },
};

const staticRings = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background elements  */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {/* Gradient overlays */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_-10%,hsl(var(--primary)/0.12),transparent_70%)]"
          initial="hidden"
          animate="visible"
          variants={subtleFadeUp}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_110%,hsl(var(--secondary)/0.08),transparent_75%)]"
          initial="hidden"
          animate="visible"
          variants={subtleFadeUp}
        />

        {/* Static Rings Container */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Ring 1 - Largest */}
          <motion.div
            variants={staticRings}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(600px,140vw,1600px)] h-[clamp(600px,140vw,1600px)]"
          >
            <div className="relative w-full h-full rounded-full border border-border/15 dark:border-border/8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 opacity-50" />
            </div>
          </motion.div>

          {/* Ring 2 */}
          <motion.div
            variants={staticRings}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(500px,120vw,1400px)] h-[clamp(500px,120vw,1400px)]"
          >
            <div className="relative w-full h-full rounded-full border border-border/20 dark:border-border/12">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-secondary/4 via-transparent to-primary/4 opacity-60" />
            </div>
          </motion.div>

          {/* Ring 3 */}
          <motion.div
            variants={staticRings}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(400px,100vw,1200px)] h-[clamp(400px,100vw,1200px)]"
          >
            <div className="relative w-full h-full rounded-full border border-border/25 dark:border-border/15">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/4 via-transparent to-secondary/4 opacity-45" />
            </div>
          </motion.div>

          {/* Ring 4 */}
          <motion.div
            variants={staticRings}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(320px,80vw,1000px)] h-[clamp(320px,80vw,1000px)]"
          >
            <div className="relative w-full h-full rounded-full border border-border/30 dark:border-border/18">
              <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-secondary/5 via-transparent to-primary/5 opacity-55" />
            </div>
          </motion.div>

          {/* Ring 5 */}
          <motion.div
            variants={staticRings}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(240px,60vw,800px)] h-[clamp(240px,60vw,800px)]"
          >
            <div className="relative w-full h-full rounded-full border border-border/35 dark:border-border/22">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-40" />
            </div>
          </motion.div>

          {/* Ring 6 - Smallest */}
          <motion.div
            variants={staticRings}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(160px,40vw,600px)] h-[clamp(160px,40vw,600px)]"
          >
            <div className="relative w-full h-full rounded-full border border-border/40 dark:border-border/25">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-secondary/6 via-primary/4 to-secondary/6 opacity-65" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Main content - Proper z-index */}
      <div className="relative z-10 container pb-20 pt-20 lg:pb-28 lg:pt-28">
        <motion.div
          variants={headerStagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={fadeUp}>
            <motion.div
              className="mb-6 flex flex-col items-center justify-center gap-2 sm:flex-row"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={subtleFadeUp}>
                <Badge
                  variant="secondary"
                  className="relative overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-colors"
                >
                  <span className="relative z-10">
                    🚀 Free AI Interview Practice
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
                </Badge>
              </motion.div>
              <motion.span
                variants={subtleFadeUp}
                className="text-xs text-muted-foreground/80"
              >
                No credit card required
              </motion.span>
            </motion.div>
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
            variants={ctaStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <motion.div variants={fadeUp}>
              <Button
                asChild
                size="lg"
                className="shadow-lg shadow-primary/20 relative z-10"
              >
                <Link href="/auth">
                  <motion.span variants={subtleFadeUp}>
                    Create your interview
                  </motion.span>
                  <motion.div variants={subtleFadeUp}>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="relative z-10 w-full"
              >
                <Link href="#demo">
                  <motion.div variants={subtleFadeUp}>
                    <PlayCircle className="mr-2 h-5 w-5" />
                  </motion.div>
                  <motion.span variants={subtleFadeUp}>Watch demo</motion.span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature chips */}
          <motion.div
            variants={statStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2 relative z-10"
          >
            <motion.div variants={fadeUp}>
              <Stat
                title="Role-specific questions"
                desc="Engineer, DS, PM, Design, and more"
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Stat
                title="Voice + transcription"
                desc="Speak naturally, see real-time text"
              />
            </motion.div>
          </motion.div>

          {/* Static Image section */}
          <motion.div
            id="demo"
            variants={fadeUp}
            className="relative mx-auto mt-10 w-full max-w-5xl z-10"
          >
            {/* Image frame with clean styling */}
            <motion.div className="relative rounded-2xl border border-border bg-card/60 p-1 backdrop-blur-sm">
              <motion.div
                className="rounded-xl border border-border bg-card"
                variants={subtleFadeUp}
              >
                <motion.div
                  className="relative overflow-hidden rounded-xl"
                  variants={subtleFadeUp}
                >
                  {/* Light Theme Image */}
                  <Image
                    src="/hero-light.png"
                    alt="App Dashboard Preview"
                    width={1200}
                    height={675}
                    className="block dark:hidden w-full h-auto object-cover"
                    priority
                  />

                  {/* Dark Theme Image */}
                  <Image
                    src="/hero-dark.png"
                    alt="App Dashboard Preview"
                    width={1200}
                    height={675}
                    className="hidden dark:block w-full h-auto object-cover"
                    priority
                  />

                  {/* Fade Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ title, desc }: { title: string; desc: string }) {
  const statContentStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.08,
      },
    },
  };

  const elementFadeUp = {
    hidden: { opacity: 0, y: 4 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <motion.div className="group rounded-xl bg-gradient-to-br from-primary/30 via-secondary/30 to-primary/30 p-[1px]">
      <motion.div
        className="rounded-xl bg-card/80 p-4 ring-1 ring-border/50 backdrop-blur"
        variants={statContentStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.8 }}
      >
        <motion.div className="flex items-start gap-3" variants={elementFadeUp}>
          <motion.div variants={elementFadeUp}>
            <BadgeCheck className="h-5 w-5 shrink-0 text-primary mt-0.5" />
          </motion.div>
          <motion.div className="text-left" variants={elementFadeUp}>
            <motion.p variants={elementFadeUp} className="text-sm">
              {title}
            </motion.p>
            <motion.p
              variants={elementFadeUp}
              className="text-sm text-muted-foreground"
            >
              {desc}
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}