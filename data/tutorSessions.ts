import type { TutorSession } from "./types";

/* Middle & High only (rule #3). Every tutor turn is a capture event feeding
   L2/L3. The tutor is guard-railed to the just-taught competency and defers to
   the teacher on judgment territory. Mahira Qureshi (Class 6) is the Student OS. */

export const tutorSessions: TutorSession[] = [
  {
    id: "ts-mahira-1",
    studentId: "stu-mahira",
    subjectId: "maths",
    topic: "Fraction word problems",
    nodeId: "MATH.FRAC.WORD.04",
    date: "2026-06-17",
    turns: 14,
    minutes: 18,
    stuckPoint: "Translating 'three-quarters of 12 laddoos' into a calculation",
    unlockedBy: "A bar-model hint — split 12 into 4 equal parts, then take 3",
  },
  {
    id: "ts-mahira-2",
    studentId: "stu-mahira",
    subjectId: "maths",
    topic: "Comparing unlike fractions",
    nodeId: "MATH.FRAC.COMPARE.02",
    date: "2026-06-16",
    turns: 9,
    minutes: 12,
    stuckPoint: "Whether to use a common denominator or cross-multiply",
    unlockedBy: "A worked example, then she chose the method herself next time",
  },
  {
    id: "ts-mahira-3",
    studentId: "stu-mahira",
    subjectId: "english",
    topic: "Is my story's ending strong?",
    nodeId: "ENG.WRITE.NARR.05",
    date: "2026-06-15",
    turns: 4,
    minutes: 6,
    stuckPoint: "Wants feedback on whether the ending lands",
    unlockedBy: "Tutor cleared the mechanical clutter only",
    flaggedForTeacher: "Whether the idea lands is a teacher call — flagged for review, never scored by the tutor.",
  },
  {
    id: "ts-ayaan-1",
    studentId: "stu-ayaan",
    subjectId: "maths",
    topic: "Ratios from equivalent fractions",
    nodeId: "MATH.FRAC.EQUIV.01",
    date: "2026-06-17",
    turns: 11,
    minutes: 15,
    stuckPoint: "Scaling a recipe up by a fraction for his garden-sensor build",
    unlockedBy: "Connected it to the equivalence rule he already knew",
  },
  {
    id: "ts-shaurya-1",
    studentId: "stu-shaurya",
    subjectId: "maths",
    topic: "Adding unlike fractions",
    nodeId: "MATH.FRAC.ADD.03",
    date: "2026-06-16",
    turns: 16,
    minutes: 22,
    stuckPoint: "Kept adding denominators — the classic 'straight across' error",
    unlockedBy: "Hint to find a common denominator first; two more reps to secure it",
    flaggedForTeacher: "Recurring 'adds across' pattern over two weeks — worth a teacher check.",
  },
];

export function tutorSessionsByStudent(studentId: string) {
  return tutorSessions.filter((t) => t.studentId === studentId);
}
