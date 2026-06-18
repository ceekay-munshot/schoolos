import type { Insight } from "./types";

/* System-generated insights. The coach/teacher never receives raw model output
   as truth — they curate it (status: raw → confirmed | dismissed), and the
   human annotation becomes a first-class signal downstream. */

export const insights: Insight[] = [
  {
    id: "ins-riya-1",
    scope: "coach",
    studentId: "stu-riya",
    text: "Worksheet accuracy fell 18% over three weeks — and the errors cluster entirely on items needing equivalent fractions, not on addition itself.",
    status: "confirmed",
    date: "2026-06-12",
    evidence: "9 of her last 11 errors trace to MATH.FRAC.EQUIV.01",
  },
  {
    id: "ins-riya-2",
    scope: "coach",
    studentId: "stu-riya",
    text: "Engagement in the Artist path is rising as maths confidence dips — she's leaning into where she feels capable.",
    status: "confirmed",
    date: "2026-06-12",
    evidence: "Artist standard 48 → 62 over the same three weeks",
  },
  {
    id: "ins-aarav-1",
    scope: "teacher",
    studentId: "stu-aarav",
    text: "Finishes maths self-work in roughly half the allotted time, every block. A clear candidate for the stretch band — needs depth, not more reps.",
    status: "raw",
    date: "2026-06-17",
    evidence: "Independent-work ratio 0.90; mastery velocity 2.7 vs 2.0 expected",
  },
  {
    id: "ins-aarav-2",
    scope: "teacher",
    studentId: "stu-aarav",
    text: "Tense flips recur in narrative writing — machine-caught and flagged. Whether the story's idea lands is left for you; the tutor will not score it.",
    status: "raw",
    date: "2026-06-16",
    evidence: "ENG.GRAM.TENSE.02 practising; ENG.WRITE.NARR.05 routed to review",
  },
  {
    id: "ins-reyansh-1",
    scope: "coach",
    studentId: "stu-reyansh",
    text: "Retention integrity slipped from 0.82 to 0.66 — older mastered nodes are fading on spaced recall. Suggest weaving refresh items into self-work.",
    status: "raw",
    date: "2026-06-15",
    evidence: "3 previously-mastered Number nodes failed their last recall check",
  },
  {
    id: "ins-ishaan-1",
    scope: "teacher",
    studentId: "stu-ishaan",
    text: "Flagged for low capture compliance this week.",
    status: "dismissed",
    date: "2026-06-15",
    evidence: "Coach note: absent Mon–Tue (viral fever) — not disengagement. Dismissed.",
  },
  {
    id: "ins-saanvi-1",
    scope: "teacher",
    studentId: "stu-saanvi",
    text: "Reached for a general rule on the 9× table unprompted — an emergent Scholar signal worth feeding her PATH coach.",
    status: "confirmed",
    date: "2026-06-13",
    evidence: "Self-work annotation + PATH artifact rated 5/5",
  },
];

export function insightsForStudent(studentId: string) {
  return insights.filter((i) => i.studentId === studentId);
}

export function insightsByScope(scope: Insight["scope"]) {
  return insights.filter((i) => i.scope === scope);
}
