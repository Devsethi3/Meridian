"use client";

export type NormalizedQuestion = {
  question: string;
  type?: string;
};

export function normalizeQuestions(raw: unknown): NormalizedQuestion[] {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.filter(Boolean) as NormalizedQuestion[];
  }

  if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>;

    return Object.keys(obj)
      .filter((key) => key !== "length" && !isNaN(Number(key)))
      .map((key) => obj[Number(key)])
      .filter(Boolean) as NormalizedQuestion[];
  }

  return [];
}

// Use only shadcn-ui tokens: primary, secondary, accent, destructive, muted, foreground, border, card, etc.
export function getTypeBadgeClass(type?: string): string {
  const t = (type || "").toLowerCase();

  if (t.includes("technical")) {
    return "border-primary/30 bg-primary/10 text-primary";
  }
  if (t.includes("behavior")) {
    return "border-secondary/30 bg-secondary/10 text-secondary-foreground";
  }
  if (t.includes("experience")) {
    return "border-accent/30 bg-accent/10 text-accent-foreground";
  }
  if (t.includes("problem")) {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }
  if (t.includes("system")) {
    return "border-primary/20 bg-muted text-foreground";
  }
  return "border-muted-foreground/30 bg-muted text-muted-foreground";
}
