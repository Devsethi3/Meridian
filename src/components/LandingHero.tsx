"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from "lucide-react";
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
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const ringAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.21, 1, 0.21, 1],
    },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 1, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function HeroSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative min-h-screen overflow-hidden bg-background flex items-center">
      {/* Enhanced Background elements */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {/* Multi-layer gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_-20%,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_120%,hsl(var(--secondary)/0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,hsl(var(--primary)/0.03),hsl(var(--secondary)/0.03),hsl(var(--primary)/0.03))]" />

        {/* Enhanced Orbit Rings - Hidden on mobile */}
        <div className="hidden lg:block absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
            {/* Ring 1 - Outermost with particles */}
            <motion.div
              variants={
                !prefersReduced
                  ? ringAnimation
                  : { initial: { opacity: 0 }, animate: { opacity: 1 } }
              }
              initial="initial"
              animate="animate"
              className="absolute w-[min(160vw,1800px)] h-[min(160vw,1800px)]"
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-full border border-primary/10 dark:border-primary/5">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/2 via-transparent to-secondary/2 opacity-60" />
                  {/* Floating particles */}
                  <motion.div
                    variants={!prefersReduced ? floatingAnimation : {}}
                    animate="animate"
                    className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-primary/30 blur-sm"
                  />
                  <motion.div
                    variants={
                      !prefersReduced
                        ? {
                            ...floatingAnimation,
                            animate: {
                              ...floatingAnimation.animate,
                              transition: {
                                ...floatingAnimation.animate.transition,
                                delay: 1,
                              },
                            },
                          }
                        : {}
                    }
                    animate="animate"
                    className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-secondary/30 blur-sm"
                  />
                </div>
              </div>
            </motion.div>

            {/* Ring 2 - Enhanced with glow */}
            <motion.div
              variants={
                !prefersReduced
                  ? {
                      ...ringAnimation,
                      animate: {
                        ...ringAnimation.animate,
                        transition: {
                          ...ringAnimation.animate.transition,
                          delay: 0.2,
                        },
                      },
                    }
                  : { initial: { opacity: 0 }, animate: { opacity: 1 } }
              }
              initial="initial"
              animate="animate"
              className="absolute w-[min(135vw,1500px)] h-[min(135vw,1500px)]"
            >
              <div className="relative w-full h-full rounded-full border border-primary/15 dark:border-primary/8 shadow-[0_0_80px_-20px] shadow-primary/10">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-secondary/3 via-transparent to-primary/3 opacity-70" />
              </div>
            </motion.div>

            {/* Ring 3 - Medium with enhanced gradients */}
            <motion.div
              variants={
                !prefersReduced
                  ? {
                      ...ringAnimation,
                      animate: {
                        ...ringAnimation.animate,
                        transition: {
                          ...ringAnimation.animate.transition,
                          delay: 0.4,
                        },
                      },
                    }
                  : { initial: { opacity: 0 }, animate: { opacity: 1 } }
              }
              initial="initial"
              animate="animate"
              className="absolute w-[min(110vw,1300px)] h-[min(110vw,1300px)]"
            >
              <div className="relative w-full h-full rounded-full border border-primary/20 dark:border-primary/12">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/4 via-transparent to-secondary/4 opacity-60" />
                <div className="absolute inset-0 rounded-full bg-conic-gradient(from_90deg,transparent_0deg,hsl(var(--primary)/0.05)_180deg,transparent_360deg)" />
              </div>
            </motion.div>

            {/* Ring 4 - Inner with stronger presence */}
            <motion.div
              variants={
                !prefersReduced
                  ? {
                      ...ringAnimation,
                      animate: {
                        ...ringAnimation.animate,
                        transition: {
                          ...ringAnimation.animate.transition,
                          delay: 0.6,
                        },
                      },
                    }
                  : { initial: { opacity: 0 }, animate: { opacity: 1 } }
              }
              initial="initial"
              animate="animate"
              className="absolute w-[min(85vw,1100px)] h-[min(85vw,1100px)]"
            >
              <div className="relative w-full h-full rounded-full border border-primary/25 dark:border-primary/15 shadow-[inset_0_0_60px_-15px] shadow-primary/5">
                <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-secondary/5 via-transparent to-primary/5 opacity-75" />
              </div>
            </motion.div>

            {/* Ring 5 - Close to content */}
            <motion.div
              variants={
                !prefersReduced
                  ? {
                      ...ringAnimation,
                      animate: {
                        ...ringAnimation.animate,
                        transition: {
                          ...ringAnimation.animate.transition,
                          delay: 0.8,
                        },
                      },
                    }
                  : { initial: { opacity: 0 }, animate: { opacity: 1 } }
              }
              initial="initial"
              animate="animate"
              className="absolute w-[min(65vw,900px)] h-[min(65vw,900px)]"
            >
              <div className="relative w-full h-full rounded-full border border-primary/30 dark:border-primary/18">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/6 via-transparent to-secondary/6 opacity-50" />
              </div>
            </motion.div>

            {/* Ring 6 - Innermost with highest opacity */}
            <motion.div
              variants={
                !prefersReduced
                  ? {
                      ...ringAnimation,
                      animate: {
                        ...ringAnimation.animate,
                        transition: {
                          ...ringAnimation.animate.transition,
                          delay: 1.0,
                        },
                      },
                    }
                  : { initial: { opacity: 0 }, animate: { opacity: 1 } }
              }
              initial="initial"
              animate="animate"
              className="absolute w-[min(45vw,700px)] h-[min(45vw,700px)]"
            >
              <div className="relative w-full h-full rounded-full border border-primary/35 dark:border-primary/22">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-secondary/8 via-primary/5 to-secondary/8 opacity-80" />
                <div className="absolute inset-0 rounded-full shadow-[0_0_100px_-30px] shadow-primary/15" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile gradient background */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      </div>

      {/* Enhanced Main content */}
      <div className="relative z-10 container py-20 lg:py-32">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center text-center"
        >
          {/* Enhanced badge section */}
          <motion.div variants={fadeUp}>
            <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Badge
                variant="secondary"
                className="group relative overflow-hidden border border-primary/20 bg-primary/5 backdrop-blur-md hover:bg-primary/10 transition-all duration-300 px-4 py-2"
              >
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                <span className="relative z-10 font-medium">
                  🚀 Free AI Interview Practice
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Badge>
              <span className="text-sm text-muted-foreground/90 font-medium">
                No credit card required
              </span>
            </div>
          </motion.div>

          {/* Enhanced heading */}
          <motion.h1
            variants={fadeUp}
            className="mx-auto max-w-6xl text-center text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl xl:text-7xl leading-tight"
          >
            <span className="bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/30">
              Ace Interviews with AI:{" "}
            </span>
            <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Personalized Practice
            </span>
            <span className="bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/30">
              {" "}
              for Your Dream Job
            </span>
          </motion.h1>

          {/* Enhanced description */}
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-3xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
          >
            Create realistic, role-specific mock interviews with adjustable
            duration and get immediate feedback to land your dream position.
          </motion.p>

          {/* Enhanced CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="group relative shadow-2xl shadow-primary/25 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Link href="/sign-up">
                Create your interview
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group border-2 border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary/5 px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Link href="#demo">
                <PlayCircle className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                Watch demo
              </Link>
            </Button>
          </motion.div>

          {/* Enhanced feature chips */}
          <motion.div
            variants={fadeUp}
            className="mt-12 grid w-full max-w-3xl gap-4 sm:grid-cols-2"
          >
            <FeatureChip
              title="Role-specific questions"
              desc="Engineer, Data Science, PM, Design, and more"
            />
            <FeatureChip
              title="Voice + transcription"
              desc="Speak naturally, see real-time text"
            />
          </motion.div>

          {/* Enhanced video section */}
          <motion.div
            id="demo"
            variants={fadeUp}
            className="relative mx-auto mt-16 w-full max-w-6xl"
          >
            {/* Enhanced video frame */}
            <div className="relative rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-card/80 to-card/60 p-2 backdrop-blur-xl shadow-2xl shadow-primary/10">
              <div className="rounded-2xl border border-border/50 bg-card/90 backdrop-blur-sm overflow-hidden">
                <div className="relative overflow-hidden rounded-2xl">
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
    <div className="group flex items-start gap-4 rounded-2xl border border-primary/20 bg-card/60 p-6 transition-all duration-300 hover:bg-card/80 hover:border-primary/30 backdrop-blur-sm hover:scale-105 hover:shadow-xl hover:shadow-primary/10">
      <div className="rounded-full bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
        <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
      </div>
      <div className="text-left">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
