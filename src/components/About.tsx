"use client";

import { Clock, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
      opacity: { duration: 0.5 },
      scale: { duration: 0.5 },
    },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const About = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden rounded-t-4xl border-t bg-[radial-gradient(60%_100px_at_50%_0%,theme(backgroundColor.white/8%),transparent)]"
    >
      {/* Soft spotlights using theme tokens */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary)/.18), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] -z-10 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--secondary)/.14), transparent 65%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left: copy + features */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 text-3xl tracking-tight sm:text-4xl"
            >
              Interview smarter, not harder
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base text-muted-foreground sm:text-lg"
            >
              Intervue AI simulates realistic interviews based on your target
              role and seniority. Choose your duration, practice with voice, and
              receive instant, actionable feedback.
            </motion.p>

            <motion.ul variants={fadeUp} className="mt-8 space-y-4" role="list">
              <FeatureItem icon={Users}>
                Role-specific question sets for engineering, product, data,
                design, and more
              </FeatureItem>
              <FeatureItem icon={TrendingUp}>
                Configurable rounds, difficulty levels, and realistic time
                constraints
              </FeatureItem>
              <FeatureItem icon={Clock}>
                Instant AI scoring with detailed feedback and personalized
                improvement plans
              </FeatureItem>
            </motion.ul>
          </motion.div>

          {/* Right: stat card with gradient border + glass effect */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2, margin: "-50px" }}
            variants={fadeUp}
            className="group relative rounded-2xl p-[1px]"
            style={{
              background:
                "linear-gradient(120deg, hsl(var(--primary)/.5), hsl(var(--secondary)/.5), hsl(var(--primary)/.5))",
            }}
          >
            <div className="relative rounded-2xl bg-card/90 p-6 backdrop-blur ring-1 ring-border/50">
              {/* Subtle shine on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(120deg, transparent 25%, hsl(var(--primary)/.08) 50%, transparent 75%)",
                }}
              />

              <dl className="grid gap-5 sm:grid-cols-2">
                <Stat label="Sessions completed" value="12,400+" />
                <Stat label="Avg. improvement" value="32%" />
                <Stat label="Roles supported" value="25+" />
                <Stat label="Setup time" value="< 1 min" />
              </dl>

              <p className="mt-4 text-xs text-muted-foreground">
                Practice data is private by default and can be deleted anytime.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

function FeatureItem({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: React.ElementType;
}) {
  return (
    <motion.li
      variants={fadeUp}
      whileHover="hover"
      className="flex items-start gap-4 rounded-xl border border-transparent p-2 transition-all duration-300 hover:bg-muted/30 hover:border-border/50"
    >
      <div className="group rounded-xl bg-gradient-to-br from-primary/30 via-secondary/30 to-primary/30 p-[1px]">
        <div className="rounded-xl bg-card/80 p-4 ring-1 ring-border/50 backdrop-blur">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <span className="text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
        {children}
      </span>
    </motion.li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover="hover"
      className="group rounded-xl bg-gradient-to-br from-primary/30 via-secondary/30 to-primary/30 p-[1px] transition-transform duration-300 hover:-translate-y-0.5"
    >
      <div className="rounded-xl bg-card/80 p-4 ring-1 ring-border/50 backdrop-blur">
        <dt className="sr-only">{label}</dt>
        <dd className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
          {value}
        </dd>
        <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
      </div>
    </motion.div>
  );
}
