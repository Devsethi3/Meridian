// app/interview/[interviewId]/start/_components/OverlayLoader.tsx
"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverlayLoaderProps {
  show: boolean;
  text: string;
}

export const OverlayLoader = ({ show, text }: OverlayLoaderProps) => {
  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        "bg-background/80 backdrop-blur-sm",
        "flex items-center justify-center",
        "animate-in fade-in duration-200"
      )}
    >
      <div className="rounded-xl border bg-card p-6 shadow-lg max-w-sm mx-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div className="relative h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          </div>
          <div>
            <p className="font-medium">{text}</p>
            <p className="text-xs text-muted-foreground mt-1">Please wait...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
