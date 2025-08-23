import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function titleCase(s: string) {
  return s
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


export function formatDuration(d: string | null | undefined): string {
  if (!d) return "—";
  // ISO 8601 format
  if (/^P(T.*)?/i.test(d)) {
    const h = parseInt(d.match(/(\d+)H/i)?.[1] || "0", 10);
    const m = parseInt(d.match(/(\d+)M/i)?.[1] || "0", 10);
    const s = parseInt(d.match(/(\d+)S/i)?.[1] || "0", 10);
    const parts: string[] = [];
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (s && !h && !m) parts.push(`${s}s`);
    return parts.join(" ") || "0m";
  }
  // Fallback minutes
  const mins = parseInt(String(d).replace(/[^\d]/g, ""), 10);
  if (!isNaN(mins)) {
    if (mins >= 60) {
      const hh = Math.floor(mins / 60);
      const mm = mins % 60;
      return mm ? `${hh}h ${mm}m` : `${hh}h`;
    }
    return `${mins}m`;
  }
  return String(d);
}
