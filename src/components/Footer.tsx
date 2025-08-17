import {
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { HoverLink } from "./HoverLink";
import { Separator } from "./ui/separator";

const Footer = () => {
  return (
    <>
      <footer className="md:rounded-t-2xl relative w-full container flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(50%_100px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] md:px-6 px-4 pt-12 pb-4">
        <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

        <div className="flex flex-col items-center">
          <div className="group rounded-xl mb-8 bg-gradient-to-br from-primary/30 via-secondary/30 to-primary/30 p-[1px] transition-transform duration-300 hover:-translate-y-0.5">
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
          </div>

          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            <HoverLink href="#features" label="Features" />
            <HoverLink href="/#about" label="About" />
            <HoverLink href="/#how" label="How it works" />
            <HoverLink href="/#get-started" label="Get Started" />
          </nav>
          <div className="mb-8 flex space-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Github className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </div>
        </div>

        <Separator className="my-4" />
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-3 lg:gap-0 text-center lg:text-left">
          <p className="text-sm text-muted-foreground">
            A project by
            <Link
              href="https://dev-sethi.vercel.app"
              target="_blank"
              className="font-medium underline underline-offset-1 pl-2 text-primary"
            >
              Dev Sethi
            </Link>
          </p>

          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Meridian. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
