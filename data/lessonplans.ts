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
  generatedBy: "Tomo AI · reviewed against the Class 5 Fractions map",
  worksheetIds: ["ws-support", "ws-core", "ws-stretch"],
  oneMove: {
    headline: "Riya + 3 — equivalent-fractions gap",
    studentIds: ONE_MOVE_GROUP,
    nodeId: "MATH.FRAC.EQUIV.01",
    why: "Four children share one broken node — MATH.FRAC.EQUIV.01, equivalent fractions. For Riya it's the root of the 'adds across' error in addition; repair it here and the downstream work unblocks. Pull these four to the fraction wall for ~12 minutes while the rest run their differentiated self-work.",
    everyoneElse: "Everyone else is set for independent self-work — including Aarav and Saanvi, who need stretch, not support.",
  },
  sections: [
    {
      kind: "Instruction",
      minutes: 12,
      title: "Equivalent fractions on the fraction wall",
      detail: "Whole-class: show 1/2 = 2/4 = 3/6 by lining up the wall. Name the move — multiply top and bottom by the same number.",
      aiNote: "Held to 12 minutes — under the 15-minute focus ceiling for this age.",
      decision: "accepted",
    },
    {
      kind: "1:1 Talk-buddy",
      minutes: 10,
      title: "Explain it to your partner",
      detail: "Pairs take turns explaining why 1/2 and 2/4 are the same amount, using the wall strips.",
      aiNote: "Pairs balanced so a secure child sits with a practising one.",
      decision: "accepted",
    },
    {
      kind: "Self-work",
      minutes: 25,
      title: "Differentiated worksheets (3 bands)",
      detail: "Support, core and stretch sheets distributed by name. This is your window for the one small-group pull.",
      aiNote: "AI differentiated three bands from yesterday's submissions. The support band needs your review before it goes out.",
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
