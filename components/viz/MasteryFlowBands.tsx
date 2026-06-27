"use client";
import { motion } from "framer-motion";
import { masteryFlowData } from "@/data/viz-principal-extra";
import { cn } from "@/lib/utils";

const W = 560;
const H = 280;
const COL_W = 72;
const LEFT_X = 110;
const RIGHT_X = W - 110;
const PAD_Y = 36;
const BAR_HEIGHT = H - PAD_Y * 2;

const EASE = [0.22, 0.61, 0.36, 1] as const;

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function MasteryFlowBands({ className }: { className?: string }) {
  const { states, stateColors, termStart, termNow, flows } = masteryFlowData;

  const totalStart = termStart.reduce((a, b) => a + b, 0);
  const totalNow = termNow.reduce((a, b) => a + b, 0);

  // Compute cumulative y positions for each state in each column
  // Returns array of {y0, y1} for each state index
  function columnLayout(counts: number[], total: number, centerX: number) {
    let cumY = PAD_Y;
    return counts.map((count) => {
      const h = (count / total) * BAR_HEIGHT;
      const y0 = cumY;
      const y1 = cumY + h;
      cumY = y1;
      return { y0, y1, centerX };
    });
  }

  const leftLayout = columnLayout(termStart, totalStart, LEFT_X);
  const rightLayout = columnLayout(termNow, totalNow, RIGHT_X);

  const midX = (LEFT_X + COL_W / 2 + RIGHT_X - COL_W / 2) / 2;

  // Build flow band paths
  // Track offset within each state's bar for left & right columns
  const leftOffsets = termStart.map(() => 0);
  const rightOffsets = termNow.map(() => 0);

  interface FlowBand {
    path: string;
    color: string;
    from: number;
    to: number;
    n: number;
  }

  const bands: FlowBand[] = [];

  for (const flow of flows) {
    if (flow.n < 50) continue;
    const { from, to, n } = flow;

    const leftBar = leftLayout[from];
    const rightBar = rightLayout[to];
    const leftH = leftBar.y1 - leftBar.y0;
    const rightH = rightBar.y1 - rightBar.y0;

    const leftFrac = termStart[from] > 0 ? n / termStart[from] : 0;
    const rightFrac = termNow[to] > 0 ? n / termNow[to] : 0;

    const ly0 = leftBar.y0 + leftOffsets[from];
    const ly1 = ly0 + leftFrac * leftH;
    const ry0 = rightBar.y0 + rightOffsets[to];
    const ry1 = ry0 + rightFrac * rightH;

    leftOffsets[from] += leftFrac * leftH;
    rightOffsets[to] += rightFrac * rightH;

    const lx1 = LEFT_X + COL_W / 2;
    const rx0 = RIGHT_X - COL_W / 2;

    const path = [
      `M ${lx1} ${ly0}`,
      `C ${midX} ${ly0} ${midX} ${ry0} ${rx0} ${ry0}`,
      `L ${rx0} ${ry1}`,
      `C ${midX} ${ry1} ${midX} ${ly1} ${lx1} ${ly1}`,
      `Z`,
    ].join(" ");

    bands.push({ path, color: stateColors[from], from, to, n });
  }

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block" }}
        aria-label="Mastery state flow from April to June"
      >
        {/* Column headers */}
        <text x={LEFT_X} y={20} textAnchor="middle" fontSize={11} fontWeight={600} className="fill-muted">
          April 2026
        </text>
        <text x={RIGHT_X} y={20} textAnchor="middle" fontSize={11} fontWeight={600} className="fill-muted">
          June 2026
        </text>

        {/* Flow bands — drawn first, behind bars */}
        {bands.map((band, i) => (
          <motion.path
            key={`${band.from}-${band.to}-${i}`}
            d={band.path}
            fill={hexToRgba(band.color, 0.28)}
            stroke="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: EASE, delay: band.from * 0.1 }}
          />
        ))}

        {/* Left column bars */}
        {leftLayout.map((seg, i) => (
          <motion.rect
            key={`left-${i}`}
            x={LEFT_X - COL_W / 2}
            y={seg.y0}
            width={COL_W}
            height={Math.max(0, seg.y1 - seg.y0 - 1)}
            rx={3}
            fill={stateColors[i]}
            initial={{ opacity: 0, scaleY: 0.8 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.22, ease: EASE, delay: i * 0.05 }}
            style={{ transformOrigin: `${LEFT_X}px ${(seg.y0 + seg.y1) / 2}px` }}
          />
        ))}

        {/* Right column bars */}
        {rightLayout.map((seg, i) => (
          <motion.rect
            key={`right-${i}`}
            x={RIGHT_X - COL_W / 2}
            y={seg.y0}
            width={COL_W}
            height={Math.max(0, seg.y1 - seg.y0 - 1)}
            rx={3}
            fill={stateColors[i]}
            initial={{ opacity: 0, scaleY: 0.8 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.22, ease: EASE, delay: i * 0.05 }}
            style={{ transformOrigin: `${RIGHT_X}px ${(seg.y0 + seg.y1) / 2}px` }}
          />
        ))}

        {/* Left state labels */}
        {leftLayout.map((seg, i) => {
          const midY = (seg.y0 + seg.y1) / 2 + 4;
          const h = seg.y1 - seg.y0;
          if (h < 14) return null;
          return (
            <text
              key={`llabel-${i}`}
              x={LEFT_X - COL_W / 2 - 6}
              y={midY}
              textAnchor="end"
              fontSize={10}
              className="fill-muted"
            >
              {states[i]}
            </text>
          );
        })}

        {/* Right state labels */}
        {rightLayout.map((seg, i) => {
          const midY = (seg.y0 + seg.y1) / 2 + 4;
          const h = seg.y1 - seg.y0;
          if (h < 14) return null;
          return (
            <text
              key={`rlabel-${i}`}
              x={RIGHT_X + COL_W / 2 + 6}
              y={midY}
              textAnchor="start"
              fontSize={10}
              className="fill-muted"
            >
              {states[i]}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {states.map((label, i) => (
          <span key={label} className="inline-flex items-center gap-1.5 text-[11px] text-muted">
            <span
              className="inline-block size-2.5 rounded-sm"
              style={{ backgroundColor: stateColors[i] }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
