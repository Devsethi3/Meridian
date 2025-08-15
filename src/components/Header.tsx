import React from "react";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ThemeToggleButton } from "./ui/theme-toggle-button";

export function Header() {
  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className=" flex h-16 container items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Rocket className="h-4 w-4" />
              </span>
              <span className="text-base">MockMate</span>
            </Link>
            <Badge variant="secondary" className="hidden md:inline-flex">
              Free
            </Badge>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="#how"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="#cta"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Get started
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggleButton
              showLabel
              variant="circle-blur"
              start="top-right"
            />

            <Link href="/dashboard">
              <Button size="sm">Go to app</Button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
