import type { PathKey } from "@/data";
import { tutorSessionsByStudent, nodeById } from "@/data";

/* ============================================================================
   Student OS — Mahira Qureshi (stu-mahira, Class 6 · Yamuna)
   The data behind her five tabs: Today · Learn · Practice · Projects · Reflection.

   The AI tutor lives INSIDE Learn and Practice. It supports the topic just
   taught — fraction word problems (MATH.FRAC.WORD.04), unlocked in class by a
   bar model. It asks guiding questions, never hands over answers, and defers
   anything that needs a teacher's judgment. Grounded in her tutor sessions.
   ========================================================================== */

const STUDENT_ID = "stu-mahira";

/* The just-taught topic, read off her most recent maths tutor session so the
   whole surface stays anchored to one node. */
const wordSession = tutorSessionsByStudent(STUDENT_ID).find(
  (t) => t.nodeId === "MATH.FRAC.WORD.04",
);

export const todayTopic = {
  nodeId: "MATH.FRAC.WORD.04",
  title: wordSession?.topic ?? "Fraction word problems",
  statement:
    nodeById("MATH.FRAC.WORD.04")?.statement ??
    "Solve word problems involving fractions of a quantity",
  taughtBy: "Ms. Lakshmi Krishnan",
  taughtWhen: "this morning's Maths block",
  /** Whether a tutor-supported self-work session is planned today. */
  selfWorkPlanned: true,
  selfWorkWindow: "Self-work block · 2:10 pm",
  todo: "Three more fraction-of-a-quantity problems — draw the bar model each time before you touch the numbers.",
};

/* ---------------------------------------------------------------------------
   LEARN — the tutor retells the just-taught concept one more way, then opens
   with guiding questions. One concept, calm. No graph, no answers given.
   ------------------------------------------------------------------------- */
export interface LearnModule {
  nodeId: string;
  topic: string;
  /** A one-breath restatement of what was taught in class. */
  recap: string;
  /** The tutor's alternative explanation — a different angle on the same idea. */
  retellTitle: string;
  retell: string[];
  /** A deliberately smaller, friendlier example to build footing. */
  simplerExample: {
    prompt: string;
    walkthrough: string[];
    answer: string;
  };
  /** 2–3 guiding questions — the tutor asks, the student thinks. */
  guidingQuestions: string[];
  /** The plain-language move the whole topic reduces to. */
  theMove: string;
}

export const learnModule: LearnModule = {
  nodeId: "MATH.FRAC.WORD.04",
  topic: "Fraction word problems",
  recap:
    "In class today you turned word problems into bar models — drawing the whole first, then splitting it. Here is the same idea from a slightly different angle.",
  retellTitle: "Think of the fraction as an instruction, not a number",
  retell: [
    "A fraction in a word problem is really a two-step instruction hiding in plain sight.",
    "The bottom number (the denominator) says: cut the whole into this many equal pieces.",
    "The top number (the numerator) says: now take this many of those pieces. That is all “three-quarters of something” is asking you to do.",
  ],
  simplerExample: {
    prompt: "Start small: what is one-half of 8 pencils?",
    walkthrough: [
      "Bottom number is 2 — so cut 8 pencils into 2 equal groups. Each group has 4.",
      "Top number is 1 — so take 1 of those groups.",
    ],
    answer: "Half of 8 is 4. Once the picture is clear, bigger numbers work exactly the same way.",
  },
  guidingQuestions: [
    "In “three-quarters of 12 laddoos,” which number tells you how many equal pieces to cut, and which tells you how many to take?",
    "Before doing any sums — what is the whole here, and how many equal parts should it become?",
    "If you split 12 into 4 equal parts, how many laddoos sit in each part?",
  ],
  theMove:
    "Bar first. Split by the bottom number. Take the top number. The same three steps work every single time.",
};

/* ---------------------------------------------------------------------------
   PRACTICE — adaptive, one question at a time, with a hint ladder and a
   progress state. Grounded in her bar-model unlock. The third item triggers
   the escalation-to-teacher moment after repeated difficulty.
   ------------------------------------------------------------------------- */
export type ProgressState =
  | "practising"
  | "nearly-secure"
  | "mastered"
  | "needs-teacher";

export const progressStateMeta: Record<
  ProgressState,
  { label: string; tone: "practising" | "mastered" | "gap" }
