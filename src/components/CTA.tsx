import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import Link from "next/link";

const CTA = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };
  return (
    <div>
      <section id="cta" className="relative">
        <div className="container px-4 py-16 md:px-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 p-8 sm:p-12"
          >
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 sm:text-3xl">
                  Ready to ace your next interview?
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Create your first mock interview in seconds—free forever for
                  practice sessions.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link href="/create">
                    <Button size="lg" className="gap-2">
                      Start practicing
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline">
                      Go to dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Unlimited role presets
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Export transcripts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Works on mobile & desktop
                </li>
              </ul>
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CTA;
