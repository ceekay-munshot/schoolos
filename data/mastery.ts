import type { MasteryState, MasteryStatus, GapCluster } from "./types";
import { heroClassStudents, studentById } from "./students";
import { nodeById } from "./competency";

/** The displayed Fractions progression, in prerequisite order. */
export const FRACTION_PATH = [
  "MATH.FRAC.MEANING.01",
  "MATH.FRAC.MEANING.02",
  "MATH.FRAC.EQUIV.01",
  "MATH.FRAC.COMPARE.02",
  "MATH.FRAC.ADD.03",
  "MATH.FRAC.WORD.04",
];

const EVIDENCE: Record<MasteryStatus, string> = {
  retained: "Still correct on a spaced-recall item weeks later",
  mastered: "Independent, correct, and explained the why",
  practising: "Mostly right; method still wobbles under new numbers",
  introduced: "Seen it once, not yet doing it alone",
  "not-introduced": "Not started — prerequisites not yet in place",
  gap: "A prerequisite is broken; downstream work is failing because of it",
  faded: "Was secure; recent recall is slipping",
};

function st(
  studentId: string,
  nodeId: string,
  status: MasteryStatus,
  confidence: number,
): MasteryState {
  return { studentId, nodeId, status, confidence, lastEvidence: EVIDENCE[status] };
}

/* ---- explicit, story-carrying mastery ---- */
const EXPLICIT: Record<string, MasteryState[]> = {
  "stu-riya": [
    st("stu-riya", "MATH.FRAC.MEANING.01", "retained", 0.93),
    st("stu-riya", "MATH.FRAC.MEANING.02", "mastered", 0.9),
    st("stu-riya", "MATH.FRAC.EQUIV.01", "gap", 0.86),
    st("stu-riya", "MATH.FRAC.COMPARE.02", "introduced", 0.4),
    {
      studentId: "stu-riya",
      nodeId: "MATH.FRAC.ADD.03",
      status: "practising",
      confidence: 0.35,
      lastEvidence: "Adds across (2/3 + 1/4 = 3/7) — the error traces to equivalence, not addition",
    },
    st("stu-riya", "MATH.FRAC.WORD.04", "not-introduced", 0.1),
  ],
  "stu-kabir": [
    st("stu-kabir", "MATH.FRAC.MEANING.01", "retained", 0.9),
    st("stu-kabir", "MATH.FRAC.MEANING.02", "mastered", 0.88),
    st("stu-kabir", "MATH.FRAC.EQUIV.01", "gap", 0.8),
    st("stu-kabir", "MATH.FRAC.COMPARE.02", "introduced", 0.42),
    st("stu-kabir", "MATH.FRAC.ADD.03", "introduced", 0.3),
    st("stu-kabir", "MATH.FRAC.WORD.04", "not-introduced", 0.1),
  ],
  "stu-diya": [
    st("stu-diya", "MATH.FRAC.MEANING.01", "retained", 0.9),
    st("stu-diya", "MATH.FRAC.MEANING.02", "mastered", 0.85),
    st("stu-diya", "MATH.FRAC.EQUIV.01", "gap", 0.82),
    st("stu-diya", "MATH.FRAC.COMPARE.02", "not-introduced", 0.2),
    st("stu-diya", "MATH.FRAC.ADD.03", "not-introduced", 0.12),
    st("stu-diya", "MATH.FRAC.WORD.04", "not-introduced", 0.08),
  ],
  "stu-ishaan": [
    st("stu-ishaan", "MATH.FRAC.MEANING.01", "mastered", 0.86),
    st("stu-ishaan", "MATH.FRAC.MEANING.02", "practising", 0.6),
    st("stu-ishaan", "MATH.FRAC.EQUIV.01", "gap", 0.84),
    st("stu-ishaan", "MATH.FRAC.COMPARE.02", "not-introduced", 0.18),
    st("stu-ishaan", "MATH.FRAC.ADD.03", "not-introduced", 0.1),
    st("stu-ishaan", "MATH.FRAC.WORD.04", "not-introduced", 0.06),
  ],
  "stu-aarav": [
    st("stu-aarav", "MATH.FRAC.MEANING.01", "retained", 0.97),
    st("stu-aarav", "MATH.FRAC.MEANING.02", "retained", 0.95),
    st("stu-aarav", "MATH.FRAC.EQUIV.01", "mastered", 0.95),
    st("stu-aarav", "MATH.FRAC.COMPARE.02", "mastered", 0.93),
    st("stu-aarav", "MATH.FRAC.ADD.03", "mastered", 0.9),
    st("stu-aarav", "MATH.FRAC.WORD.04", "practising", 0.72),
    // the judgment split, on the English side
    {
      studentId: "stu-aarav",
      nodeId: "ENG.GRAM.TENSE.02",
      status: "practising",
      confidence: 0.55,
      lastEvidence: "Tense flips mid-paragraph — machine-caught, flagged for the teacher",
    },
    {
      studentId: "stu-aarav",
      nodeId: "ENG.WRITE.NARR.05",
      status: "introduced",
      confidence: 0.5,
      lastEvidence: "Whether the idea lands is a teacher call — routed to the review queue, never scored by the machine",
    },
  ],
  "stu-saanvi": [
    st("stu-saanvi", "MATH.FRAC.MEANING.01", "retained", 0.98),
    st("stu-saanvi", "MATH.FRAC.MEANING.02", "retained", 0.96),
    st("stu-saanvi", "MATH.FRAC.EQUIV.01", "mastered", 0.96),
    st("stu-saanvi", "MATH.FRAC.COMPARE.02", "mastered", 0.94),
    st("stu-saanvi", "MATH.FRAC.ADD.03", "mastered", 0.92),
    st("stu-saanvi", "MATH.FRAC.WORD.04", "mastered", 0.88),
  ],
};

