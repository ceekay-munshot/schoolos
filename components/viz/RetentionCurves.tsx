"use client";
import { motion } from "framer-motion";
import { retentionSkills } from "@/data/viz-coach-extra";
import { cn } from "@/lib/utils";

const W = 520;
const H = 200;
const PAD = { l: 44, r: 20, t: 16, b: 32 };

const CHART_W = W - PAD.l - PAD.r;
const CHART_H = H - PAD.t - PAD.b;

const EASE = [0.22, 0.61, 0.36, 1] as const;

function retentionAt(days: number, decayDays: number): number {
  return Math.exp(-days / decayDays);
}

function curvePath(decayDays: number): string {
  const points = Array.from({ length: 61 }, (_, i) => {
    const days = i * 2;
    const ret = retentionAt(days, decayDays);
    const x = PAD.l + (days / 120) * CHART_W;
    const y = PAD.t + (1 - ret) * CHART_H;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return points.join(" ");
}

function dayX(days: number): number {
  return PAD.l + (Math.min(days, 120) / 120) * CHART_W;
}

function retY(ret: number): number {
  return PAD.t + (1 - ret) * CHART_H;
}

const GRIDLINES = [1.0, 0.7, 0.5, 0.25];
const SAFE_THRESHOLD = 0.7;

export function RetentionCurves({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block" }}
        aria-label="Retention curves for mastered skills"
      >
        {/* Y-axis gridlines */}
        {GRIDLINES.map((val) => {
          const y = retY(val);
          const isSafe = val === SAFE_THRESHOLD;
          return (
            <g key={`grid-${val}`}>
              <line
                x1={PAD.l}
                y1={y}
                x2={W - PAD.r}
                y2={y}
                stroke={isSafe ? "#B25B43" : "#ECEAE3"}
                strokeWidth={isSafe ? 1.5 : 1}
                strokeDasharray={isSafe ? "5 3" : undefined}
              />
              <text
                x={PAD.l - 6}
                y={y + 4}
                textAnchor="end"
                fontSize={9}
                fill={isSafe ? "#B25B43" : "#9C988E"}
              >
                {Math.round(val * 100)}%
              </text>
              {isSafe && (
                <text
                  x={W - PAD.r + 4}
                  y={y - 3}
                  textAnchor="start"
                  fontSize={9}
                  fill="#B25B43"
                >
                  Safe
                </text>
              )}
            </g>
          );
        })}

        {/* X-axis */}
        <line
          x1={PAD.l}
          y1={H - PAD.b}
          x2={W - PAD.r}
          y2={H - PAD.b}
          stroke="#ECEAE3"
          strokeWidth={1}
        />

        {/* X-axis labels */}
        {[0, 30, 60, 90, 120].map((d) => (
          <text
            key={`xlab-${d}`}
            x={dayX(d)}
            y={H - PAD.b + 12}
            textAnchor="middle"
            fontSize={9}
            className="fill-faint"
          >
            {d}d
          </text>
        ))}

        {/* Curve paths */}
        {retentionSkills.map((skill, i) => {
          const path = curvePath(skill.decayDays);
          const stroke = skill.atRisk ? "#B25B43" : "#5E7C6A";
          const sw = skill.atRisk ? 2 : 1.5;

          return (
            <motion.path
              key={skill.nodeId}
              d={path}
              fill="none"
              stroke={stroke}
              strokeWidth={sw}
              strokeOpacity={0.85}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 0.6, ease: EASE, delay: i * 0.15 },
                opacity: { duration: 0.2, delay: i * 0.15 },
              }}
            />
          );
        })}

        {/* Current-day dots */}
        {retentionSkills.map((skill) => {
          const ret = retentionAt(skill.daysSinceMastered, skill.decayDays);
          const cx = dayX(skill.daysSinceMastered);
          const cy = retY(ret);
          const stroke = skill.atRisk ? "#B25B43" : "#5E7C6A";
          return (
            <circle
              key={`dot-${skill.nodeId}`}
              cx={cx}
              cy={cy}
              r={3.5}
              fill={stroke}
              stroke="#FAF9F6"
              strokeWidth={1.5}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-3 grid grid-cols-1 gap-y-1.5 sm:grid-cols-2">
        {retentionSkills.map((skill) => {
          const ret = retentionAt(skill.daysSinceMastered, skill.decayDays);
          const pct = Math.round(ret * 100);
          const color = skill.atRisk ? "#B25B43" : "#5E7C6A";
          return (
            <div key={skill.nodeId} className="flex items-center gap-2">
              <span
                className="inline-block size-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="truncate text-[11px] text-muted">
                {skill.label}
              </span>
              <span
                className="ml-auto shrink-0 text-[11px] font-medium tnum"
                style={{ color }}
              >
                {pct}%
              </span>
              {skill.atRisk && (
                <span className="shrink-0 rounded-full bg-gap-soft px-1.5 py-0.5 text-[10px] font-medium text-gap">
                  at risk
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
