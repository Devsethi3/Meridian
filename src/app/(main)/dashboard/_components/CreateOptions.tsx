"use client";

import React from "react";
import Link from "next/link";
import { Phone, Video, ArrowRight, Clock } from "lucide-react";

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
          disabled={false}
        />
        <ActionCard
          href="/create-call"
          title="Create Phone Screening Call"
          desc="Schedule a phone screening call with candidates."
          icon={<Phone className="h-6 w-6" />}
          cta="Schedule now"
          disabled={true}
          comingSoon={true}
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
  disabled = false,
  comingSoon = false,
}: {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  cta: string;
  accent?: Accent;
  disabled?: boolean;
  comingSoon?: boolean;
}) {
  if (disabled) {
    return (
      <div
        aria-label={`${title} - Coming Soon`}
        className="group relative block rounded-2xl p-[1px] cursor-not-allowed opacity-60 bg-gradient-to-br from-muted/20 via-border/50 to-muted/10"
      >
        <CardContent
          title={title}
          desc={desc}
          icon={icon}
          cta={cta}
          disabled={disabled}
          comingSoon={comingSoon}
        />
      </div>
    );
  }

  return (
    <Link
      href={href}
      aria-label={title}
      className="group relative block rounded-2xl p-[1px] transition-transform duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:transform-none bg-gradient-to-br from-primary/30 via-border to-primary/10"
    >
      <CardContent
        title={title}
        desc={desc}
        icon={icon}
        cta={cta}
        disabled={disabled}
        comingSoon={comingSoon}
      />
    </Link>
  );
}

function CardContent({
  title,
  desc,
  icon,
  cta,
  disabled,
  comingSoon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  cta: string;
  disabled: boolean;
  comingSoon: boolean;
}) {
  return (
    <div className="relative rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-colors">
      {/* Coming Soon Badge */}
      {comingSoon && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground shadow-sm border border-border">
            <Clock className="h-3 w-3" />
            Coming Soon
          </div>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`grid h-12 w-12 place-items-center rounded-lg transition-all duration-300 ease-out ${
            disabled
              ? "bg-muted/50 text-muted-foreground"
              : "group-hover:rotate-1 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
          }`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3
            className={`text-lg ${
              disabled ? "text-muted-foreground" : "text-card-foreground"
            }`}
          >
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>

      <div
        className={`mt-4 inline-flex items-center gap-2 text-sm ${
          disabled ? "text-muted-foreground" : "text-primary"
        }`}
      >
        {disabled && comingSoon ? "Coming Soon" : cta}
        <ArrowRight
          className={`h-4 w-4 transition-transform duration-300 ease-out ${
            disabled ? "" : "group-hover:translate-x-1"
          }`}
        />
      </div>
    </div>
  );
}
