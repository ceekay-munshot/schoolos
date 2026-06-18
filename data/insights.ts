import type { Insight } from "./types";

/* System-generated insights. The coach/teacher never receives raw model output
   as truth — they curate it (status: raw → confirmed | dismissed), and the
   human annotation becomes a first-class signal downstream. */

export const insights: Insight[] = [
  {
    id: "ins-riya-1",
    scope: "coach",
    studentId: "stu-riya",
    text: "Her scores have slipped over the last three weeks. The mistakes are all about equal fractions — not about adding.",
    status: "confirmed",
    date: "2026-06-12",
    evidence: "9 of her last 11 mistakes are about equal fractions.",
  },
  {
    id: "ins-riya-2",
    scope: "coach",
    studentId: "stu-riya",
    text: "She's leaning into art as maths feels harder right now — going where she feels good.",
    status: "confirmed",
    date: "2026-06-12",
    evidence: "Her art work has clearly grown over the same three weeks.",
  },
  {
    id: "ins-aarav-1",
    scope: "teacher",
    studentId: "stu-aarav",
    text: "Finishes his maths in about half the time, every lesson. He's ready for harder work, not more of the same.",
    status: "raw",
    date: "2026-06-17",
    evidence: "Works on his own 90% of the time, and learns faster than expected for his grade.",
  },
  {
    id: "ins-aarav-2",
    scope: "teacher",
    studentId: "stu-aarav",
    text: "His writing keeps switching between past and present. The computer caught the grammar; whether the story itself is good is your call.",
    status: "raw",
    date: "2026-06-16",
    evidence: "Grammar flagged; the story idea was sent to you, never graded by the computer.",
  },
  {
    id: "ins-reyansh-1",
    scope: "coach",
    studentId: "stu-reyansh",
    text: "Things he'd learnt are slipping. Older topics fade when we check again later. A little regular review would help.",
    status: "raw",
    date: "2026-06-15",
    evidence: "3 topics he'd got down slipped on the last check.",
  },
  {
    id: "ins-ishaan-1",
    scope: "teacher",
    studentId: "stu-ishaan",
    text: "Flagged for not enough work scanned this week.",
    status: "dismissed",
    date: "2026-06-15",
    evidence: "Coach note: off sick Mon–Tue, not avoiding work. Set aside.",
  },
  {
    id: "ins-saanvi-1",
    scope: "teacher",
    studentId: "stu-saanvi",
    text: "Spotted a pattern in the 9× table on her own — an early sign of a real Scholar. Worth telling her PATH coach.",
    status: "confirmed",
    date: "2026-06-13",
    evidence: "Her own note, plus a top-rated PATH project.",
  },
];

export function insightsForStudent(studentId: string) {
  return insights.filter((i) => i.studentId === studentId);
}

export function insightsByScope(scope: Insight["scope"]) {
  return insights.filter((i) => i.scope === scope);
}
