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

  const headerStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const gridStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2,
      },
    },
  };

  const cardContentStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const elementFadeUp = {
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

  return (
    <section
      id="how"
      className="relative rounded-b-4xl border-b"
      style={{
        background:
          "radial-gradient(60% 150px at 50% 100%, rgba(255,255,255,0.08), transparent 70%)",
      }}
    >
      <motion.div
        className="container py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUp}
      >
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={headerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            variants={fadeUp}
            className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 text-3xl tracking-tight sm:text-4xl"
          >
            How it works
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-muted-foreground">
            Start practicing in under a minute.
          </motion.p>
        </motion.div>

        <motion.ol
          variants={gridStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              variants={fadeUp}
              whileHover={{
                y: -3,
                transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
              }}
            >
              <Card className="h-full">
                <motion.div
                  variants={cardContentStagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.8 }}
                >
                  <CardHeader>
                    <motion.div
                      className="flex items-center gap-3"
                      variants={elementFadeUp}
                    >
                      <motion.span
                        variants={elementFadeUp}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background text-sm font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40"
                      >
                        {i + 1}
                      </motion.span>
                      <motion.div variants={elementFadeUp}>
                        <CardTitle className="text-base bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
                          {s.title}
                        </CardTitle>
                      </motion.div>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <motion.p
                      variants={elementFadeUp}
                      className="text-sm text-muted-foreground"
                    >
                      {s.desc}
                    </motion.p>
                  </CardContent>
                </motion.div>
              </Card>
            </motion.li>
          ))}
        </motion.ol>
      </motion.div>
    </section>
  );
};

export default Process;
