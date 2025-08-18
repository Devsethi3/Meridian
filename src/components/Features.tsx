import {
  AudioLines,
  Brain,
  Clock,
  Rocket,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

const Features = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
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

  return (
    <div>
      <section id="features">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 text-3xl tracking-tight sm:text-4xl"
            >
              Everything you need to practice
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
            />
            <Feature
              icon={Clock}
              title="Time-boxed rounds"
              desc="Set 10-60 minute interviews with structured sections."
            />
            <Feature
              icon={AudioLines}
              title="Voice-first"
              desc="Real-time transcription for natural, conversational practice."
            />
            <Feature
              icon={Sparkles}
              title="Instant feedback"
              desc="Scorecards, strengths, and tailored improvement tips."
            />
            <Feature
              icon={Shield}
              title="Privacy-first"
              desc="Your sessions are secured, exportable, and deletable anytime."
            />
            <Feature
              icon={Rocket}
              title="Lightning fast"
              desc="Start practicing in seconds—no heavy setup required."
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
}) {
  const cardFadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  const contentStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const elementFadeUp = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={cardFadeUp}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5"
      whileHover={{
        y: -2,
        transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
      }}
    >
      <motion.div
        className="mb-4 flex items-center gap-3"
        variants={contentStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.8 }}
      >
        <motion.div
          variants={elementFadeUp}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20"
        >
          <Icon className="h-5 w-5" />
        </motion.div>
        <motion.h3
          variants={elementFadeUp}
          className="text-base font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40"
        >
          {title}
        </motion.h3>
      </motion.div>
      <motion.p
        variants={elementFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.8 }}
        className="text-sm text-muted-foreground"
      >
        {desc}
      </motion.p>
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-muted/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
