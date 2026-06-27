// Seed data for teacher health page visualisations.
// No "use client" — plain TypeScript, imported by both server and client components.

// 12 weeks × 6 fraction nodes: fraction of class who have mastered by that week.
// Story: MEANING nodes go high early; EQUIV and beyond show the class gap.
export const skillWeekData: { week: string; nodeId: string; pct: number }[] = [
  // MATH.FRAC.MEANING.01 — mastered early, stays high
  { week: "W1",  nodeId: "MATH.FRAC.MEANING.01", pct: 0.55 },
  { week: "W2",  nodeId: "MATH.FRAC.MEANING.01", pct: 0.72 },
  { week: "W3",  nodeId: "MATH.FRAC.MEANING.01", pct: 0.84 },
  { week: "W4",  nodeId: "MATH.FRAC.MEANING.01", pct: 0.91 },
  { week: "W5",  nodeId: "MATH.FRAC.MEANING.01", pct: 0.91 },
  { week: "W6",  nodeId: "MATH.FRAC.MEANING.01", pct: 0.93 },
  { week: "W7",  nodeId: "MATH.FRAC.MEANING.01", pct: 0.93 },
  { week: "W8",  nodeId: "MATH.FRAC.MEANING.01", pct: 0.94 },
  { week: "W9",  nodeId: "MATH.FRAC.MEANING.01", pct: 0.94 },
  { week: "W10", nodeId: "MATH.FRAC.MEANING.01", pct: 0.95 },
  { week: "W11", nodeId: "MATH.FRAC.MEANING.01", pct: 0.95 },
  { week: "W12", nodeId: "MATH.FRAC.MEANING.01", pct: 0.95 },

  // MATH.FRAC.MEANING.02 — solid but slightly behind MEANING.01
  { week: "W1",  nodeId: "MATH.FRAC.MEANING.02", pct: 0.18 },
  { week: "W2",  nodeId: "MATH.FRAC.MEANING.02", pct: 0.38 },
  { week: "W3",  nodeId: "MATH.FRAC.MEANING.02", pct: 0.55 },
  { week: "W4",  nodeId: "MATH.FRAC.MEANING.02", pct: 0.68 },
  { week: "W5",  nodeId: "MATH.FRAC.MEANING.02", pct: 0.74 },
  { week: "W6",  nodeId: "MATH.FRAC.MEANING.02", pct: 0.78 },
  { week: "W7",  nodeId: "MATH.FRAC.MEANING.02", pct: 0.80 },
  { week: "W8",  nodeId: "MATH.FRAC.MEANING.02", pct: 0.81 },
  { week: "W9",  nodeId: "MATH.FRAC.MEANING.02", pct: 0.82 },
  { week: "W10", nodeId: "MATH.FRAC.MEANING.02", pct: 0.82 },
  { week: "W11", nodeId: "MATH.FRAC.MEANING.02", pct: 0.82 },
  { week: "W12", nodeId: "MATH.FRAC.MEANING.02", pct: 0.82 },

  // MATH.FRAC.EQUIV.01 — the gap node: slow climb, plateaus low
  { week: "W1",  nodeId: "MATH.FRAC.EQUIV.01", pct: 0.00 },
  { week: "W2",  nodeId: "MATH.FRAC.EQUIV.01", pct: 0.05 },
  { week: "W3",  nodeId: "MATH.FRAC.EQUIV.01", pct: 0.12 },
  { week: "W4",  nodeId: "MATH.FRAC.EQUIV.01", pct: 0.20 },
  { week: "W5",  nodeId: "MATH.FRAC.EQUIV.01", pct: 0.28 },
  { week: "W6",  nodeId: "MATH.FRAC.EQUIV.01", pct: 0.34 },
  { week: "W7",  nodeId: "MATH.FRAC.EQUIV.01", pct: 0.40 },
  { week: "W8",  nodeId: "MATH.FRAC.EQUIV.01", pct: 0.44 },
  { week: "W9",  nodeId: "MATH.FRAC.EQUIV.01", pct: 0.47 },
  { week: "W10", nodeId: "MATH.FRAC.EQUIV.01", pct: 0.50 },
  { week: "W11", nodeId: "MATH.FRAC.EQUIV.01", pct: 0.52 },
  { week: "W12", nodeId: "MATH.FRAC.EQUIV.01", pct: 0.54 },

  // MATH.FRAC.COMPARE.02 — introduced later, stalled at EQUIV gap
  { week: "W1",  nodeId: "MATH.FRAC.COMPARE.02", pct: 0.00 },
  { week: "W2",  nodeId: "MATH.FRAC.COMPARE.02", pct: 0.00 },
  { week: "W3",  nodeId: "MATH.FRAC.COMPARE.02", pct: 0.00 },
  { week: "W4",  nodeId: "MATH.FRAC.COMPARE.02", pct: 0.05 },
  { week: "W5",  nodeId: "MATH.FRAC.COMPARE.02", pct: 0.12 },
  { week: "W6",  nodeId: "MATH.FRAC.COMPARE.02", pct: 0.20 },
  { week: "W7",  nodeId: "MATH.FRAC.COMPARE.02", pct: 0.28 },
  { week: "W8",  nodeId: "MATH.FRAC.COMPARE.02", pct: 0.34 },
  { week: "W9",  nodeId: "MATH.FRAC.COMPARE.02", pct: 0.40 },
  { week: "W10", nodeId: "MATH.FRAC.COMPARE.02", pct: 0.44 },
  { week: "W11", nodeId: "MATH.FRAC.COMPARE.02", pct: 0.46 },
  { week: "W12", nodeId: "MATH.FRAC.COMPARE.02", pct: 0.48 },

  // MATH.FRAC.ADD.03 — started late; only the fast group has it
  { week: "W1",  nodeId: "MATH.FRAC.ADD.03", pct: 0.00 },
  { week: "W2",  nodeId: "MATH.FRAC.ADD.03", pct: 0.00 },
  { week: "W3",  nodeId: "MATH.FRAC.ADD.03", pct: 0.00 },
  { week: "W4",  nodeId: "MATH.FRAC.ADD.03", pct: 0.00 },
  { week: "W5",  nodeId: "MATH.FRAC.ADD.03", pct: 0.00 },
  { week: "W6",  nodeId: "MATH.FRAC.ADD.03", pct: 0.05 },
  { week: "W7",  nodeId: "MATH.FRAC.ADD.03", pct: 0.10 },
  { week: "W8",  nodeId: "MATH.FRAC.ADD.03", pct: 0.16 },
  { week: "W9",  nodeId: "MATH.FRAC.ADD.03", pct: 0.22 },
  { week: "W10", nodeId: "MATH.FRAC.ADD.03", pct: 0.26 },
  { week: "W11", nodeId: "MATH.FRAC.ADD.03", pct: 0.29 },
  { week: "W12", nodeId: "MATH.FRAC.ADD.03", pct: 0.31 },

  // MATH.FRAC.WORD.04 — not yet introduced to the class
  { week: "W1",  nodeId: "MATH.FRAC.WORD.04", pct: 0.00 },
  { week: "W2",  nodeId: "MATH.FRAC.WORD.04", pct: 0.00 },
  { week: "W3",  nodeId: "MATH.FRAC.WORD.04", pct: 0.00 },
  { week: "W4",  nodeId: "MATH.FRAC.WORD.04", pct: 0.00 },
  { week: "W5",  nodeId: "MATH.FRAC.WORD.04", pct: 0.00 },
  { week: "W6",  nodeId: "MATH.FRAC.WORD.04", pct: 0.00 },
  { week: "W7",  nodeId: "MATH.FRAC.WORD.04", pct: 0.00 },
  { week: "W8",  nodeId: "MATH.FRAC.WORD.04", pct: 0.00 },
  { week: "W9",  nodeId: "MATH.FRAC.WORD.04", pct: 0.00 },
  { week: "W10", nodeId: "MATH.FRAC.WORD.04", pct: 0.00 },
  { week: "W11", nodeId: "MATH.FRAC.WORD.04", pct: 0.00 },
  { week: "W12", nodeId: "MATH.FRAC.WORD.04", pct: 0.00 },
];

// Radar chart data — 5 nodes (WORD.04 excluded, not started yet).
// classPct = class average mastery today; expectedPct = where they should be at week 12.
export const radarNodes: {
  nodeId: string;
  label: string;
  classPct: number;
  expectedPct: number;
}[] = [
  { nodeId: "MATH.FRAC.MEANING.01", label: "Meaning",         classPct: 0.91, expectedPct: 0.90 },
  { nodeId: "MATH.FRAC.MEANING.02", label: "Number line",     classPct: 0.82, expectedPct: 0.85 },
  { nodeId: "MATH.FRAC.EQUIV.01",   label: "Equal fractions", classPct: 0.54, expectedPct: 0.75 },
  { nodeId: "MATH.FRAC.COMPARE.02", label: "Compare",         classPct: 0.48, expectedPct: 0.70 },
  { nodeId: "MATH.FRAC.ADD.03",     label: "Add fractions",   classPct: 0.31, expectedPct: 0.55 },
];
