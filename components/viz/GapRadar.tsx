"use client";

import { useState } from "react";
import { radarNodes } from "@/data/viz-teacher-extra";

const CX = 130;
const CY = 130;
const MAX_R = 95;
const N = 5; // number of axes

// Compute x,y for a given axis index and radius
function point(i: number, r: number): { x: number; y: number } {
  const angle = (i * 2 * Math.PI) / N - Math.PI / 2;
  return {
    x: CX + r * Math.cos(angle),
    y: CY + r * Math.sin(angle),
  };
}

function polygonPath(values: number[]): string {
  return values
    .map((v, i) => {
      const { x, y } = point(i, v * MAX_R);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ") + " Z";
}

// Label position: slightly outside the max ring
function labelPoint(i: number): { x: number; y: number } {
  const { x, y } = point(i, MAX_R + 18);
  return { x, y };
}

// Value label position: inside the class polygon, at 80% of that node's value
function valueLabelPoint(i: number, pct: number): { x: number; y: number } {
  return point(i, pct * MAX_R * 0.72);
}

const SVG_W = 280;
const SVG_H = 280;

export function GapRadar({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const classValues = radarNodes.map((n) => n.classPct);
  const expectedValues = radarNodes.map((n) => n.expectedPct);

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ display: "block", maxWidth: SVG_W, overflow: "visible" }}
      >
        {/* Background rings */}
        {[1, 2, 3].map((ring) => {
          const r = (ring / 3) * MAX_R;
          const ringPath = Array.from({ length: N }, (_, i) => {
            const { x, y } = point(i, r);
            return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
          }).join(" ") + " Z";
          return (
            <path
              key={ring}
              d={ringPath}
              fill="none"
              stroke="#ECEAE3"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
          );
        })}

        {/* Axis lines from center to tip */}
        {Array.from({ length: N }, (_, i) => {
          const { x, y } = point(i, MAX_R);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={x.toFixed(2)}
              y2={y.toFixed(2)}
              stroke="#ECEAE3"
              strokeWidth={1}
            />
          );
        })}

        {/* Expected polygon (dashed indigo, no fill) */}
        <path
          d={polygonPath(expectedValues)}
          fill="none"
          stroke="#37357A"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          strokeOpacity={0.55}
        />

        {/* Class polygon (sage fill + stroke) */}
        <path
          d={polygonPath(classValues)}
          fill="#5E7C6A"
          fillOpacity={0.18}
          stroke="#5E7C6A"
          strokeWidth={2}
        />

        {/* Vertex dots on class polygon */}
        {radarNodes.map((node, i) => {
          const { x, y } = point(i, node.classPct * MAX_R);
          return (
            <circle
              key={node.nodeId}
              cx={x}
              cy={y}
              r={hovered === i ? 5 : 4}
              fill="#5E7C6A"
              stroke="#FAF9F6"
              strokeWidth={1.5}
              style={{ cursor: "pointer", transition: "r 0.15s" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}

        {/* Axis tip labels */}
        {radarNodes.map((node, i) => {
          const lp = labelPoint(i);
          // Anchor depending on quadrant
          let anchor: "middle" | "start" | "end" = "middle";
          const angle = (i * 2 * Math.PI) / N - Math.PI / 2;
          const cosA = Math.cos(angle);
          if (cosA > 0.2) anchor = "start";
          else if (cosA < -0.2) anchor = "end";

          return (
            <text
              key={node.nodeId}
              x={lp.x.toFixed(2)}
              y={lp.y.toFixed(2)}
              textAnchor={anchor}
              fontSize={9}
              fill={hovered === i ? "#1C1B19" : "#6B6862"}
              fontWeight={hovered === i ? 600 : 400}
              style={{ transition: "fill 0.15s" }}
            >
              {node.label}
            </text>
          );
        })}

        {/* Value labels inside polygon */}
        {radarNodes.map((node, i) => {
          const vp = valueLabelPoint(i, node.classPct);
          if (node.classPct < 0.18) return null;
          return (
            <text
              key={`val-${node.nodeId}`}
              x={vp.x.toFixed(2)}
              y={(vp.y + 3.5).toFixed(2)}
              textAnchor="middle"
              fontSize={8.5}
              fill="#3A5A47"
              fontWeight={600}
            >
              {Math.round(node.classPct * 100)}%
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-2 text-[11px] text-muted">
          <svg width={20} height={10}>
            <line x1={0} y1={5} x2={20} y2={5} stroke="#5E7C6A" strokeWidth={2} />
          </svg>
          Class today
        </span>
        <span className="inline-flex items-center gap-2 text-[11px] text-muted">
          <svg width={20} height={10}>
            <line
              x1={0}
              y1={5}
              x2={20}
              y2={5}
              stroke="#37357A"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              strokeOpacity={0.65}
            />
          </svg>
          Where they should be
        </span>
      </div>
    </div>
  );
}
