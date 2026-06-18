import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { MasteryStatus } from "@/data/types";
import { STATUS_META, statusColor } from "@/lib/status";
import { Badge } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function StatusDot({ status, size = 9 }: { status: MasteryStatus; size?: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, backgroundColor: statusColor(status) }}
    />
  );
}

export function MasteryChip({ status }: { status: MasteryStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge tone={meta.tone}>
      <StatusDot status={status} size={7} />
      {meta.label}
    </Badge>
  );
}

/** A velocity-style delta: value vs expected with a quiet arrow. */
export function Delta({
  value,
  expected,
  unit = "",
  goodWhenAbove = true,
}: {
  value: number;
  expected: number;
  unit?: string;
  goodWhenAbove?: boolean;
}) {
  const diff = value - expected;
  const good = goodWhenAbove ? diff >= 0 : diff <= 0;
  const Icon = diff >= 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[12px] font-medium tnum",
        good ? "text-mastered" : "text-gap",
      )}
    >
      <Icon size={13} />
      {diff >= 0 ? "+" : ""}
      {diff.toFixed(1)}
      {unit}
    </span>
  );
}

/** Avatar + name + optional one-liner. Purely visual — wrap in Link/button to navigate. */
export function StudentChip({
  name,
  sub,
  size = 38,
  trailing,
  className,
}: {
  name: string;
  sub?: React.ReactNode;
  size?: number;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar name={name} size={size} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{name}</p>
        {sub && <p className="truncate text-[12px] text-muted">{sub}</p>}
      </div>
      {trailing}
    </div>
  );
}

/** A small labelled metric tile. */
export function MetricTile({
  label,
  value,
  foot,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  foot?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft transition-shadow duration-300 hover:shadow-lift">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">{label}</p>
      <p className="mt-2 font-display text-[28px] leading-none tnum text-ink" style={accent ? { color: accent } : undefined}>
        {value}
      </p>
      {foot && <div className="mt-2 text-[12px] text-muted">{foot}</div>}
    </div>
  );
}
