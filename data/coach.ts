import type { CoachNote, ReviewQueueItem } from "./types";

/* The Executive Coach owns the relationship no software can. Check-ins every 15
   days with student + parents; the coach adds the human truth the data can't
   see, and that context flows back as a first-class signal. */

export interface CheckIn {
  studentId: string;
  last: string;
  next: string;
  priority: "high" | "normal";
  prompt: string; // what this fortnight's check-in matters most for
}

export const checkInSchedule: CheckIn[] = [
  { studentId: "stu-riya", last: "2026-06-05", next: "2026-06-20", priority: "high", prompt: "Hold the art win; reframe the maths dip as one small fix." },
  { studentId: "stu-ishaan", last: "2026-06-04", next: "2026-06-19", priority: "high", prompt: "Check on the illness week and the rising gap-debt." },
  { studentId: "stu-reyansh", last: "2026-06-06", next: "2026-06-21", priority: "high", prompt: "Retention is slipping — agree a spaced-refresh plan." },
  { studentId: "stu-aarav", last: "2026-06-03", next: "2026-06-23", priority: "normal", prompt: "Celebrate the pace; line up real stretch." },
  { studentId: "stu-kabir", last: "2026-06-05", next: "2026-06-22", priority: "normal", prompt: "Builder momentum is strong; touch the equivalence group plan." },
  { studentId: "stu-ananya", last: "2026-06-02", next: "2026-06-24", priority: "normal", prompt: "Explorer depth is excellent — what's the next obsession?" },
  { studentId: "stu-diya", last: "2026-06-07", next: "2026-06-25", priority: "normal", prompt: "Confidence building; keep the pace gentle." },
  { studentId: "stu-saanvi", last: "2026-06-01", next: "2026-06-26", priority: "normal", prompt: "Feed the emergent Scholar spark." },
];

export const coachNotes: CoachNote[] = [
  {
    id: "cn-riya-0605",
    studentId: "stu-riya",
    coachId: "edu-rohan",
    date: "2026-06-05",
    context:
      "Riya's mother is a cardiologist on long night rotations this month, so home has been quieter and Riya's been leaning on her art. The maths dip isn't disengagement — it's a confidence wobble around one specific topic. The data couldn't have told me the rotation part; the mother did.",
    plan:
      "Hold the Artist momentum as the visible win. Frame the fractions work as 'one small fix, not behind.' Ms. Krishnan is pulling the equivalence group this week. Re-check accuracy at the next fortnight.",
    studentVoice: "I like the fraction wall better than the worksheet. Adding them still feels like a trick I forget.",
    parentVoice: "We were anxious she'd fallen behind in maths. Knowing it's one specific thing being worked on — and seeing her art bloom — that genuinely helps.",
  },
  {
    id: "cn-reyansh-0606",
    studentId: "stu-reyansh",
    coachId: "edu-rohan",
    date: "2026-06-06",
    context:
      "Reyansh is capable; this is a retention pattern, not a comprehension one. He moved house in April and his routine is still settling.",
    plan: "Agree a light spaced-refresh woven into self-work. No alarm to parents — frame it as upkeep, not a problem.",
    studentVoice: "I knew it before. It just slips out.",
    parentVoice: "The move was harder on him than we expected. We'll keep evenings steadier.",
  },
];

export const reviewQueue: ReviewQueueItem[] = [
  {
    id: "rq-1",
    kind: "low-confidence",
    studentId: "stu-ishaan",
    nodeId: "MATH.FRAC.EQUIV.01",
    summary: "Low-confidence scan — step 2 unreadable",
    detail:
      "Handwriting parse confidence 0.41 on Ishaan's worksheet, item 3. The machine can't tell a careless slip from a real misconception here, so it won't guess — your read decides.",
  },
  {
    id: "rq-2",
    kind: "judgment",
    studentId: "stu-aarav",
    nodeId: "ENG.WRITE.NARR.05",
    summary: "Judgment node — does the idea land?",
    detail:
      "Tense flips were auto-flagged (mechanical). Whether Aarav understood and carried the story is yours to decide — the tutor flags, it never scores thinking.",
  },
  {
    id: "rq-3",
    kind: "content",
    nodeId: "MATH.FRAC.EQUIV.01",
    summary: "Support worksheet awaiting approval",
    detail:
      "AI-differentiated support sheet for today's equivalence group. Nothing reaches a child unreviewed — approve, edit, or reject.",
  },
  {
    id: "rq-4",
    kind: "low-confidence",
    studentId: "stu-diya",
    nodeId: "MATH.FRAC.MEANING.02",
    summary: "Re-scan suggested",
    detail: "Two answer regions were left blank or scanned at an angle. Re-scan when convenient — no rush.",
  },
];

export function coachNotesForStudent(studentId: string) {
  return coachNotes.filter((n) => n.studentId === studentId).sort((a, b) => b.date.localeCompare(a.date));
}

export function checkInFor(studentId: string) {
  return checkInSchedule.find((c) => c.studentId === studentId);
}
