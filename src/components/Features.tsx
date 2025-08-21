"use client";

import {
  AudioLines,
  Brain,
  Clock,
  Rocket,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const Features = () => {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const ease = [0.22, 1, 0.36, 1] as const;

  const fadeUp = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.25 } },
      }
    : {
        hidden: { opacity: 0, y: 16, filter: "blur(2px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease },
        },
      };

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.12,
      },
    },
  };

  return (
    <section
      id="features"
      className="relative"
      style={{
        // Variable-color gradients only (shadcn tokens)
        background:
          "radial-gradient(60% 180px at 50% 100%, hsl(var(--primary)/0.12), transparent 70%), radial-gradient(40% 220px at 0% 0%, hsl(var(--secondary)/0.08), transparent 70%)",
      }}
    >
      <div className="container py-16">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl tracking-tight sm:text-4xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40"
          >
            Interview prep, perfected
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-muted-foreground">
            Fast, focused, and realistic. Designed for effective prep.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Feature
            icon={Brain}
            title="AI-driven questions"
            desc="Questions adapt to your role, level, and previous answers."
            fadeUp={fadeUp}
            prefersReducedMotion={prefersReducedMotion}
            ease={ease}
          />
          <Feature
            icon={Clock}
            title="Time-boxed rounds"
            desc="Set 10-60 minute interviews with structured sections."
            fadeUp={fadeUp}
            prefersReducedMotion={prefersReducedMotion}
            ease={ease}
          />
          <Feature
            icon={AudioLines}
            title="Voice-first"
            desc="Real-time transcription for natural, conversational practice."
            fadeUp={fadeUp}
            prefersReducedMotion={prefersReducedMotion}
            ease={ease}
          />
          <Feature
            icon={Sparkles}
            title="Instant feedback"
            desc="Scorecards, strengths, and tailored improvement tips."
            fadeUp={fadeUp}
            prefersReducedMotion={prefersReducedMotion}
            ease={ease}
          />
          <Feature
            icon={Shield}
            title="Privacy-first"
            desc="Your sessions are secured, exportable, and deletable anytime."
            fadeUp={fadeUp}
            prefersReducedMotion={prefersReducedMotion}
            ease={ease}
          />
          <Feature
            icon={Rocket}
            title="Lightning fast"
            desc="Start practicing in seconds—no heavy setup required."
            fadeUp={fadeUp}
            prefersReducedMotion={prefersReducedMotion}
            ease={ease}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

function Feature({
  icon: Icon,
  title,
  desc,
  fadeUp,
  prefersReducedMotion,
  ease,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
  fadeUp: any;
  prefersReducedMotion: boolean;
  ease: readonly [number, number, number, number];
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileTap={prefersReducedMotion ? {} : { scale: 0.995 }}
      className="group"
    >
      {/* Shiny gradient border wrapper using shadcn tokens */}
      <div className="rounded-2xl p-[1px] bg-gradient-to-br dark:from-primary/50 from-primary/20 via-secondary/40 to-muted/40">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/90 p-5 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          {/* Subtle shine on hover */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
              {title}
            </h3>
          </div>

          <p className="text-base text-muted-foreground">{desc}</p>

          {/* Bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-muted/30 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}
