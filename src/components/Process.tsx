import { motion } from "framer-motion";
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

  // Container animation
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // Item animation with spring physics for smoother motion
  const item = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 100,
        mass: 0.5,
      },
    },
  };

  // Card hover animation
  const cardHover = {
    scale: 1.02,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  };

  // Number badge hover animation
  const numberHover = {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  };

  return (
    <section
      id="how"
      className="relative rounded-b-4xl border-b bg-[radial-gradient(60%_100px_at_50%_100%,rgba(0,0,0,0.08),transparent_70%)] dark:bg-[radial-gradient(60%_150px_at_50%_100%,rgba(255,255,255,0.08),transparent_70%)]"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <motion.div
        className="container py-20 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={container}
      >
        <motion.div
          className="mx-auto max-w-2xl text-center mb-16"
          variants={item}
        >
          <motion.h2
            variants={item}
            className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 text-3xl tracking-tight sm:text-4xl"
          >
            How it works
          </motion.h2>
          <motion.p variants={item} className="mt-2 text-muted-foreground">
            Start practicing in under a minute.
          </motion.p>
        </motion.div>

        <motion.ol
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={container}
        >
          {steps.map((s, i) => (
            <motion.li key={s.title} variants={item}>
              <Card className="h-full border-border/40 bg-card/50 backdrop-blur-sm relative overflow-hidden group">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

                {/* Shiny corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 rotate-45 bg-gradient-to-r from-primary/10 to-transparent translate-x-8 -translate-y-8" />
                </div>

                <CardHeader className="">
                  <div className="flex items-center gap-4">
                    <motion.span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-lg text-foreground/80 shadow-sm">
                      {i + 1}
                    </motion.span>
                    <CardTitle className="text-lg bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 font-normal">
                      {s.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.p
                    className="text-muted-foreground/80 text-sm leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    {s.desc}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </motion.ol>
      </motion.div>
    </section>
  );
};

export default Process;
