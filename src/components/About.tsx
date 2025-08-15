import { CheckIcon } from "lucide-react";
import { motion } from "motion/react";

const About = () => {
  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 1, 0.21, 1] as const },
  };
  return (
    <div>
      <section id="about" className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={fadeUp.transition}
            >
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Interview smarter, not harder
              </h2>
              <p className="mt-3 text-muted-foreground">
                Intervue AI simulates realistic interviews based on your target
                role and seniority. Choose your duration, practice with voice,
                and receive instant, actionable feedback.
              </p>

              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-sm text-foreground">
                    Role-specific question sets for engineering, product, data,
                    and more
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-sm text-foreground">
                    Configurable rounds, difficulty, and time limits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-sm text-foreground">
                    Instant scoring, strengths/areas to improve, and follow-up
                    practice
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Stat label="Sessions completed" value="12,400+" />
                <Stat label="Avg. improvement" value="32%" />
                <Stat label="Roles supported" value="25+" />
                <Stat label="Setup time" value="< 1 min" />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Practice data is private by default and can be deleted anytime.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
