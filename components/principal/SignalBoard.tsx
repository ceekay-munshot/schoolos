"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, ChevronRight, UserRound, CalendarClock } from "lucide-react";
import type { HealthMetric } from "@/data/principal-extra";
import { Sparkline } from "@/components/viz/charts";
import { AnimatedTrend } from "@/components/viz/AnimatedTrend";
import { ConfidenceBadge } from "@/components/patterns/Signals";
import { CountUp } from "@/components/motion";
import { Segmented } from "@/components/ui/tabs";
import { Sheet } from "@/components/ui/sheet";
import { Badge, SectionLabel } from "@/components/ui/primitives";
import { pct } from "@/lib/utils";
import { cn } from "@/lib/utils";

const COLOR: Record<string, string> = {
  pace: "#37357A",
  "gap-debt": "#5E7C6A",
  retention: "#37357A",
  path: "#C0913A",
  usage: "#5E7C6A",
  parents: "#37357A",
};

function valueParts(m: HealthMetric) {
  if (m.unit === "ratio") return { count: m.value * 100, suffix: "%", decimals: 0, unit: "" };
  return { count: m.value, suffix: "", decimals: 1, unit: "/wk" };
}
function deltaText(m: HealthMetric) {
  const s = m.momDelta >= 0 ? "+" : "";
  return m.unit === "ratio" ? `${s}${(m.momDelta * 100).toFixed(0)} pts` : `${s}${m.momDelta.toFixed(1)}`;
}

export function SignalBoard({ metrics }: { metrics: HealthMetric[] }) {
  const [range, setRange] = useState("8w");
  const [selected, setSelected] = useState<HealthMetric | null>(null);
  const slice = (m: HealthMetric) => (range === "4w" ? m.trend.slice(-4) : m.trend);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <SectionLabel>Six signs worth watching</SectionLabel>
        <Segmented
          items={[
            { id: "8w", label: "8 weeks" },
            { id: "4w", label: "4 weeks" },
          ]}
          value={range}
          onChange={setRange}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((m) => {
          const color = COLOR[m.key] ?? "#37357A";
          const improving = m.goodWhenRising ? m.momDelta >= 0 : m.momDelta <= 0;
          const Arrow = m.momDelta >= 0 ? ArrowUpRight : ArrowDownRight;
          const v = valueParts(m);
          return (
            <motion.button
              key={m.key}
              onClick={() => setSelected(m)}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group flex flex-col rounded-2xl border border-line bg-surface p-5 text-left shadow-soft transition-shadow duration-300 hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium uppercase tracking-[0.12em] text-faint">{m.label}</p>
                  <p className="mt-2 font-display text-[30px] leading-none tnum" style={{ color }}>
                    <CountUp value={v.count} decimals={v.decimals} suffix={v.suffix} />
                    {v.unit && <span className="ml-1 text-[13px] font-normal text-faint">{v.unit}</span>}
                  </p>
                </div>
                <Sparkline data={slice(m).map((d) => d.value)} width={88} height={38} color={color} />
              </div>

              <div className="mt-3 flex items-center gap-2.5">
                <span className={cn("inline-flex items-center gap-0.5 text-[12px] font-medium tnum", improving ? "text-mastered" : "text-gap")}>
                  <Arrow size={13} /> {deltaText(m)}
                </span>
                <span className="text-[12px] text-faint">vs last month</span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
                <span className="inline-flex min-w-0 items-center gap-1.5 text-[12px] text-faint">
                  Watch <Badge tone={m.key === "gap-debt" ? "gap" : "saffron"} className="max-w-[140px] truncate">{m.gradeNeedingAttention}</Badge>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-indigo opacity-0 transition-opacity group-hover:opacity-100">
                  Detail <ChevronRight size={13} />
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* detail drawer */}
      <Sheet
        open={!!selected}
        onClose={() => setSelected(null)}
        eyebrow="Leading signal"
        title={selected?.label}
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-4xl tnum text-ink" style={{ color: COLOR[selected.key] }}>
                  {selected.unit === "ratio" ? pct(selected.value) : selected.value.toFixed(2)}
                  {selected.unit === "pace" && <span className="ml-1 text-base font-normal text-faint">/wk</span>}
                </p>
                <p className="mt-1 text-[13px] text-muted">
                  {deltaText(selected)} vs last month · {range === "4w" ? "last 4 weeks" : "last 8 weeks"}
                </p>
              </div>
              <ConfidenceBadge level={selected.confidence} />
            </div>

            <div className="rounded-2xl border border-line bg-surface p-4">
              <AnimatedTrend data={slice(selected)} color={COLOR[selected.key]} format={selected.unit === "ratio" ? "percent" : "decimal2"} />
            </div>

            <div className="rounded-2xl bg-canvas p-4">
              <div className="flex items-center justify-between">
                <SectionLabel>Needs attention</SectionLabel>
                <Badge tone={selected.key === "gap-debt" ? "gap" : "saffron"}>{selected.gradeNeedingAttention}</Badge>
              </div>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink">{selected.action}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-3 text-[12px]">
                <span className="inline-flex items-center gap-1.5 text-faint">
                  <UserRound size={13} className="text-mastered" /> <span className="font-medium text-ink">{selected.owner}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-faint">
                  <CalendarClock size={13} /> reviewed every two weeks
                </span>
              </div>
            </div>

            <p className="text-[12px] leading-relaxed text-faint">
              This is a leading sign — it moves before a report card would, so the school can act early
              rather than waiting for an exam to reveal it.
            </p>
          </div>
        )}
      </Sheet>
    </div>
  );
}
