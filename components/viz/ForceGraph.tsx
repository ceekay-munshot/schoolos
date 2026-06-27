"use client";
import { useMemo, useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  curriculumGraphNodes,
  curriculumGraphEdges,
  type CurriculumNode,
} from "@/data/viz-student-extra";
import { cn } from "@/lib/utils";

const W = 720;
const H = 440;
const NODE_R = 8;

const SUBJECT_COLOR: Record<string, string> = {
  maths:   "#37357A",
  english: "#5E7C6A",
  science: "#C99A3F",
  social:  "#8B67A4",
};

const STATUS_RING: Record<string, string> = {
  live:   "#5E7C6A",
  review: "#C99A3F",
  draft:  "#B8B4AB",
};

const STATUS_LABEL: Record<string, string> = {
  live:   "Live",
  review: "In review",
  draft:  "Draft",
};

const SUBJECT_LABEL: Record<string, string> = {
  maths:   "Maths",
  english: "English",
  science: "Science",
  social:  "Social Science",
};

type Vec2 = { x: number; y: number };

const SUBJECT_CENTER: Record<string, Vec2> = {
  maths:   { x: W * 0.25, y: H * 0.35 },
  english: { x: W * 0.75, y: H * 0.35 },
  science: { x: W * 0.25, y: H * 0.70 },
  social:  { x: W * 0.75, y: H * 0.70 },
};

function runForceLayout(
  nodes: CurriculumNode[],
  edges: typeof curriculumGraphEdges,
  iterations: number,
): Vec2[] {
  const n = nodes.length;

  // Start: cluster by subject (arrange subjects in quadrants)
  const pos: Vec2[] = nodes.map((node) => {
    const center = SUBJECT_CENTER[node.subject] ?? { x: W / 2, y: H / 2 };
    const subjectNodes = nodes.filter((x) => x.subject === node.subject);
    const idx = subjectNodes.indexOf(node);
    const count = subjectNodes.length;
    const angle = (idx / count) * 2 * Math.PI;
    const r = 60;
    return {
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle),
    };
  });

  const REPEL_K = 1200;
  const SPRING_K = 0.10;
  const GRAVITY_K = 0.03;
  const nodeIndex = new Map(nodes.map((nd, i) => [nd.id, i]));

  for (let iter = 0; iter < iterations; iter++) {
    const forces: Vec2[] = pos.map(() => ({ x: 0, y: 0 }));
    // Repulsion
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
    // Springs
    for (const edge of edges) {
      const i = nodeIndex.get(edge.from);
      const j = nodeIndex.get(edge.to);
      if (i === undefined || j === undefined) continue;
      const dx = pos[j].x - pos[i].x;
      const dy = pos[j].y - pos[i].y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const desiredDist = 90;
      const force = SPRING_K * (dist - desiredDist);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      forces[i].x += fx; forces[i].y += fy;
      forces[j].x -= fx; forces[j].y -= fy;
    }
    // Gravity toward subject centers
    for (let i = 0; i < n; i++) {
      const center = SUBJECT_CENTER[nodes[i].subject] ?? { x: W / 2, y: H / 2 };
      forces[i].x += (center.x - pos[i].x) * GRAVITY_K;
      forces[i].y += (center.y - pos[i].y) * GRAVITY_K;
    }
    // Apply
    for (let i = 0; i < n; i++) {
      pos[i].x = Math.max(
        NODE_R + 4,
        Math.min(W - NODE_R - 4, pos[i].x + forces[i].x * 0.5),
      );
      pos[i].y = Math.max(
        NODE_R + 4,
        Math.min(H - NODE_R - 4, pos[i].y + forces[i].y * 0.5),
      );
    }
  }
  return pos;
}

type Transform = { x: number; y: number; scale: number };

