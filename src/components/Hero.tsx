import { HeroVideoDialog } from "./ui/hero-video-dialog";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

const HeroSection = () => {
  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 1, 0.21, 1] },
  };
  const stagger = {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };
  return (
    <div>
      <section className="relative overflow-hidden">
        {/* Background: radial spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_0%,hsl(var(--primary)/0.18),transparent_60%)]"
        />

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center text-center"
          >
            <motion.div variants={fadeUp}>
              <div className="mb-4 flex items-center justify-center gap-2">
                <Badge variant="secondary" className="border border-border">
                  Free AI Interview Practice
                </Badge>
                <span className="text-xs text-muted-foreground">
                  No credit card required
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-3xl max-w-5xl md:text-4xl lg:text-5xl xl:text-6xl text-center tracking-tighter bg-clip-text text-transparent mx-auto bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]"
            >
              Ace Interviews with AI: Personalized Practice for Your Dream Job
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg"
            >
              Create realistic, role-specific mock interviews with adjustable
              duration and get immediate feedback.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                <Link href="/sign-up">
                  Create your interview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#demo">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch demo
                </Link>
              </Button>
            </motion.div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4">
                <div>
                  <p className="text-sm font-medium">Role-specific questions</p>
                  <p className="text-xs text-muted-foreground">
                    Engineer, DS, PM, Design, and more
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4">
                <div>
                  <p className="text-sm font-medium">Voice + transcription</p>
                  <p className="text-xs text-muted-foreground">
                    Speak naturally, see real-time text
                  </p>
                </div>
              </div>
            </div>
            {/* Mock "device" frame */}
            <div className="mt-10">
              <HeroVideoDialog
                className="dark:hidden block"
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                thumbnailAlt="Hero Video"
              />
              <HeroVideoDialog
                className="hidden dark:block"
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                thumbnailAlt="Hero Video"
              />
            </div>
            {/* Powered by */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
            >
              <span className="text-xs text-muted-foreground">Powered by</span>
              <TechBadge>OpenAI</TechBadge>
              <TechBadge>Deepgram</TechBadge>
              <TechBadge>Vapi</TechBadge>
              <TechBadge>Supabase</TechBadge>
              <TechBadge>Clerk</TechBadge>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;

function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
      {children}
    </span>
  );
}
