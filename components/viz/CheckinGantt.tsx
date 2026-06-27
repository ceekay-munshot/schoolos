"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ganttStudents } from "@/data/viz-coach-extra";
import { cn } from "@/lib/utils";

const ROW_H = 32;
const LABEL_W = 112;
const PAD_R = 16;
const AXIS_H = 28;
const CHART_W = 600;
const INNER_W = CHART_W - LABEL_W - PAD_R;
const CHART_H = ganttStudents.length * ROW_H + AXIS_H;

const START_MS = new Date("2026-04-01").getTime();
const END_MS = new Date("2026-08-01").getTime();
const TODAY_MS = new Date("2026-06-18").getTime();
const TOTAL_MS = END_MS - START_MS;

const MONTHS = [
  { label: "Apr", date: "2026-04-01" },
  { label: "May", date: "2026-05-01" },
  { label: "Jun", date: "2026-06-01" },
  { label: "Jul", date: "2026-07-01" },
  { label: "Aug", date: "2026-08-01" },
];

function dateToX(dateStr: string): number {
  const ms = new Date(dateStr).getTime();
  return LABEL_W + ((ms - START_MS) / TOTAL_MS) * INNER_W;
}

const todayX = LABEL_W + ((TODAY_MS - START_MS) / TOTAL_MS) * INNER_W;

function blockWidth(durationMin: number): number {
  // 25 min = 14px; floor at 12px
  const w = (durationMin / 25) * 14;
  return Math.max(12, w);
}

const GAP_THRESHOLD_MS = 28 * 24 * 60 * 60 * 1000; // 28 days

const EASE = [0.22, 0.61, 0.36, 1] as const;

interface TooltipState {
  x: number;
  y: number;
  text: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function CheckinGantt({ className }: { className?: string }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          width="100%"
          style={{ display: "block", minWidth: 480 }}
          aria-label="Check-in Gantt chart for caseload students"
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Month axis */}
          {MONTHS.map((m) => {
            const x = dateToX(m.date);
            return (
              <g key={m.label}>
                <line
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={CHART_H - AXIS_H}
                  stroke="#ECEAE3"
                  strokeWidth={1}
                />
                <text
                  x={x + 4}
                  y={CHART_H - AXIS_H + 16}
                  fontSize={10}
                  className="fill-faint"
                >
                  {m.label}
                </text>
              </g>
            );
          })}

          {/* Student rows */}
          {ganttStudents.map((student, rowIdx) => {
            const rowY = rowIdx * ROW_H;
            const isEven = rowIdx % 2 === 0;
            const sortedCheckins = [...student.checkins].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            );

            return (
              <g key={student.studentId}>
                {/* Row background */}
                <rect
                  x={0}
                  y={rowY}
                  width={CHART_W}
                  height={ROW_H}
                  fill={isEven ? "#FAF9F6" : "#F4F2EC"}
                  fillOpacity={0.8}
                />

                {/* Student name */}
                <text
                  x={6}
                  y={rowY + ROW_H / 2 + 4}
                  fontSize={11}
                  fontWeight={500}
                  className="fill-ink"
                >
                  {student.name}
                </text>

                {/* Gap highlights between consecutive check-ins */}
                {sortedCheckins.slice(0, -1).map((ci, i) => {
                  const next = sortedCheckins[i + 1];
                  const gapMs =
                    new Date(next.date).getTime() - new Date(ci.date).getTime();
                  if (gapMs <= GAP_THRESHOLD_MS) return null;
                  const x0 = dateToX(ci.date) + blockWidth(ci.durationMin);
                  const x1 = dateToX(next.date);
                  const lineY = rowY + ROW_H - 5;
                  return (
                    <line
                      key={`gap-${i}`}
                      x1={x0}
                      y1={lineY}
                      x2={x1}
                      y2={lineY}
                      stroke="#B25B43"
                      strokeWidth={2}
                      strokeDasharray="4 3"
                      strokeOpacity={0.7}
                    />
                  );
                })}

                {/* Check-in blocks */}
                {student.checkins.map((ci, ciIdx) => {
                  const x = dateToX(ci.date);
                  const bw = blockWidth(ci.durationMin);
                  const blockY = rowY + (ROW_H - 20) / 2;
                  const fill = ci.status === "done" ? "#37357A" : "#C99A3F";
                  const fillOpacity = ci.status === "done" ? 0.75 : 0.65;
                  const tipText =
                    ci.status === "done"
                      ? `${student.name} · ${ci.durationMin} min · ${formatDate(ci.date)}`
                      : `${student.name} · Upcoming · ${formatDate(ci.date)}`;

                  return (
                    <motion.rect
                      key={`ci-${ciIdx}`}
                      x={x}
                      y={blockY}
                      width={bw}
                      height={20}
                      rx={3}
                      fill={fill}
                      fillOpacity={fillOpacity}
                      initial={{ opacity: 0, scaleX: 0.5 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{
                        duration: 0.2,
                        ease: EASE,
                        delay: rowIdx * 0.04 + ciIdx * 0.03,
                      }}
                      style={{ transformOrigin: `${x}px ${blockY + 10}px` }}
                      onMouseEnter={(e) => {
                        const svgEl = (e.currentTarget as SVGRectElement).ownerSVGElement;
                        if (!svgEl) return;
                        const svgRect = svgEl.getBoundingClientRect();
                        const scale = svgRect.width / CHART_W;
                        setTooltip({
                          x: (x + bw / 2) * scale,
                          y: blockY * scale,
                          text: tipText,
                        });
                      }}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Today line */}
          <line
            x1={todayX}
            y1={0}
            x2={todayX}
            y2={CHART_H - AXIS_H}
            stroke="#37357A"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            strokeOpacity={0.9}
          />
          <text
            x={todayX + 4}
            y={10}
            fontSize={9}
            fontWeight={600}
            fill="#37357A"
          >
            Today
          </text>
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12px] text-ink shadow-soft"
          style={{
            left: tooltip.x + 8,
            top: tooltip.y - 32,
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-indigo opacity-75" />
          Done
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-practising opacity-65" />
          Upcoming
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
          <span className="mr-0.5 inline-block h-px w-5 border-b-2 border-dashed border-gap opacity-70" />
          Gap over 4 weeks
        </span>
      </div>
    </div>
  );
}
