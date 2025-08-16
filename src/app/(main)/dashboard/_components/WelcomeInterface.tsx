"use client";

import React from "react";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Welcome = () => {
  const { user } = useUser();
  const name = user?.name?.trim() || "there";
  const picture = user?.picture || "/user.png";
  const initial = name?.charAt(0)?.toUpperCase() || "U";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <section
      className="relative w-full lg:mb-8 mb-5 overflow-hidden rounded-xl border border-border bg-card/80 p-4 sm:p-6 md:p-8 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60"
      aria-label="Welcome"
    >
      {/* Decorative ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-secondary/15 blur-3xl"
      />

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* Avatar */}
        <div className="shrink-0">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 ring-2 ring-ring ring-offset-2 ring-offset-background border border-border transition-transform duration-300 ease-out group-hover:scale-105">
            <AvatarImage src={picture} alt={`${name} profile`} />
            <AvatarFallback className="bg-muted text-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Text */}
        <div className="text-center sm:text-left">
          <div className="lg:inline-flex hidden items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
            {getGreeting()}
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>

          <h2 className="mt-2 text-xl font-medium tracking-tight md:text-2xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
            {getGreeting()}, <span className="">{name}</span> 👋
          </h2>
          <p className="mt-1 text-sm md:text-base text-muted-foreground">
            Welcome back! Hope you&apos;re having great day.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
