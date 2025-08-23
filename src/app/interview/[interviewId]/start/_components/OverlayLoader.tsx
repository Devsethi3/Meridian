'use client';

import { Loader2 } from 'lucide-react';

export const OverlayLoader = ({ show, text }: { show: boolean; text: string }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-sm grid place-items-center z-30">
      <div className="rounded-lg border bg-background p-5 flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <div className="text-sm">{text}</div>
      </div>
    </div>
  );
};