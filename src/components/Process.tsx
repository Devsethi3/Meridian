import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const Process = () => {
  const steps = [
    {
      title: "Choose a role",
      desc: "Pick a template (e.g., Frontend Engineer) or create your own.",
    },
    {
      title: "Set duration",
      desc: "Select a session length that fits your schedule.",
    },
    {
      title: "Interview",
      desc: "Answer via voice or text; get adaptive follow-ups in real time.",
    },
    {
      title: "Get feedback",
      desc: "Review transcripts, highlights, and next steps.",
    },
  ];

  const stagger = {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };
  const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="how"
      className="relative rounded-b-4xl border-b"
      style={{
        background:
          "radial-gradient(60% 150px at 50% 100%, rgba(255,255,255,0.08), transparent 70%)",
      }}
    >
      <div className="container py-16">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-muted-foreground">
            Start practicing in under a minute.
          </p>
        </motion.div>

        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((s, i) => (
            <motion.li key={s.title} variants={fadeInUp}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background text-sm font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
                      {i + 1}
                    </span>
                    <CardTitle className="text-base bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
                      {s.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-muted-foreground">
                  {s.desc}
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
};

export default Process;