> = {
  practising: { label: "Practising", tone: "practising" },
  "nearly-secure": { label: "Nearly secure", tone: "practising" },
  mastered: { label: "Mastered", tone: "mastered" },
  "needs-teacher": { label: "Needs teacher support", tone: "gap" },
};

export interface PracticeItem {
  id: string;
  nodeId: string;
  /** The question, posed one at a time. */
  question: string;
  /** What the student tried (the most recent attempt shown in the thread). */
  attempt?: string;
  /** The hint ladder — each rung a gentler nudge, never the answer. */
  hints: string[];
  /** The answer, kept aside — the tutor only confirms once the student arrives. */
  answer: string;
  state: ProgressState;
  /** Set on an item that has crossed the difficulty / judgment line. */
  escalation?: string;
}

export const practiceItems: PracticeItem[] = [
  {
    id: "pr-1",
    nodeId: "MATH.FRAC.WORD.04",
    question:
      "Three-quarters of the 12 laddoos in the box have been eaten. How many laddoos is that?",
    attempt: "I drew a bar for 12 and split it into 4 parts — 3 in each part. So 3 × 3 = 9.",
    hints: [
      "Draw one bar for all 12 laddoos first — don't reach for the numbers yet.",
      "The bottom number, 4, tells you how many equal parts to split the bar into.",
      "How many laddoos sit in each of those 4 equal parts?",
      "Now the top number, 3, says take 3 of those parts. Add them up.",
    ],
    answer: "9 laddoos — three of the four equal parts of 12.",
    state: "nearly-secure",
  },
  {
    id: "pr-2",
    nodeId: "MATH.FRAC.WORD.04",
    question:
      "A jug holds 20 glasses of nimbu paani. Two-fifths are poured out for the class. How many glasses is that?",
    attempt: "Bar of 20, split into 5 parts — 4 each. Take 2 parts → 8 glasses.",
    hints: [
      "Same move as the laddoos. What is the whole, and how many equal parts?",
      "Split 20 into 5 equal parts — how many in each part?",
      "Two-fifths means take 2 of those parts.",
    ],
    answer: "8 glasses — two of the five equal parts of 20.",
    state: "mastered",
  },
  {
    id: "pr-3",
    nodeId: "MATH.FRAC.WORD.04",
    question:
      "A shopkeeper sold five-sixths of a 48 kg sack of rice before noon. How many kilograms were sold?",
    attempt: "I tried 48 ÷ 5… then 48 × 6… then I split it into 6 but couldn't see which parts to take.",
    hints: [
      "The denominator is 6 — so this time the bar splits into 6 equal parts, not 5.",
      "What is 48 shared equally into 6 parts?",
      "Five-sixths means take 5 of those 6 equal parts — leave just one behind.",
    ],
    answer: "40 kg — five of the six equal parts of 48 (only one 8 kg part is left).",
    state: "needs-teacher",
    escalation:
      "You have tried three different approaches on this one. I have shared exactly where you are stuck — choosing how many parts to split into — with Ms. Krishnan, so she can help you during the next block. Let's pause here; you have done good thinking.",
  },
];

/* ---------------------------------------------------------------------------
   PROJECTS — her Builder/Scholar territory. A real brief with milestones, a
   rubric with anchored exemplars, mentor feedback, and her own reflection.
   The tutor's support is bounded (a research scaffold) and it defers the one
   question that is a teacher's call.
   ------------------------------------------------------------------------- */
export interface Milestone {
  label: string;
  done: boolean;
  detail: string;
}

export interface RubricLevel {
  level: string; // "Emerging" | "Developing" | "Secure" | "Distinctive"
  descriptor: string;
  /** An anchored exemplar — what work at this level actually looks like. */
  exemplar: string;
  current?: boolean; // where her work sits right now
}

export interface ProjectArtifact {
  label: string;
  meta: string;
  uploaded: boolean;
}

export interface StudentProject {
  id: string;
  path: PathKey;
  pathLabel: string;
  title: string;
  brief: string;
  driving: string; // the driving question
  mentor: { name: string; title: string };
  group: string;
  milestones: Milestone[];
  artifacts: ProjectArtifact[];
  rubric: RubricLevel[];
  mentorFeedback: { date: string; text: string };
  /** The tutor's bounded help offer + the judgment it explicitly hands back. */
  tutorSupport: { offer: string; defers: string };
  studentReflection: string;
}

