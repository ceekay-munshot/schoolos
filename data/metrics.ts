import type { BenchmarkResult, SeriesPoint } from "./types";
import { students } from "./students";

/* L4 — leading metrics. Every number here is one that moves BEFORE the board
   exam and predicts it. The report card is the lagging output, never shown as
   the instrument. */

export const schoolHealth = {
  comprehensionRate: 0.84, // school-wide, leading
  retentionIntegrity: 0.87,
  independentWorkRatio: 0.81, // the "calm room" signal
  tutorUtilisation: 0.78, // MS/HS
  captureCompliance: 0.94, // worksheets scanned — if this lapses the engine goes blind
  teacherActionFollowThrough: 0.89, // are recommended one-moves being run
  parentEngagement: 0.86,
};

/** Mastery velocity by cohort (nodes/week vs grade-expected). */
export const velocityByCohort: { label: string; value: number; expected: number }[] = [
  { label: "Class 3", value: 1.9, expected: 1.7 },
  { label: "Class 4", value: 2.0, expected: 1.8 },
  { label: "Class 5", value: 2.1, expected: 2.0 },
  { label: "Class 6", value: 2.3, expected: 2.2 },
  { label: "Class 7", value: 2.2, expected: 2.2 },
  { label: "Class 8", value: 2.4, expected: 2.3 },
];

/** Grade-level gap-debt trend over 8 weeks (lower is better — it's improving). */
export const gapDebtTrend: SeriesPoint[] = [
  { label: "W1", value: 4.8 },
  { label: "W2", value: 4.6 },
  { label: "W3", value: 4.7 },
  { label: "W4", value: 4.2 },
  { label: "W5", value: 3.9 },
  { label: "W6", value: 3.6 },
  { label: "W7", value: 3.3 },
  { label: "W8", value: 3.1 },
];

/** School mastery velocity trend over the same window (rising). */
export const velocityTrend: SeriesPoint[] = [
  { label: "W1", value: 1.8 },
  { label: "W2", value: 1.9 },
  { label: "W3", value: 1.9 },
  { label: "W4", value: 2.0 },
  { label: "W5", value: 2.05 },
  { label: "W6", value: 2.1 },
  { label: "W7", value: 2.12 },
  { label: "W8", value: 2.15 },
];

export const retentionTrend: SeriesPoint[] = [
  { label: "W1", value: 0.82 },
  { label: "W2", value: 0.83 },
  { label: "W3", value: 0.84 },
  { label: "W4", value: 0.85 },
  { label: "W5", value: 0.85 },
  { label: "W6", value: 0.86 },
  { label: "W7", value: 0.865 },
  { label: "W8", value: 0.87 },
];

/* The moat-proof: leading-metric prediction vs the eventual ACER outcome.
   The tight correlation is the deliberately-generated evidence (premortem P5). */
export const benchmarks: BenchmarkResult[] = [
  { cohort: "Class 5 · 2025", term: "Term 1", predicted: 72, actual: 70 },
  { cohort: "Class 5 · 2025", term: "Term 2", predicted: 78, actual: 79 },
  { cohort: "Class 6 · 2025", term: "Term 1", predicted: 75, actual: 74 },
  { cohort: "Class 6 · 2025", term: "Term 2", predicted: 81, actual: 83 },
  { cohort: "Class 7 · 2025", term: "Term 1", predicted: 69, actual: 68 },
  { cohort: "Class 8 · 2025", term: "Term 2", predicted: 85, actual: 84 },
];

/** Children accumulating gap-debt that will surface as failures — and attrition
    — months from now. The early-warning the report card can't give. */
export function earlyWarning() {
  return students
    .filter((s) => s.gapDebt >= 2 || s.retentionIntegrity < 0.72)
    .map((s) => ({
      student: s,
      risk: s.gapDebt >= 3 || s.retentionIntegrity < 0.7 ? "elevated" : "watch",
      reason:
        s.retentionIntegrity < 0.72
          ? "Retention slipping on previously-mastered nodes"
          : "Unresolved prerequisite gaps below grade level",
    }))
    .sort((a, b) => b.student.gapDebt - a.student.gapDebt);
}

/* Parent month-on-month: real capability growth, not marks. Riya's is authored
   to be honest — a recent plateau, with the gap being worked named openly. */
const GROWTH: Record<string, SeriesPoint[]> = {
  "stu-riya": [
    { label: "Jan", value: 8 },
    { label: "Feb", value: 11 },
    { label: "Mar", value: 14 },
    { label: "Apr", value: 16 },
    { label: "May", value: 17 },
    { label: "Jun", value: 17 },
  ],
};

export function growthFor(studentId: string): SeriesPoint[] {
  if (GROWTH[studentId]) return GROWTH[studentId];
  const s = students.find((x) => x.id === studentId);
  const base = s ? Math.round(s.masteryVelocity * 4) : 10;
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((label, i) => ({
    label,
    value: base + i * Math.max(1, Math.round(s ? s.masteryVelocity : 2)),
  }));
}
