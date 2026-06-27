"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { heroClassStudents } from "@/data/students";

const W = 480;
const H = 280;
const PAD = { l: 44, r: 24, t: 20, b: 40 };

const VEL_MIN = 0.8;
const VEL_MAX = 3.2;
const GAP_MIN = 0;
const GAP_MAX = 6;

// SVG x: low velocity → left, high velocity → right
function xScale(v: number): number {
  return PAD.l + ((v - VEL_MIN) / (VEL_MAX - VEL_MIN)) * (W - PAD.l - PAD.r);
}

// SVG y: high gapDebt → top (concerning), low gapDebt → bottom
function yScale(g: number): number {
  return PAD.t + (1 - (g - GAP_MIN) / (GAP_MAX - GAP_MIN)) * (H - PAD.t - PAD.b);
}

function dotColor(s: { gapDebt: number; masteryVelocity: number; expectedVelocity: number }): string {
  if (s.gapDebt >= 2) return "#B25B43";                                    // gap — terracotta
  if (s.masteryVelocity >= s.expectedVelocity * 1.15) return "#37357A";   // high velocity — indigo
  return "#5E7C6A";                                                         // on track — sage
}

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

const EASE = [0.22, 0.61, 0.36, 1] as const;

interface DotData {
  id: string;
  name: string;
  cx: number;
  cy: number;
  color: string;
  velocity: number;
  gap: number;
}

export function ClassConstellation({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<DotData | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const dots: DotData[] = heroClassStudents.map((s) => ({
    id: s.id,
    name: s.name.split(" ")[0],
    cx: xScale(s.masteryVelocity),
    cy: yScale(s.gapDebt),
    color: dotColor(s),
    velocity: s.masteryVelocity,
    gap: s.gapDebt,
  }));

  // Constellation lines: only between dots of the same colour, within 70px
  const lines: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const a = dots[i];
      const b = dots[j];
      if (a.color !== b.color) continue;
      const d = dist(a.cx, a.cy, b.cx, b.cy);
      if (d <= 70) {
        lines.push({ x1: a.cx, y1: a.cy, x2: b.cx, y2: b.cy, color: a.color });
      }
    }
  }

  // Grid: 3 horizontal dashed hairlines
  const gridYs = [
    yScale(2),
    yScale(4),
  ];

  function handleMouseEnter(dot: DotData, e: React.MouseEvent<SVGCircleElement>) {
    setHovered(dot);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        x: dot.cx / W * rect.width,
        y: dot.cy / H * rect.height,
      });
    }
  }

  return (
    <div className={`relative select-none ${className ?? ""}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", overflow: "visible" }}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Horizontal grid lines */}
        {gridYs.map((gy, i) => (
          <line
            key={i}
            x1={PAD.l}
            y1={gy}
            x2={W - PAD.r}
            y2={gy}
            stroke="#ECEAE3"
            strokeWidth={1}
            strokeDasharray="3 5"
          />
        ))}

        {/* Y-axis */}
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#ECEAE3" strokeWidth={1} />
        {/* X-axis */}
        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#ECEAE3" strokeWidth={1} />

        {/* Constellation lines */}
        {lines.map((ln, i) => (
          <line
            key={i}
            x1={ln.x1}
            y1={ln.y1}
            x2={ln.x2}
            y2={ln.y2}
            stroke={ln.color}
            strokeWidth={1}
            strokeOpacity={0.08}
          />
        ))}

        {/* Dots */}
        {dots.map((dot, i) => (
          <motion.circle
            key={dot.id}
            cx={dot.cx}
            cy={dot.cy}
            r={5.5}
            fill={dot.color}
            fillOpacity={0.88}
            stroke="#FAF9F6"
            strokeWidth={1.5}
            initial={{ cx: W / 2, cy: H / 2, opacity: 0, r: 0 }}
            animate={{ cx: dot.cx, cy: dot.cy, opacity: 1, r: 5.5 }}
            transition={{ duration: 0.25, delay: i * 0.025, ease: EASE }}
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) => handleMouseEnter(dot, e as unknown as React.MouseEvent<SVGCircleElement>)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {/* X-axis label */}
        <text
          x={(PAD.l + W - PAD.r) / 2}
          y={H - 4}
          textAnchor="middle"
          fill="#9C988E"
          fontSize={10}
        >
          Learning pace →
        </text>

        {/* Y-axis label (rotated) */}
        <text
          x={0}
          y={0}
          textAnchor="middle"
          fill="#9C988E"
          fontSize={10}
          transform={`translate(12, ${(PAD.t + H - PAD.b) / 2}) rotate(-90)`}
        >
          Gap debt ↑
        </text>
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-line bg-surface px-3 py-2 shadow-soft"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y - 64,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          <p className="text-[13px] font-medium text-ink">{hovered.name}</p>
          <p className="mt-0.5 text-[11px] text-muted">
            Pace <span className="font-medium text-ink">{hovered.velocity.toFixed(1)}×</span>
            {" · "}
            Gaps <span className="font-medium text-ink">{hovered.gap}</span>
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {[
          { color: "#5E7C6A", label: "On track" },
          { color: "#37357A", label: "Moving fast" },
          { color: "#B25B43", label: "Needs support" },
        ].map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5 text-[11px] text-muted">
            <span className="inline-block size-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
