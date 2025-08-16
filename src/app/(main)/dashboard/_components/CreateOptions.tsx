"use client";

import React from "react";
import Link from "next/link";
import { Phone, Video, ArrowRight } from "lucide-react";

type Accent = "primary" | "secondary";

const CreateOptions = () => {
  return (
    <section aria-labelledby="create-heading">
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="create-heading"
          className="mb-2 lg:text-2xl text-xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 tracking-tight"
        >
          What would you like to create?
        </h2>
        <p className="mx-auto max-w-lg text-sm text-muted-foreground">
          Pick a flow to get started.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ActionCard
          href="/dashboard/create-interview"
          title="Create New Interview"
          desc="Create AI interviews and schedule them with candidates."
          icon={<Video className="h-6 w-6" />}
          cta="Get started"
        />
        <ActionCard
          href="/create-call"
          title="Create Phone Screening Call"
          desc="Schedule a phone screening call with candidates."
          icon={<Phone className="h-6 w-6" />}
          cta="Schedule now"
        />
      </div>
    </section>
  );
};

export default CreateOptions;

function ActionCard({
  href,
  title,
  desc,
  icon,
  cta,
}: {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  cta: string;
  accent?: Accent;
}) {
  return (
    <Link
      href={href}
      aria-label={title}
      className={`group relative block rounded-2xl p-[1px] transition-transform duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:transform-none bg-gradient-to-br from-primary/30 via-border to-primary/10`}
    >
      <div className="relative rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-colors">
        {/* Ambient glow */}

        <div className="flex items-start gap-4">
          <div
            className={`grid h-12 w-12 place-items-center rounded-lg transition-all duration-300 ease-out group-hover:rotate-1 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground`}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-lg text-card-foreground">
              {title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 text-sm text-primary">
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
