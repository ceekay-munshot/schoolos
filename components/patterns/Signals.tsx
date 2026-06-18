import { CircleCheck, CircleDot, Clock3, CloudOff, RefreshCw, Sparkle, Pencil, X, UserCheck, Eye } from "lucide-react";
import type { Confidence, FreshnessState, AIDecision } from "@/data/types";
import { cn } from "@/lib/utils";

/* ---------- Confidence indicator (Design Brief §12) ---------- */
const CONF: Record<Confidence, { label: string; dot: string; text: string }> = {
  high: { label: "High confidence", dot: "#5E7C6A", text: "text-mastered" },
  medium: { label: "Medium confidence", dot: "#37357A", text: "text-indigo" },
  low: { label: "Low confidence", dot: "#C0913A", text: "text-practising" },
  provisional: { label: "Provisional", dot: "#B3AFA5", text: "text-muted" },
};

export function ConfidenceBadge({ level, className }: { level: Confidence; className?: string }) {
  const c = CONF[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-medium",
        c.text,
        className,
      )}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {c.label}
    </span>
  );
}

/* ---------- Data freshness ---------- */
const FRESH: Record<FreshnessState, { label: string; icon: typeof Clock3; cls: string }> = {
  today: { label: "Updated today", icon: CircleCheck, cls: "text-mastered" },
  recent: { label: "Updated recently", icon: Clock3, cls: "text-muted" },
  stale: { label: "No recent work", icon: CircleDot, cls: "text-practising" },
  "sync-pending": { label: "Sync pending", icon: RefreshCw, cls: "text-indigo" },
};

export function Freshness({
  state,
  label,
  className,
}: {
  state: FreshnessState;
  label?: string;
  className?: string;
}) {
  const f = FRESH[state];
  const Icon = state === "sync-pending" ? CloudOff : f.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px]", f.cls, className)}>
      <Icon size={12} />
      {label ?? f.label}
    </span>
  );
}

/* ---------- AI decision status ---------- */
const AISTATUS: Record<AIDecision, { label: string; icon: typeof Sparkle; cls: string }> = {
  suggested: { label: "AI suggested", icon: Sparkle, cls: "text-indigo" },
  accepted: { label: "Teacher accepted", icon: CircleCheck, cls: "text-mastered" },
  edited: { label: "Teacher edited", icon: Pencil, cls: "text-indigo" },
  rejected: { label: "Rejected", icon: X, cls: "text-gap" },
  "coach-contextualized": { label: "Coach contextualised", icon: UserCheck, cls: "text-mastered" },
  "human-review": { label: "Human review required", icon: Eye, cls: "text-practising" },
};

export function AIStatus({ status, className }: { status: AIDecision; className?: string }) {
  const s = AISTATUS[status];
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium", s.cls, className)}>
      <Icon size={12} /> {s.label}
    </span>
  );
}