/** Deterministic, believable progression for everyone else from their metrics. */
function generate(studentId: string): MasteryState[] {
  const s = studentById(studentId);
  if (!s) return [];
  const v = s.masteryVelocity;
  let frontier = 5;
  if (v >= 2.4) frontier = 5;
  else if (v >= 2.0) frontier = 4;
  else if (v >= 1.7) frontier = 3;
  else frontier = 2;

  return FRACTION_PATH.map((nodeId, i) => {
    let status: MasteryStatus;
    if (i < frontier - 1) status = "retained";
    else if (i === frontier - 1) status = "mastered";
    else if (i === frontier) status = "practising";
    else if (i === frontier + 1) status = "introduced";
    else status = "not-introduced";

    // a child carrying a little gap-debt has one node fading
    if (s.gapDebt >= 1 && i === Math.max(0, frontier - 2)) status = "faded";

    const conf =
      status === "retained" || status === "mastered"
        ? 0.85 + (i % 3) * 0.03
        : status === "practising"
          ? 0.62 + (i % 2) * 0.05
          : status === "faded"
            ? 0.5
            : status === "introduced"
              ? 0.4
              : 0.12;
    return st(studentId, nodeId, status, conf);
  });
}

const cache = new Map<string, MasteryState[]>();

export function masteryFor(studentId: string): MasteryState[] {
  if (cache.has(studentId)) return cache.get(studentId)!;
  const states = EXPLICIT[studentId] ?? generate(studentId);
  cache.set(studentId, states);
  return states;
}

export function masteryAt(studentId: string, nodeId: string) {
  return masteryFor(studentId).find((m) => m.nodeId === nodeId);
}

/** Where do children share a broken node? → the teacher's "one group" candidates. */
export function gapClusters(): GapCluster[] {
  const byNode = new Map<string, string[]>();
  for (const s of heroClassStudents) {
    for (const m of masteryFor(s.id)) {
      if (m.status === "gap") {
        const arr = byNode.get(m.nodeId) ?? [];
        arr.push(s.id);
        byNode.set(m.nodeId, arr);
      }
    }
  }
  return [...byNode.entries()]
    .map(([nodeId, studentIds]) => ({
      nodeId,
      label: nodeById(nodeId)?.statement ?? nodeId,
      studentIds,
    }))
    .sort((a, b) => b.studentIds.length - a.studentIds.length);
}

/** Distribution of the hero class across the fractions map (for the class-health bar). */
export function classDistribution() {
  const counts: Record<MasteryStatus, number> = {
    retained: 0,
    mastered: 0,
    practising: 0,
    introduced: 0,
    "not-introduced": 0,
    gap: 0,
    faded: 0,
  };
  for (const s of heroClassStudents) {
    // a child's "headline" status = their frontier node status
    const states = masteryFor(s.id);
    const frontier =
      states.find((m) => m.status === "gap") ??
      states.find((m) => m.status === "practising") ??
      states.find((m) => m.status === "faded") ??
      states[states.length - 1];
    if (frontier) counts[frontier.status]++;
  }
  return counts;
}
