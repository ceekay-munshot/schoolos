"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { type TreeNode, gapTreemapRoot } from "@/data/viz-principal-extra";
import { cn } from "@/lib/utils";

type Rect = { x: number; y: number; w: number; h: number };

interface LayoutItem {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
  label: string;
  value: number;
}

function sliceDice(
  items: { value: number; id: string; label: string }[],
  rect: Rect,
): LayoutItem[] {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((s, i) => s + i.value, 0);
  const out: LayoutItem[] = [];
  let { x, y, w, h } = rect;
  const horizontal = w >= h;
  for (const item of sorted) {
    const frac = total > 0 ? item.value / total : 0;
    out.push({
      x,
      y,
      w: horizontal ? frac * w : w,
      h: horizontal ? h : frac * h,
      id: item.id,
      label: item.label,
      value: item.value,
    });
    if (horizontal) x += frac * w;
    else y += frac * h;
  }
  return out;
}

function gapColor(count: number, maxCount: number): string {
  const t = Math.min(1, maxCount > 0 ? count / maxCount : 0);
  const r = Math.round(244 + t * (178 - 244));
  const g = Math.round(242 + t * (91 - 242));
  const b = Math.round(236 + t * (67 - 236));
  return `rgb(${r},${g},${b})`;
}

function isDarkBg(t: number): boolean {
  return t > 0.45;
}

const SVG_W = 600;
const SVG_H = 320;
const GAP = 3;

export function GapTreemap({ className }: { className?: string }) {
  const [drilled, setDrilled] = useState<TreeNode | null>(null);

  const root = gapTreemapRoot;
  const displayNode = drilled ?? root;
  const children = displayNode.children ?? [];
  const maxCount = Math.max(...children.map((c) => c.gapCount), 1);

  const items = children.map((c) => ({
    id: c.id,
    label: c.label,
    value: c.gapCount,
  }));

  const layout = sliceDice(items, {
    x: GAP,
    y: drilled ? 28 : GAP,
    w: SVG_W - GAP * 2,
    h: SVG_H - (drilled ? 28 : GAP) - GAP,
  });

  const childMap = new Map(children.map((c) => [c.id, c]));

  const EASE = [0.22, 0.61, 0.36, 1] as const;

  return (
    <div className={cn("w-full", className)}>
      {drilled && (
        <button
          onClick={() => setDrilled(null)}
          className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1 text-[12px] font-medium text-muted transition-colors hover:bg-sand hover:text-ink"
        >
          ← Back to all grades
        </button>
      )}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ display: "block" }}
        aria-label={drilled ? `${drilled.label} subject breakdown` : "School-wide gap treemap by grade"}
      >
        {drilled && (
          <text
            x={GAP + 2}
            y={20}
            fontSize={12}
            fontWeight={600}
            className="fill-ink"
          >
            {drilled.label} — {drilled.gapCount} gaps across subjects
          </text>
        )}
        {layout.map((cell, i) => {
          const node = childMap.get(cell.id)!;
          const t = maxCount > 0 ? node.gapCount / maxCount : 0;
          const bg = gapColor(node.gapCount, maxCount);
          const dark = isDarkBg(t);
          const hasChildren = (node.children?.length ?? 0) > 0;
          const innerW = cell.w - GAP * 2;
          const innerH = cell.h - GAP * 2;
          const cx = cell.x + cell.w / 2;
          const cy = cell.y + cell.h / 2;
          const showLabel = innerW > 42 && innerH > 28;
          const showCount = innerH > 44;

          return (
            <motion.g
              key={cell.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: EASE, delay: i * 0.04 }}
              onClick={() => {
                if (hasChildren) setDrilled(node);
              }}
              style={{ cursor: hasChildren ? "pointer" : "default" }}
              role={hasChildren ? "button" : undefined}
              aria-label={hasChildren ? `Drill into ${node.label}` : undefined}
            >
              <rect
                x={cell.x + GAP}
                y={cell.y + GAP}
                width={Math.max(0, innerW)}
                height={Math.max(0, innerH)}
                rx={6}
                fill={bg}
                stroke={dark ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.06)"}
                strokeWidth={1}
              />
              {showLabel && (
                <text
                  x={cx}
                  y={showCount ? cy - 8 : cy + 5}
                  textAnchor="middle"
                  fontSize={Math.min(13, Math.max(9, innerW / 8))}
                  fontWeight={600}
                  fill={dark ? "#FFFFFF" : "#1C1B19"}
                >
                  {node.label}
                </text>
              )}
              {showCount && showLabel && (
                <text
                  x={cx}
                  y={cy + 10}
                  textAnchor="middle"
                  fontSize={Math.min(11, Math.max(8, innerW / 10))}
                  fill={dark ? "rgba(255,255,255,0.8)" : "#6B6862"}
                >
                  {node.gapCount} gaps
                </text>
              )}
              {hasChildren && showLabel && (
                <text
                  x={cell.x + cell.w - GAP - 7}
                  y={cell.y + GAP + 14}
                  textAnchor="end"
                  fontSize={9}
                  fill={dark ? "rgba(255,255,255,0.6)" : "#9C988E"}
                >
                  ▸
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
