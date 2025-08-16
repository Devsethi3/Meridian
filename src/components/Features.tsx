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
  const stagger = {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  return (
    <div>
      <section id="features">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 tracking-tight sm:text-3xl">
              Everything you need to practice
            </h2>
            <p className="mt-3 text-muted-foreground">
              Fast, focused, and realistic. Designed for effective prep.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
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
  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 1, 0.21, 1] as const },
  };
  return (
    <motion.div
      variants={fadeUp}
      transition={fadeUp.transition}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-muted/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}
