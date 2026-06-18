"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

const SPRING = { type: "spring" as const, stiffness: 420, damping: 36 };

/** Underline tabs — the indicator glides between items. */
export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const uid = useId();
  return (
    <div className={cn("flex gap-6 border-b border-line", className)}>
      {items.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative -mb-px whitespace-nowrap pb-3 text-sm font-medium transition-colors duration-200",
              active ? "text-ink" : "text-faint hover:text-muted",
            )}
          >
            {t.label}
            {typeof t.count === "number" && <span className="ml-1.5 text-xs text-faint tnum">{t.count}</span>}
            {active && (
              <motion.span
                layoutId={`tab-underline-${uid}`}
                transition={SPRING}
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-indigo"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Pill segmented control — the active pill slides. */
export function Segmented({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const uid = useId();
  return (
    <div className={cn("inline-flex items-center gap-0.5 rounded-xl border border-line bg-sand p-0.5", className)}>
      {items.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-200",
              active ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-pill-${uid}`}
                transition={SPRING}
                className="absolute inset-0 rounded-lg bg-surface shadow-soft"
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
