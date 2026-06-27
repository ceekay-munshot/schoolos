"use client";

import { useState } from "react";
import { skillWeekData } from "@/data/viz-teacher-extra";

const NODES = [
  { id: "MATH.FRAC.MEANING.01",  short: "Meaning" },
  { id: "MATH.FRAC.MEANING.02",  short: "Number line" },
  { id: "MATH.FRAC.EQUIV.01",    short: "Equal fractions" },
  { id: "MATH.FRAC.COMPARE.02",  short: "Compare" },
  { id: "MATH.FRAC.ADD.03",      short: "Add fractions" },
  { id: "MATH.FRAC.WORD.04",     short: "Word problems" },
];

const WEEKS = ["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12"];
const CURRENT_WEEK = "W12";

const CELL_W = 36;
const CELL_H = 26;
const LABEL_W = 108;
const WEEK_HEADER_H = 24;
const GAP = 3;

const SVG_W = LABEL_W + WEEKS.length * (CELL_W + GAP) + 12;
const SVG_H = WEEK_HEADER_H + NODES.length * (CELL_H + GAP) + 8;

function cellColor(pct: number): string {
  if (pct >= 0.85) return "#5E7C6A";     // sage — high mastery
  if (pct >= 0.60) return "#C99A3F";     // amber — practising
  if (pct >= 0.30) return "#37357A44";   // indigo-soft — introduced
  if (pct > 0)     return "#B25B4340";   // terracotta-soft — struggling
  return "#ECEAE3";                       // sand — not started
}

function textColor(pct: number): string {
  if (pct >= 0.85) return "#FFFFFF";
  if (pct >= 0.60) return "#FFFFFF";
  return "#9C988E";
}

// Build a lookup map for quick access
const pctMap = new Map<string, number>();
for (const row of skillWeekData) {
  pctMap.set(`${row.week}::${row.nodeId}`, row.pct);
}

function getPct(week: string, nodeId: string): number {
  return pctMap.get(`${week}::${nodeId}`) ?? 0;
}

export function SkillHeatCalendar({ className }: { className?: string }) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    week: string;
    skill: string;
    pct: number;
  } | null>(null);

  return (
    <div className={`relative ${className ?? ""}`} style={{ minWidth: SVG_W }}>
      <svg
        width={SVG_W}
        height={SVG_H}
        style={{ display: "block", overflow: "visible" }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Week header labels */}
        {WEEKS.map((week, wi) => {
          const cx = LABEL_W + wi * (CELL_W + GAP) + CELL_W / 2;
          const isCurrent = week === CURRENT_WEEK;
          return (
            <text
              key={week}
              x={cx}
              y={WEEK_HEADER_H - 6}
              textAnchor="middle"
              fontSize={9}
              fontWeight={isCurrent ? 700 : 400}
              fill={isCurrent ? "#1C1B19" : "#9C988E"}
            >
              {week}
            </text>
          );
        })}

        {/* Rows */}
        {NODES.map((node, ni) => {
          const ry = WEEK_HEADER_H + ni * (CELL_H + GAP);

          return (
            <g key={node.id}>
              {/* Row label */}
              <text
                x={LABEL_W - 8}
                y={ry + CELL_H / 2 + 4}
                textAnchor="end"
                fontSize={10}
                fill="#6B6862"
              >
                {node.short}
              </text>

              {/* Cells */}
              {WEEKS.map((week, wi) => {
                const pct = getPct(week, node.id);
                const cx = LABEL_W + wi * (CELL_W + GAP);
                const isCurrent = week === CURRENT_WEEK;

                return (
                  <g key={week}>
                    <rect
                      x={cx}
                      y={ry}
                      width={CELL_W}
                      height={CELL_H}
                      rx={3}
                      fill={cellColor(pct)}
                      stroke={isCurrent ? "#1C1B19" : "transparent"}
                      strokeWidth={isCurrent ? 1.5 : 0}
                      strokeOpacity={0.25}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => {
                        const rect = (e.target as SVGRectElement).getBoundingClientRect();
                        const svgRect = (e.currentTarget as SVGRectElement)
                          .ownerSVGElement?.getBoundingClientRect();
                        if (svgRect) {
                          setTooltip({
                            x: rect.left - svgRect.left + CELL_W / 2,
                            y: rect.top - svgRect.top,
                            week,
                            skill: node.short,
                            pct,
                          });
                        }
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                    {pct >= 0.30 && (
                      <text
                        x={cx + CELL_W / 2}
                        y={ry + CELL_H / 2 + 3.5}
                        textAnchor="middle"
                        fontSize={8}
                        fill={textColor(pct)}
                        style={{ pointerEvents: "none" }}
                      >
                        {Math.round(pct * 100)}%
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-line bg-surface px-3 py-2 shadow-soft"
          style={{
            left: tooltip.x,
            top: tooltip.y - 52,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          <p className="text-[12px] font-medium text-ink">
            {tooltip.week} · {tooltip.skill}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            {tooltip.pct === 0
              ? "Not started yet"
              : `${Math.round(tooltip.pct * 100)}% of the class has this`}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {[
          { color: "#5E7C6A", label: "85%+ secure" },
          { color: "#C99A3F", label: "60–84%" },
          { color: "#37357A44", label: "30–59%" },
          { color: "#B25B4340", label: "Under 30%" },
          { color: "#ECEAE3", label: "Not started" },
        ].map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5 text-[11px] text-muted">
            <span
              className="inline-block size-2 rounded-sm border border-line"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