export function ForceGraph({ className }: { className?: string }) {
  const positions = useMemo(
    () => runForceLayout(curriculumGraphNodes, curriculumGraphEdges, 120),
    [],
  );

  const nodeIndex = useMemo(
    () => new Map(curriculumGraphNodes.map((nd, i) => [nd.id, i])),
    [],
  );

  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [activeNode, setActiveNode] = useState<CurriculumNode | null>(null);
  const [activePos, setActivePos] = useState<Vec2>({ x: 0, y: 0 });

  const isDragging = useRef(false);
  const lastMouse = useRef<Vec2>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      const newScale = Math.max(0.5, Math.min(3, transform.scale + e.deltaY * -0.001));
      setTransform((t) => ({ ...t, scale: newScale }));
    },
    [transform.scale],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGRectElement>) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
    },
    [],
  );

  const stopDrag = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleNodeClick = useCallback(
    (node: CurriculumNode, svgX: number, svgY: number) => {
      if (activeNode?.id === node.id) {
        setActiveNode(null);
        return;
      }
      setActiveNode(node);
      // Convert SVG coords to screen-relative coords within the container
      const screenX = svgX * transform.scale + transform.x;
      const screenY = svgY * transform.scale + transform.y;
      setActivePos({ x: screenX, y: screenY });
    },
    [activeNode, transform],
  );

  const handleZoomIn = useCallback(
    () => setTransform((t) => ({ ...t, scale: Math.min(3, t.scale + 0.25) })),
    [],
  );
  const handleZoomOut = useCallback(
    () => setTransform((t) => ({ ...t, scale: Math.max(0.5, t.scale - 0.25) })),
    [],
  );
  const handleReset = useCallback(
    () => setTransform({ x: 0, y: 0, scale: 1 }),
    [],
  );

  return (
    <div className={cn("relative", className)}>
      {/* Zoom controls */}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="grid size-8 place-items-center rounded-lg border border-line bg-white text-muted shadow-soft hover:text-ink"
          aria-label="Zoom in"
        >
          <span className="text-lg leading-none">+</span>
        </button>
        <button
          onClick={handleZoomOut}
          className="grid size-8 place-items-center rounded-lg border border-line bg-white text-muted shadow-soft hover:text-ink"
          aria-label="Zoom out"
        >
          <span className="text-lg leading-none">−</span>
        </button>
        <button
          onClick={handleReset}
          className="mt-0.5 rounded-lg border border-line bg-white px-1.5 py-1 text-[10px] font-medium text-muted shadow-soft hover:text-ink"
          aria-label="Reset view"
        >
          Reset
        </button>
      </div>

      {/* SVG graph */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{
          display: "block",
          cursor: isDragging.current ? "grabbing" : "grab",
          userSelect: "none",
          minHeight: 280,
        }}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <defs>
          <marker
            id="fg-arrow"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 6 3, 0 6" fill="#D9D6CE" />
          </marker>
        </defs>

        {/* Drag background */}
        <rect
          x={0}
          y={0}
          width={W}
          height={H}
          fill="transparent"
          onMouseDown={handleMouseDown}
        />

        <g
          transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}
        >
          {/* Subject area labels */}
          {Object.entries(SUBJECT_CENTER).map(([subject, center]) => (
            <text
              key={`area-${subject}`}
              x={center.x}
              y={center.y - 80}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill={SUBJECT_COLOR[subject]}
              fillOpacity={0.55}
              style={{ pointerEvents: "none" }}
            >
              {SUBJECT_LABEL[subject]}
            </text>
          ))}

          {/* Edges */}
          {curriculumGraphEdges.map((edge) => {
            const fromIdx = nodeIndex.get(edge.from);
            const toIdx = nodeIndex.get(edge.to);
            if (fromIdx === undefined || toIdx === undefined) return null;
            const from = positions[fromIdx];
            const to = positions[toIdx];
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const x1 = from.x + (dx / dist) * (NODE_R + 1);
            const y1 = from.y + (dy / dist) * (NODE_R + 1);
            const x2 = to.x - (dx / dist) * (NODE_R + 6);
            const y2 = to.y - (dy / dist) * (NODE_R + 6);
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#D9D6CE"
                strokeWidth={1}
                markerEnd="url(#fg-arrow)"
              />
            );
          })}

          {/* Nodes */}
          {curriculumGraphNodes.map((node, i) => {
            const pos = positions[i];
            const color = SUBJECT_COLOR[node.subject] ?? "#B8B4AB";
            const ringColor = STATUS_RING[node.status] ?? "#B8B4AB";
            const isActive = activeNode?.id === node.id;

            return (
              <g
                key={node.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleNodeClick(node, pos.x, pos.y)}
              >
                {/* Status ring */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_R + 3}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth={2}
                  strokeOpacity={node.status === "live" ? 0.7 : 0.4}
                />

                {/* Active halo */}
                {isActive && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={NODE_R + 7}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeOpacity={0.45}
                  />
                )}

                {/* Main circle */}
                <circle cx={pos.x} cy={pos.y} r={NODE_R} fill={color} />

                {/* Node label — only show if not too crowded */}
                <text
                  x={pos.x}
                  y={pos.y + NODE_R + 9}
                  textAnchor="middle"
                  fontSize={7}
                  fill="#6B6862"
                  style={{ pointerEvents: "none" }}
                >
                  {node.label.length > 14
                    ? node.label.slice(0, 13) + "…"
                    : node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Node popover */}
      {activeNode && (
        <div
          className="absolute z-20 w-52 rounded-xl border border-line bg-white p-3.5 shadow-lift"
          style={{
            left: Math.min(Math.max(activePos.x, 8), (svgRef.current?.clientWidth ?? W) - 216),
            top: Math.min(Math.max(activePos.y - 120, 8), (svgRef.current?.clientHeight ?? H) - 160),
          }}
        >
          <button
            className="absolute right-2 top-2 text-[11px] text-faint hover:text-ink"
            onClick={() => setActiveNode(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <p className="pr-5 text-[13px] font-semibold text-ink">
            {activeNode.label}
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-faint">
            {activeNode.grade}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: SUBJECT_COLOR[activeNode.subject] }}
            >
              {SUBJECT_LABEL[activeNode.subject]}
            </span>
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: STATUS_RING[activeNode.status] }}
            >
              {STATUS_LABEL[activeNode.status]}
            </span>
          </div>
          <Link
            href="/curriculum"
            className="mt-3 flex items-center gap-1 text-[12px] font-medium text-indigo hover:underline"
            onClick={() => setActiveNode(null)}
          >
            Open for editing →
          </Link>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line px-4 py-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-faint">
            Subject
          </span>
          {(["maths", "english", "science", "social"] as const).map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 text-[11px] text-muted"
            >
              <span
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: SUBJECT_COLOR[s] }}
              />
              {SUBJECT_LABEL[s]}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-faint">
            Status
          </span>
          {(["live", "review", "draft"] as const).map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 text-[11px] text-muted"
            >
              <span
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: STATUS_RING[s] }}
              />
              {STATUS_LABEL[s]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
