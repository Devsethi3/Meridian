"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableDescriptionProps {
  text?: string | null;
  collapsedHeight?: number; // px; default ~12rem
  fadeHeight?: number; // px; the fade zone height
  className?: string;
  autoScrollOnCollapse?: boolean; // scroll content back into view when collapsing
}

const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({
  text,
  collapsedHeight = 192, // 12rem ≈ 192px
  fadeHeight = 56,
  className = "",
  autoScrollOnCollapse = true,
}) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const contentId = React.useId();

  const measure = React.useCallback(() => {
    const el = contentRef.current;
    if (!el || !text) {
      setIsOverflowing(false);
      return;
    }
    // Check real content height vs collapsed height
    const needsToggle = el.scrollHeight > collapsedHeight + 1;
    setIsOverflowing(needsToggle);
  }, [collapsedHeight, text]);

  React.useEffect(() => {
    measure();

    const raf = requestAnimationFrame(measure);
    const t = setTimeout(measure, 100);

    if (document?.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [measure]);

  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  if (!text) {
    return <div className="text-sm text-muted-foreground">—</div>;
  }

  const shouldMask = !expanded && isOverflowing;

  const maskStyle: React.CSSProperties | undefined = shouldMask
    ? {
        WebkitMaskImage: `linear-gradient(to top, transparent 0, black ${fadeHeight}px, black 100%)`,
        maskImage: `linear-gradient(to top, transparent 0, black ${fadeHeight}px, black 100%)`,
      }
    : undefined;

  const handleToggle = () => {
    setExpanded((prev) => {
      const next = !prev;
      // When collapsing, bring the start of content back into view if it scrolled away
      if (prev && autoScrollOnCollapse) {
        queueMicrotask(() => {
          rootRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        });
      }
      return next;
    });
  };

  return (
    <div ref={rootRef} className={className}>
      <div className="prose prose-sm max-w-none">
        <div className="relative">
          <div
            id={contentId}
            ref={contentRef}
            className={[
              "text-foreground leading-relaxed whitespace-pre-wrap",
              "transition-[max-height] duration-300 ease-in-out",
              "motion-reduce:transition-none",
              !expanded ? "overflow-hidden" : "",
            ].join(" ")}
            style={{
              maxHeight: expanded ? "none" : `${collapsedHeight}px`,
              ...maskStyle,
            }}
          >
            {text}
          </div>
        </div>
      </div>

      {isOverflowing && (
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="inline-flex items-center gap-1 text-primary hover:text-primary"
            aria-expanded={expanded}
            aria-controls={contentId}
            onClick={handleToggle}
          >
            {expanded ? (
              <>
                Show less
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show more
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExpandableDescription;
