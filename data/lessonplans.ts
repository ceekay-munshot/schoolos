import type { LessonPlan, Worksheet } from "./types";
import { HERO_BLOCK_ID } from "./timetable";
import { ONE_MOVE_GROUP } from "./students";

export const worksheets: Worksheet[] = [
  {
    id: "ws-support",
    title: "Equivalent fractions — building from the wall",
    targetNodeIds: ["MATH.FRAC.EQUIV.01"],
    difficulty: "support",
    forStudentIds: ONE_MOVE_GROUP,
    includesSpacedReview: true, // a MEANING.02 number-line item, kept warm
    includesStretch: false,
    reviewStatus: "needs-review",
  },
  {
    id: "ws-core",
    title: "Equivalence into comparison",
    targetNodeIds: ["MATH.FRAC.EQUIV.01", "MATH.FRAC.COMPARE.02"],
    difficulty: "core",
    forStudentIds: [
      "stu-vihaan",
      "stu-myra",
      "stu-aditya",
      "stu-anvi",
      "stu-navya",
      "stu-kiaan",
      "stu-dhruv",
      "stu-pari",
      "stu-reyansh",
      "stu-tara",
    ],
    includesSpacedReview: true,
    includesStretch: false,
    reviewStatus: "approved",
  },
  {
    id: "ws-stretch",
    title: "Into addition & first word problems",
    targetNodeIds: ["MATH.FRAC.ADD.03", "MATH.FRAC.WORD.04"],
    difficulty: "stretch",
    forStudentIds: [
      "stu-aarav",
      "stu-saanvi",
      "stu-ananya",
      "stu-arjun",
      "stu-advait",
      "stu-zara",
      "stu-aisha",
      "stu-sara",
    ],
    includesSpacedReview: true,
    includesStretch: true,
    reviewStatus: "approved",
  },
];

export const heroLessonPlan: LessonPlan = {
  blockId: HERO_BLOCK_ID,
  generatedBy: "Made by Tomo AI · checked against the Class 5 fractions map",
  worksheetIds: ["ws-support", "ws-core", "ws-stretch"],
  oneMove: {
    headline: "Riya + 3 — stuck on equal fractions",
    studentIds: ONE_MOVE_GROUP,
    nodeId: "MATH.FRAC.EQUIV.01",
    why: "Four children are stuck on the same skill: equal fractions. For Riya, it's why she 'adds across' when adding fractions (2/3 + 1/4 → 3/7). Fix it here and the rest opens up. Pull these four to the fraction wall for about 12 minutes while everyone else does their own work.",
    everyoneElse: "Everyone else is set with their own work — including Aarav and Saanvi, who need a harder challenge, not help.",
  },
  sections: [
    {
      kind: "Instruction",
      minutes: 12,
      title: "Equivalent fractions on the fraction wall",
      detail: "Whole-class: show 1/2 = 2/4 = 3/6 by lining up the wall. Name the move — multiply top and bottom by the same number.",
      aiNote: "Kept to 12 minutes — under the 15-minute focus limit for this age.",
      decision: "accepted",
    },
    {
      kind: "1:1 Talk-buddy",
      minutes: 10,
      title: "Explain it to your partner",
      detail: "Pairs take turns explaining why 1/2 and 2/4 are the same amount, using the wall strips.",
      aiNote: "Pairs set so a confident child sits with one who's still practising.",
      decision: "accepted",
    },
    {
      kind: "Self-work",
      minutes: 25,
      title: "Worksheets matched to each child (3 levels)",
      detail: "Support, core and harder sheets, handed out by name. This is your window to pull the small group.",
      aiNote: "The AI made three levels from yesterday's work. The support sheet needs your okay before it goes out.",
      decision: "pending",
    },
    {
      kind: "Activity",
      minutes: 13,
      title: "Fraction-wall card game",
      detail: "Mixed pairs match equivalent-fraction cards against the wall. Movement-based, low-stakes.",
      aiNote: "Reuses last week's printed card set — no new materials needed.",
      decision: "accepted",
    },
  ],
};

export const lessonPlans: LessonPlan[] = [heroLessonPlan];

export function lessonPlanForBlock(blockId: string) {
  return lessonPlans.find((p) => p.blockId === blockId);
}

export function worksheetById(id: string) {
  return worksheets.find((w) => w.id === id);
}
