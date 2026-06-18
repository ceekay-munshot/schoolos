"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { SeriesPoint } from "@/data/types";
import { cn } from "@/lib/utils";

const FORMATTERS = {
  percent: (v: number) => `${Math.round(v * 100)}%`,
  decimal1: (v: number) => v.toFixed(1),
  decimal2: (v: number) => v.toFixed(2),
  int: (v: number) => `${Math.round(v)}`,
} as const;

/** A trend line that draws itself on, with a hover scrubber showing each point.
 *  `format` is a keyword (not a function) so it works from server components. */
export function AnimatedTrend({
  data,
  color = "#37357A",
  format = "decimal1",
  height = 132,
  className,
}: {
  data: SeriesPoint[];
  color?: string;
  format?: keyof typeof FORMATTERS;
  height?: number;
  className?: string;
}) {
  const fmt = FORMATTERS[format];
  const W = 480;
  const padX = 10;
  const padY = 22;
  const ref = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i: number) => padX + (i / (data.length - 1)) * (W - padX * 2);
  const y = (v: number) => padY + (1 - (v - min) / span) * (height - padY * 2);
  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const id = `at-${color.replace("#", "")}`;
  const active = hover ?? data.length - 1;

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    const idx = Math.round(frac * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, idx)));
  }

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${height}`}
      width="100%"
      className={cn("overflow-visible touch-none", className)}
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.16} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      <motion.path
        d={`${line} L${x(data.length - 1)},${height} L${x(0)},${height} Z`}
        fill={`url(#${id})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      />

      {/* hover guide */}
      <line x1={x(active)} y1={padY - 6} x2={x(active)} y2={height - padY + 6} stroke={color} strokeOpacity={0.25} strokeDasharray="3 3" />
      <circle cx={x(active)} cy={y(data[active].value)} r={5} fill={color} stroke="#fff" strokeWidth={2} />

      {/* readout */}
      <text x={x(active)} y={padY - 9} textAnchor="middle" className="fill-ink" style={{ fontSize: 12, fontWeight: 600 }}>
        {fmt(data[active].value)}
      </text>
      <text x={x(active)} y={height - 4} textAnchor="middle" className="fill-faint" style={{ fontSize: 10 }}>
        {data[active].label}
      </text>
    </svg>
  );
}