export const project: StudentProject = {
  id: "proj-mahira-1",
  path: "scholar",
  pathLabel: "Scholar · olympiad track",
  title: "The Fraction Around You",
  brief:
    "Find fractions hiding in everyday life at home and around school, then turn three of them into clear word problems with worked bar-model solutions — a small problem set you could hand to a classmate.",
  driving: "Where do fractions of a quantity actually show up — and can I explain one so clearly that a friend never gets stuck?",
  mentor: { name: "Ms. Lakshmi Krishnan", title: "Maths · Class 6" },
  group: "Class 6 · Scholar seminar",
  milestones: [
    { label: "Collect 5 real-life fraction situations", done: true, detail: "Recipe quantities, a cricket over, sharing rotis, a sale discount, water in a bottle." },
    { label: "Draft three word problems", done: true, detail: "Each one a 'fraction of a quantity', with realistic numbers." },
    { label: "Solve each with a bar model", done: false, detail: "Show the picture, not just the answer — the move you practised." },
    { label: "Test on a classmate, then revise", done: false, detail: "Watch where they get stuck; rewrite the confusing one." },
  ],
  artifacts: [
    { label: "fraction-hunt-notes.pdf", meta: "5 situations · photographed", uploaded: true },
    { label: "Three drafted problems", meta: "handwritten · scanned", uploaded: true },
    { label: "Bar-model solutions", meta: "not uploaded yet", uploaded: false },
  ],
  rubric: [
    {
      level: "Emerging",
      descriptor: "Problems use fractions but the quantity or the question is unclear.",
      exemplar: "“Half the sweets. How many?” — the whole is never stated, so it can't be solved.",
    },
    {
      level: "Developing",
      descriptor: "Clear problems; solutions reach the answer but skip the model.",
      exemplar: "“Two-fifths of 20 glasses = 8” — correct, but no picture to show why.",
    },
    {
      level: "Secure",
      descriptor: "Clear problems, each solved with a correct, labelled bar model.",
      exemplar: "The laddoo problem with a bar split into 4 parts, three parts shaded, 9 circled.",
      current: true,
    },
    {
      level: "Distinctive",
      descriptor: "A problem set a classmate can follow alone, revised after testing.",
      exemplar: "Includes a note: “Riya got stuck on the sixths, so I redrew the parts bigger.”",
    },
  ],
  mentorFeedback: {
    date: "2026-06-17",
    text: "Your fraction hunt is genuinely sharp, Mahira — the cricket-over one is lovely. Now make the bar models do the talking: a reader should understand without you in the room. That's what moves this from Secure to Distinctive.",
  },
  tutorSupport: {
    offer:
      "I can help you structure the hunt and check that each problem is solvable — does it state the whole, and a clear fraction of it? I can also tidy mechanical things like wording and units.",
    defers:
      "Whether your problem set is genuinely clever — whether it's worth handing to a friend — is Ms. Krishnan's call, not mine. I've flagged your draft for her to read.",
  },
  studentReflection:
    "The hunt was easy and fun. The hard part is drawing the bar so someone else gets it without me explaining. I want my friend to solve it on the first try.",
};

/* ---------------------------------------------------------------------------
   REFLECTION — three calm prompts. What was hard, what changed, what's next.
   ------------------------------------------------------------------------- */
export interface ReflectionPrompt {
  id: string;
  prompt: string;
  hint: string;
  /** Her own short answer, where she has written one. */
  answer?: string;
}

export const reflectionPrompts: ReflectionPrompt[] = [
  {
    id: "rfl-hard",
    prompt: "What felt hard today?",
    hint: "Name the exact moment, not the whole topic.",
    answer:
      "Deciding how many parts to split the bar into when the bottom number changed from 4 to 6. I kept splitting into the wrong number.",
  },
  {
    id: "rfl-changed",
    prompt: "What changed once it clicked?",
    hint: "What do you do differently now?",
    answer:
      "I draw the bar before I read the numbers. The denominator tells me the cuts — I stopped guessing.",
  },
  {
    id: "rfl-next",
    prompt: "What do you want to try next?",
    hint: "One small, reachable next move.",
  },
];
