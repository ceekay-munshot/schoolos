import type { Confidence, FreshnessState, EvidenceItem } from "./types";
import { ONE_MOVE_GROUP, heroClassStudents } from "./students";
import { HERO_BLOCK_ID } from "./timetable";

/* Block-prep grouping (Design Brief §5.4): the room split for the hero block.
   Teacher group = the one move; everyone else has a prepared task. */
export interface BlockGrouping {
  teacherGroup: string[];
  independentGroup: string[];
  extensionGroup: string[];
  observe: string[];
}

export const heroGrouping: BlockGrouping = {
  teacherGroup: ONE_MOVE_GROUP, // Riya, Kabir, Diya, Ishaan — equivalent-fractions gap
  extensionGroup: ["stu-aarav", "stu-saanvi", "stu-ananya", "stu-arjun"],
  observe: ["stu-reyansh"], // retention slipping after a house move
  independentGroup: heroClassStudents
    .map((s) => s.id)
    .filter(
      (id) =>
        !ONE_MOVE_GROUP.includes(id) &&
        !["stu-aarav", "stu-saanvi", "stu-ananya", "stu-arjun", "stu-reyansh"].includes(id),
    ),
};

/* Reason, evidence, confidence and freshness behind the one move (§5.4). */
export const heroMoveMeta: {
  blockId: string;
  confidence: Confidence;
  freshness: FreshnessState;
  dataNote: string;
  evidence: EvidenceItem[];
  fallback: string;
} = {
  blockId: HERO_BLOCK_ID,
  confidence: "high",
  freshness: "today",
  dataNote: "Made from yesterday's scanned worksheets for all 22 children.",
  evidence: [
    {
      kind: "worksheet",
      label: "Riya — Fractions, sheet 14",
      detail: "9 of her 11 recent mistakes come from equivalent fractions, not adding.",
      date: "2026-06-17",
    },
    {
      kind: "worksheet",
      label: "Kabir & Diya — unlike denominators",
      detail: "Both 'added across' (2/3 + 1/4 → 3/7). They're skipping the equivalence step.",
      date: "2026-06-17",
    },
    {
      kind: "assessment",
      label: "Class 5 fractions check-point",
      detail: "Four children are stuck on the same skill (MATH.FRAC.EQUIV.01).",
      date: "2026-06-16",
    },
    {
      kind: "teacher-note",
      label: "Ms. Krishnan",
      detail: "Ishaan was away Mon–Tue. His gap may just be missed time, not a real mix-up.",
      date: "2026-06-16",
    },
  ],
  fallback:
    "If yesterday's scans are incomplete or the system is offline, the block opens with the standard Class 5 equivalence plan, or yesterday's plan, unchanged.",
};

/* Today screen prep status (§5.2). */
export type PrepStatus = "ready" | "review" | "not-ready";
export interface TodayPrep {
  blockId: string;
  status: PrepStatus;
  note: string;
}
export const todayPrep: TodayPrep[] = [
  { blockId: HERO_BLOCK_ID, status: "review", note: "Plan ready · one support worksheet needs your okay" },
  { blockId: "blk-thu-1015", status: "ready", note: "Plan and materials ready" },
  { blockId: "blk-thu-1300", status: "ready", note: "Workshop set up · last week's work loaded" },
];

/* Classes overview (Brief sitemap: Classes). */
export interface ClassRow {
  klass: string;
  subject: string;
  students: number;
  sharedGap: string;
  pace: string;
}
export const teacherClasses: ClassRow[] = [
  { klass: "Class 5 · Kaveri", subject: "Mathematics", students: 22, sharedGap: "Equivalent fractions (4 children)", pace: "On pace" },
  { klass: "Class 5 · Ganga", subject: "Mathematics", students: 24, sharedGap: "Place value to 10,000 (3 children)", pace: "Slightly ahead" },
  { klass: "Class 4 · Kaveri", subject: "Mathematics", students: 21, sharedGap: "Multiplication facts (5 children)", pace: "On pace" },
];

export const TEACHER_FALLBACK_NOTE =
  "Capture, marking and today's plan run on the campus device and work with no internet. Anything unavailable falls back to the standard or previous plan; nothing a teacher needs at 9 a.m. depends on the cloud.";
