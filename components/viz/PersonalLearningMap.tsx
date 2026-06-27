"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type SkillGraph } from "@/data/viz-student-extra";
import { cn } from "@/lib/utils";

const STATUS_COLOR: Record<string, string> = {
  mastered:         "#5E7C6A",
  retained:         "#5E7C6A",
  practising:       "#C99A3F",
  gap:              "#B25B43",
  introduced:       "#8B88C4",
  "not-introduced": "#B8B4AB",
};

const STATUS_LABEL: Record<string, string> = {
  mastered:         "Mastered",
  retained:         "Mastered",
  practising:       "Practising",
  gap:              "Gap",
  introduced:       "Introduced",
  "not-introduced": "Not yet started",
};

const W = 400;
const H = 280;
const CX = W / 2;
const CY = H / 2;
const NODE_R = 22;

type NodePos = { x: number; y: number };

// Spring force simulation — deterministic, no Math.random
function runForceLayout(graph: SkillGraph, iterations: number): NodePos[] {
  const n = graph.nodes.length;
  // Initial: circle layout
  const pos: NodePos[] = graph.nodes.map((_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const r = Math.min(W, H) * 0.30;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  });

  const REPEL_K = 1800;
  const SPRING_K = 0.12;
  const GRAVITY_K = 0.04;

  for (let iter = 0; iter < iterations; iter++) {
    const forces: NodePos[] = pos.map(() => ({ x: 0, y: 0 }));
    // Repulsion between all node pairs
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pos[i].x - pos[j].x;
        const dy = pos[i].y - pos[j].y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = REPEL_K / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        forces[i].x += fx; forces[i].y += fy;
        forces[j].x -= fx; forces[j].y -= fy;
      }
    }
    // Spring attraction along edges
    const nodeIndex = new Map(graph.nodes.map((nd, i) => [nd.id, i]));
    for (const edge of graph.edges) {
      const i = nodeIndex.get(edge.from);
      const j = nodeIndex.get(edge.to);
      if (i === undefined || j === undefined) continue;
      const dx = pos[j].x - pos[i].x;
      const dy = pos[j].y - pos[i].y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const desiredDist = 110;
      const force = SPRING_K * (dist - desiredDist);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      forces[i].x += fx; forces[i].y += fy;
      forces[j].x -= fx; forces[j].y -= fy;
    }
    // Gravity toward center
    for (let i = 0; i < n; i++) {
      forces[i].x += (CX - pos[i].x) * GRAVITY_K;
      forces[i].y += (CY - pos[i].y) * GRAVITY_K;
    }
    // Apply forces
    for (let i = 0; i < n; i++) {
      pos[i].x = Math.max(NODE_R + 4, Math.min(W - NODE_R - 4, pos[i].x + forces[i].x * 0.5));
      pos[i].y = Math.max(NODE_R + 4, Math.min(H - NODE_R - 4, pos[i].y + forces[i].y * 0.5));
    }
  }
  return pos;
}

type ActiveNode = { id: string; x: number; y: number };

export function PersonalLearningMap({
  graph,
  className,
}: {
  graph: SkillGraph;
  className?: string;
}) {
  const [activeNode, setActiveNode] = useState<ActiveNode | null>(null);

  // Compute positions synchronously — deterministic
  const positions = useMemo(() => runForceLayout(graph, 80), [graph]);

  const nodeIndex = useMemo(
    () => new Map(graph.nodes.map((nd, i) => [nd.id, i])),
    [graph],
  );

  const activeNodeData = activeNode
    ? graph.nodes.find((n) => n.id === activeNode.id) ?? null
    : null;

  return (
    <div className={cn("relative select-none", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <marker
            id="plm-arrow"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 7 3.5, 0 7" fill="#ECEAE3" />
          </marker>
        </defs>

        {/* Edges */}
        {graph.edges.map((edge) => {
          const fromIdx = nodeIndex.get(edge.from);
          const toIdx = nodeIndex.get(edge.to);
          if (fromIdx === undefined || toIdx === undefined) return null;
          const from = positions[fromIdx];
          const to = positions[toIdx];

          // Shorten the line so it ends at the node border
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const x1 = from.x + (dx / dist) * (NODE_R + 2);
          const y1 = from.y + (dy / dist) * (NODE_R + 2);
          const x2 = to.x - (dx / dist) * (NODE_R + 8);
          const y2 = to.y - (dy / dist) * (NODE_R + 8);

          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#ECEAE3"
              strokeWidth={1.5}
              markerEnd="url(#plm-arrow)"
            />
          );
        })}

        {/* Nodes */}
        {graph.nodes.map((node, i) => {
          const pos = positions[i];
          const color = STATUS_COLOR[node.status] ?? "#B8B4AB";
          const isActive = activeNode?.id === node.id;

          return (
            <g
              key={node.id}
              style={{ cursor: "pointer" }}
              onClick={() =>
                setActiveNode(
                  isActive ? null : { id: node.id, x: pos.x, y: pos.y },
                )
              }
            >
              {/* Glow/decoration ring */}
              {node.status === "mastered" ? (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_R + 5}
                  fill={color}
                  fillOpacity={0.18}
                />
              ) : node.status === "gap" ? (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_R + 5}
                  fill="none"
                  stroke="#B25B43"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
              ) : null}

              {/* Active ring */}
              {isActive && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_R + 7}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeOpacity={0.5}
                />
              )}

              {/* Main node circle */}
              <circle cx={pos.x} cy={pos.y} r={NODE_R} fill={color} />

              {/* Label */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={8.5}
                fontWeight={500}
                fill="white"
                fillOpacity={0.95}
                style={{ pointerEvents: "none" }}
              >
                {node.label.length > 12
                  ? node.label.slice(0, 11) + "…"
                  : node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {activeNode && activeNodeData && (
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute z-50 w-56 rounded-xl border border-line bg-white p-3.5 shadow-lift"
            style={{
              // Map SVG coords to percentage-based position
              left: `${Math.min(
                Math.max((activeNode.x / W) * 100, 10),
                62,
              )}%`,
              top: `${Math.min(
                Math.max((activeNode.y / H) * 100, 5),
                70,
              )}%`,
            }}
          >
            <button
              className="absolute right-2 top-2 text-faint hover:text-ink"
              onClick={() => setActiveNode(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <p className="pr-5 text-[13px] font-semibold text-ink">
              {activeNodeData.label}
            </p>
            <span
              className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
              style={{ backgroundColor: STATUS_COLOR[activeNodeData.status] }}
            >
              {STATUS_LABEL[activeNodeData.status]}
            </span>
            {activeNodeData.evidence && (
              <p className="mt-2 text-[12px] leading-snug text-muted">
                {activeNodeData.evidence}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {(
          [
            { status: "mastered", label: "Mastered" },
            { status: "gap", label: "Gap" },
            { status: "introduced", label: "Introduced" },
            { status: "not-introduced", label: "Not yet" },
          ] as const
        ).map(({ status, label }) => (
          <span
            key={status}
            className="inline-flex items-center gap-1.5 text-[11px] text-muted"
          >
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: STATUS_COLOR[status] }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
