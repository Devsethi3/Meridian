'use client';

import { Timer as TimerIcon } from 'lucide-react';
import { formatDuration } from '@/lib/format-duration';
import type { CallStatus } from '@/types/interview';

interface CallHeaderProps {
  callStatus: CallStatus;
  durationSec: number;
  jobPosition?: string;
}

const badgeClass = (status: CallStatus) => {
  const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border';
  switch (status) {
    case 'connecting':
      return `${base} bg-secondary text-secondary-foreground`;
    case 'in-call':
      return `${base} bg-primary text-primary-foreground`;
    case 'ending':
    case 'ended':
    case 'idle':
      return `${base} bg-muted text-muted-foreground`;
    case 'error':
      return `${base} bg-destructive text-destructive-foreground`;
    default:
      return `${base} bg-muted text-muted-foreground`;
  }
};

export const CallHeader = ({ callStatus, durationSec, jobPosition }: CallHeaderProps) => {
  return (
    <div className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div>
          <div className="font-semibold">AI Interview</div>
          <div className="text-sm text-muted-foreground">{jobPosition || '—'}</div>
        </div>

        <div className="flex items-center gap-3">
          <span className={badgeClass(callStatus)}>
            {callStatus === 'in-call' && (
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
            )}
            {callStatus.replace('-', ' ')}
          </span>
          <div className="flex items-center gap-1.5 text-sm tabular-nums">
            <TimerIcon className="h-4 w-4 text-muted-foreground" />
            <span>{formatDuration(durationSec)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};