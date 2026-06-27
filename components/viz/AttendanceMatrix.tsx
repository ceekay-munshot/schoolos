"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { attendanceMatrixData } from "@/data/viz-principal-extra";
import { cn } from "@/lib/utils";

const CELL = 54;
const LABEL_W = 80;
const LABEL_H = 32;
const W = LABEL_W + 5 * CELL;
const H = LABEL_H + 5 * CELL;

const maxCount = Math.max(...attendanceMatrixData.map((d) => d.count));

function cellBg(count: number): string {
  const t = count / maxCount;
  const r = Math.round(255 + t * (232 - 255));
  const g = Math.round(255 + t * (231 - 255));
  const b = Math.round(255 + t * (243 - 255));
  return `rgb(${r},${g},${b})`;
}

const X_LABELS = ["Low", "", "Mid", "", "High"];
const Y_LABELS = ["Fast", "", "Mid", "", "Slow"]; // vb=5 top → vb=1 bottom

const EASE = [0.22, 0.61, 0.36, 1] as const;

interface TooltipState {
  x: number;
  y: number;
  text: string;
}

export function AttendanceMatrix({ className }: { className?: string }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const cellMap = new Map(
    attendanceMatrixData.map((d) => [`${d.ab}-${d.vb}`, d.count]),
  );

  return (
    <div className={cn("relative w-full", className)}>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H + 20}`}
          width="100%"
          style={{ display: "block", minWidth: 320 }}
          aria-label="Attendance versus learning pace matrix"
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Y-axis label */}
          <text
            x={12}
            y={LABEL_H + (5 * CELL) / 2}
            textAnchor="middle"
            fontSize={10}
            className="fill-faint"
            transform={`rotate(-90, 12, ${LABEL_H + (5 * CELL) / 2})`}
          >
            ↑ Pace
          </text>

          {/* X-axis label */}
          <text
            x={LABEL_W + (5 * CELL) / 2}
            y={H + 16}
            textAnchor="middle"
            fontSize={10}
            className="fill-faint"
          >
            ← Attendance →
          </text>

          {/* Y-axis labels (vb=5 fast at top, vb=1 slow at bottom) */}
          {Y_LABELS.map((label, i) => {
            const cy = LABEL_H + i * CELL + CELL / 2;
            return (
              <text
                key={`ylabel-${i}`}
                x={LABEL_W - 8}
                y={cy + 4}
                textAnchor="end"
                fontSize={10}
                className="fill-faint"
              >
                {label}
              </text>
            );
          })}

          {/* X-axis labels (ab=1 left to ab=5 right) */}
          {X_LABELS.map((label, i) => {
            const cx = LABEL_W + i * CELL + CELL / 2;
            return (
              <text
                key={`xlabel-${i}`}
                x={cx}
                y={H + 4}
                textAnchor="middle"
                fontSize={10}
                className="fill-faint"
              >
                {label}
              </text>
            );
          })}

          {/* Cells: ab=1..5 (left→right), vb=5..1 (top→bottom) */}
          {Array.from({ length: 5 }, (_, abIdx) => {
            const ab = abIdx + 1;
            return Array.from({ length: 5 }, (_, vbIdx) => {
              const vb = 5 - vbIdx; // vb=5 at top row (vbIdx=0)
              const count = cellMap.get(`${ab}-${vb}`) ?? 0;
              const cellX = LABEL_W + abIdx * CELL;
              const cellY = LABEL_H + vbIdx * CELL;
              const bg = cellBg(count);
              const maxR = CELL / 2 - 6;
              const r = count > 0 ? Math.max(3, Math.sqrt(count / maxCount) * maxR) : 0;
              const cx = cellX + CELL / 2;
              const cy = cellY + CELL / 2;

              const abLabel = abIdx === 0 ? "Low" : abIdx === 4 ? "High" : `Band ${ab}`;
              const vbLabel = vb === 5 ? "Fast" : vb === 1 ? "Slow" : `Band ${vb}`;
              const tipText = `${count.toLocaleString()} children — ${abLabel} attendance, ${vbLabel} pace`;

              return (
                <motion.g
                  key={`${ab}-${vb}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.2,
                    ease: EASE,
                    delay: (abIdx + vbIdx) * 0.02,
                  }}
                  onMouseEnter={(e) => {
                    const svgRect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                    const svgW = svgRect.width;
                    const scale = svgW / W;
                    setTooltip({
                      x: cx * scale,
                      y: cy * scale,
                      text: tipText,
                    });
                  }}
                >
                  <rect
                    x={cellX + 1}
                    y={cellY + 1}
                    width={CELL - 2}
                    height={CELL - 2}
                    rx={4}
                    fill={bg}
                  />
                  {r > 0 && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill="#37357A"
                      fillOpacity={0.7}
                    />
                  )}
                </motion.g>
              );
            });
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12px] text-ink shadow-soft"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 30,
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
