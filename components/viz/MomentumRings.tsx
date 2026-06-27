"use client";
import { motion } from "framer-motion";
import { type MomentumData } from "@/data/viz-student-extra";
import { cn } from "@/lib/utils";

const EASE = [0.22, 0.61, 0.36, 1] as const;

const CX = 72;
const CY = 72;

const RINGS = [
  { r: 56, stroke: 8, color: "#5E7C6A", label: "Days in a row",      unit: "days" },
  { r: 42, stroke: 8, color: "#37357A", label: "This week's pace",    unit: "× faster" },
  { r: 28, stroke: 8, color: "#C8802E", label: "Skills secured",      unit: "" },
] as const;

const LEGEND_DOTS = [
  { color: "#5E7C6A", label: "Streak" },
  { color: "#37357A", label: "Pace" },
  { color: "#C8802E", label: "Mastery" },
] as const;

export function MomentumRings({
  data,
  className,
}: {
  data: MomentumData;
  className?: string;
}) {
  const fractions = [
    data.streak / data.maxStreak,
    Math.min(1, Math.min(1.5, data.velocityThis / Math.max(data.velocityLast, 0.01)) / 1.5),
    data.masteredCount / Math.max(data.totalCount, 1),
  ];

  const paceLabel =
    data.velocityThis >= data.velocityLast
      ? `${data.velocityThis.toFixed(1)} nodes this week`
      : `${data.velocityThis.toFixed(1)} nodes this week`;

  return (
    <div className={cn("flex items-center gap-5", className)}>
      {/* SVG rings */}
      <div className="relative shrink-0" style={{ width: 144, height: 144 }}>
        <svg
          viewBox="0 0 144 144"
          width={144}
          height={144}
          style={{ display: "block" }}
        >
          {/* Track circles (background) */}
          {RINGS.map((ring) => {
            const circumference = 2 * Math.PI * ring.r;
            return (
              <circle
                key={`track-${ring.r}`}
                cx={CX}
                cy={CY}
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth={ring.stroke}
                strokeOpacity={0.12}
              />
            );
          })}

          {/* Animated fill arcs */}
          {RINGS.map((ring, idx) => {
            const circumference = 2 * Math.PI * ring.r;
            const fraction = fractions[idx] ?? 0;
            const targetOffset = circumference * (1 - fraction);
            return (
              <motion.circle
                key={`fill-${ring.r}`}
                cx={CX}
                cy={CY}
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth={ring.stroke}
                strokeLinecap="round"
                strokeDasharray={String(circumference)}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: targetOffset }}
                transition={{
                  duration: 0.9,
                  delay: idx * 0.18,
                  ease: [...EASE],
                }}
                style={{ transformOrigin: "center", rotate: "-90deg" }}
              />
            );
          })}
        </svg>

        {/* Center label — streak number */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        >
          <span className="font-display text-2xl leading-none text-ink">
            {data.streak}
          </span>
          <span className="mt-0.5 text-[10px] text-muted">day run</span>
        </div>
      </div>

      {/* Legend rows */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start gap-2">
          <span
            className="mt-0.5 inline-block size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: "#5E7C6A" }}
          />
          <div>
            <p className="text-[12px] font-medium text-ink">
              {data.streak} day run
            </p>
            <p className="text-[11px] text-muted">
              best: {data.maxStreak} days
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span
            className="mt-0.5 inline-block size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: "#37357A" }}
          />
          <div>
            <p className="text-[12px] font-medium text-ink">{paceLabel}</p>
            <p className="text-[11px] text-muted">
              vs {data.velocityLast.toFixed(1)} last week
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span
            className="mt-0.5 inline-block size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: "#C8802E" }}
          />
          <div>
            <p className="text-[12px] font-medium text-ink">
              {data.masteredCount} of {data.totalCount} skills secure
            </p>
            <p className="text-[11px] text-muted">in this topic</p>
          </div>
        </div>
      </div>
    </div>
  );
}
