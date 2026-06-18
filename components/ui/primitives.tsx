import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------- Card ---------- */
export function Card({
  className,
  hover,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface shadow-soft",
        hover && "transition-shadow duration-300 hover:shadow-lift",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

/* ---------- Section label (small, uppercase, faint) ---------- */
export function SectionLabel({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.14em] text-faint",
        className,
      )}
      {...props}
    />
  );
}

/* ---------- Badge / Pill ---------- */
type Tone = "neutral" | "indigo" | "saffron" | "mastered" | "practising" | "gap" | "dormant";

const TONES: Record<Tone, string> = {
  neutral: "bg-sand text-muted ring-line",
  indigo: "bg-indigo-soft text-indigo ring-indigo/15",
  saffron: "bg-saffron-soft text-saffron-deep ring-saffron/20",
  mastered: "bg-mastered-soft text-mastered ring-mastered/20",
  practising: "bg-practising-soft text-practising ring-practising/25",
  gap: "bg-gap-soft text-gap ring-gap/20",
  dormant: "bg-dormant-soft text-muted ring-dormant/30",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}

/* ---------- Button ---------- */
type ButtonVariant = "primary" | "outline" | "ghost" | "subtle" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-indigo text-white hover:bg-indigo-ink shadow-soft",
  outline: "border border-line bg-surface text-ink hover:bg-sand",
  ghost: "text-muted hover:bg-sand hover:text-ink",
  subtle: "bg-sand text-ink hover:bg-line/70",
  danger: "border border-gap/30 bg-gap-soft text-gap hover:bg-gap/15",
};
const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-5 text-[15px] gap-2 rounded-xl",
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  }
>(function Button({ className, variant = "primary", size = "md", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex select-none items-center justify-center font-medium transition-colors duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});

/* ---------- Stat (big tabular number) ---------- */
export function Stat({
  label,
  value,
  sub,
  tone = "ink",
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "ink" | "mastered" | "gap" | "practising" | "indigo";
  className?: string;
}) {
  const toneClass = {
    ink: "text-ink",
    mastered: "text-mastered",
    gap: "text-gap",
    practising: "text-practising",
    indigo: "text-indigo",
  }[tone];
  return (
    <div className={className}>
      <SectionLabel>{label}</SectionLabel>
      <div className={cn("mt-1.5 font-display text-3xl leading-none tnum", toneClass)}>
        {value}
      </div>
      {sub && <p className="mt-1.5 text-[13px] text-muted">{sub}</p>}
    </div>
  );
}

/* ---------- Divider ---------- */
export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-line", className)} />;
}

/* ---------- KeyValue row ---------- */
export function KeyValue({ k, v }: { k: React.ReactNode; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="text-[13px] text-muted">{k}</span>
      <span className="text-right text-sm font-medium text-ink">{v}</span>
    </div>
  );
}
