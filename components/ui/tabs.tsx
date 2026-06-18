"use client";

import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

/** Underline tabs — quiet, editorial. */
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
  return (
    <div className={cn("flex gap-6 border-b border-line", className)}>
      {items.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative -mb-px whitespace-nowrap pb-3 text-sm font-medium transition-colors",
              active ? "text-ink" : "text-faint hover:text-muted",
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="ml-1.5 text-xs text-faint tnum">{t.count}</span>
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-indigo" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Pill segmented control. */
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
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-xl border border-line bg-sand p-0.5",
        className,
      )}
    >
      {items.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all",
              active
                ? "bg-surface text-ink shadow-soft"
                : "text-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
