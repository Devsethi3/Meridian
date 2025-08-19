"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { HoverLink } from "./HoverLink";
import { Separator } from "./ui/separator";
import { motion, useReducedMotion } from "framer-motion";

const Footer = () => {
  const prefersReducedMotion = useReducedMotion();
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
    <motion.footer
     className="md:rounded-t-2xl relative w-full container flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(50%_100px_at_50%_0%,theme(backgroundColor.black/8%),transparent)] dark:bg-[radial-gradient(50%_100px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] md:px-6 px-4 pt-12 pb-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger}
    >
      <motion.div
        className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur"
        variants={fadeUp}
      />

      <motion.div className="flex flex-col items-center" variants={stagger}>
        <motion.div
          className="group rounded-xl mb-8 bg-gradient-to-br from-primary/30 via-secondary/30 to-primary/30 p-[1px] transition-transform duration-300 hover:-translate-y-0.5"
          variants={fadeUp}
        >
          <div className="rounded-xl bg-card/80 p-4 ring-1 ring-border/50 backdrop-blur">
            <Image
              src="/logo-light.svg"
              width={35}
              height={35}
              alt="logo"
              className="block dark:hidden"
            />
            <Image
              src="/logo-dark.svg"
              width={35}
              height={35}
              alt="logo"
              className="dark:block hidden"
            />{" "}
          </div>
        </motion.div>

        <motion.nav
          className="mb-8 flex flex-wrap justify-center gap-6"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <HoverLink href="#features" label="Features" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <HoverLink href="/#about" label="About" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <HoverLink href="/#how" label="How it works" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <HoverLink href="/#get-started" label="Get Started" />
          </motion.div>
        </motion.nav>

        <motion.div className="mb-8 flex space-x-4" variants={stagger}>
          <motion.div variants={fadeUp}>
            <Link
              href="https://github.com/Devsethi3"
              target="_blank"
              className={buttonVariants({
                variant: "outline",
                size: "icon",
                className: "rounded-full",
              })}
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link
              href="https://x.com/Dev_of_Code"
              target="_blank"
              className={buttonVariants({
                variant: "outline",
                size: "icon",
                className: "rounded-full",
              })}
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Link>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link
              href="https://www.linkedin.com/in/dev-prasad-sethi-162789326"
              target="_blank"
              className={buttonVariants({
                variant: "outline",
                size: "icon",
                className: "rounded-full",
              })}
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="w-full"
      >
        <Separator className="my-4" />
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-3 lg:gap-0 text-center lg:text-left">
          <motion.p className="text-sm text-muted-foreground" variants={fadeUp}>
            A project by
            <Link
              href="https://dev-sethi.vercel.app"
              target="_blank"
              className="font-medium underline underline-offset-1 pl-2 text-primary"
            >
              Dev Sethi
            </Link>
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm text-muted-foreground"
            variants={fadeUp}
          >
            © {new Date().getFullYear()} Meridian. All rights reserved.
          </motion.p>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
