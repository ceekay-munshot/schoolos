/* ============================================================================
   Tomo School OS — Teacher profiles
   Self-contained seed for the multi-teacher experience: three teachers, five
   classes each (three Concept + two PATH), with per-class lesson plans, one
   moves, rosters, support groups and worksheet samples. Plus a unified Action
   Inbox across all three teachers.

   This file is imported directly via "@/data/teacher-profiles" and is NOT wired
   into data/index.ts.
   ========================================================================== */

export type ClassKind = "concept" | "path";
export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
export type SectionDecision = "accepted" | "edited" | "pending";
export type WorkDifficulty = "support" | "core" | "stretch";
export type ReviewStatus = "approved" | "needs-review";

export interface TeacherProfile {
  id: string;
  name: string;
  honorific: string; // "Ms." / "Mr."
  stage: string; // "Elementary" / "Middle School" / "High School"
  subject: string;
  blurb: string; // one warm line
}

export interface RosterPupil {
  name: string;
  pace: "on" | "ahead" | "behind";
  note: string; // a light, human one-liner
}

export interface SupportPupil {
  name: string;
  reason: string; // names the skill in plain English
}

export interface OneMove {
  headline: string;
  names: string[]; // the 3–4 children
  why: string; // two plain sentences
  everyoneElse: string;
}

export interface LessonSection {
  kind: "Instruction" | "1:1 Talk-buddy" | "Self-work" | "Activity";
  minutes: number;
  title: string;
  detail: string;
  aiNote: string;
  decision: SectionDecision;
}

export interface WorksheetSample {
  title: string;
  difficulty: WorkDifficulty;
  targetSkill: string;
  reviewStatus: ReviewStatus;
  questions: string[];
}

export interface PathGroup {
  groupName: string;
  members: string[];
}

export interface PathWork {
  studentName: string;
  title: string;
  rating: number; // 1–5
  note: string;
}

export interface TeacherClass {
  id: string; // globally unique, e.g. "cls-frac-5k"
  teacherId: string;
  kind: ClassKind;
  subject: string;
  topic: string;
  klass: string; // "Class 7 · Narmada"
  room: string;
  day: Weekday;
  start: string; // "09:00"
  end: string; // "10:00"
  competency: string; // skill / competency label
  hero?: boolean; // surfaces the existing block showpiece
  oneMove: OneMove;
  roster: RosterPupil[]; // 20 children
  support: SupportPupil[]; // 3–5 children
  worksheets: WorksheetSample[];
  // concept-only
  plan: LessonSection[]; // 60-min plan (20/10/20/10 for concept)
  // path-only
  groups?: PathGroup[];
  recentWork?: PathWork[];
}

/* ----------------------------------------------------------------------------
   Roster helper — keeps each class to 20 believable children without 300 lines
   of literal objects. Names are real-feeling Indian names; paces and notes vary.
---------------------------------------------------------------------------- */
function roster(
  names: string[],
  marks: Partial<Record<string, { pace: RosterPupil["pace"]; note: string }>>,
): RosterPupil[] {
  return names.map((name) => {
    const m = marks[name];
    return {
      name,
      pace: m?.pace ?? "on",
      note: m?.note ?? "Moving with the class",
    };
  });
}

/* ============================================================================
   TEACHERS
   ========================================================================== */
export const teacherProfiles: TeacherProfile[] = [
  {
    id: "tp-lakshmi",
    name: "Lakshmi Krishnan",
    honorific: "Ms.",
    stage: "Elementary",
    subject: "Mathematics",
    blurb: "Teaches Class 4 and 5 Maths. Quiet rooms, careful hands, real understanding.",
  },
  {
    id: "tp-meghna",
    name: "Meghna Rao",
    honorific: "Ms.",
    stage: "Middle School",
    subject: "English",
    blurb: "Teaches Class 6 to 8 English. Reading closely, writing with a voice.",
  },
  {
    id: "tp-arvind",
    name: "Arvind Sundaram",
    honorific: "Mr.",
    stage: "High School",
    subject: "Social Science",
    blurb: "Teaches Class 9 and 10 History, Civics and Geography. Big questions, real evidence.",
  },
];

export function teacherById(id: string) {
  return teacherProfiles.find((t) => t.id === id);
}

/* ============================================================================
   CLASSES — 15 total (5 per teacher: 3 concept + 2 PATH)
   ========================================================================== */
export const teacherClasses: TeacherClass[] = [
  /* ---------------------------------------------------------------------- *
   * T1 — Lakshmi Krishnan · Elementary · Mathematics
   * ---------------------------------------------------------------------- */
  {
    id: "cls-frac-5k",
    teacherId: "tp-lakshmi",
    kind: "concept",
    subject: "Mathematics",
    topic: "Equivalent fractions",
    klass: "Class 5 · Kaveri",
    room: "Numbers Room 2",
    day: "Thu",
    start: "09:00",
    end: "10:00",
    competency: "See and make equal fractions (1/2 = 2/4 = 3/6)",
    hero: true,
    oneMove: {
      headline: "Riya and three others — stuck on equal fractions",
      names: ["Riya", "Kabir", "Diya", "Ishaan"],
      why: "All four are 'adding across' when they add fractions, like 2/3 + 1/4 turning into 3/7. The real gap is one step earlier — making equal fractions — so fixing it here opens up the rest.",
      everyoneElse: "Everyone else has their own sheet, including Aarav and Saanvi, who need a harder challenge, not help.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "Equal fractions on the fraction wall",
        detail: "Whole class: line up the wall to show 1/2 = 2/4 = 3/6. Name the move out loud — multiply the top and bottom by the same number.",
        aiNote: "Twenty minutes of clear teaching to open the hour, in short bursts so attention holds.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "Explain it to your partner",
        detail: "Pairs take turns saying why 1/2 and 2/4 are the same amount, using the wall strips.",
        aiNote: "Pairs set so a confident child sits with one who is still practising.",
        decision: "accepted",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Worksheets matched to each child, three levels",
        detail: "Support, core and harder sheets, handed out by name. This is your window to pull the small group to the wall.",
        aiNote: "Three levels built from yesterday's work. The support sheet needs your okay before it goes out.",
        decision: "pending",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Fraction-wall card game",
        detail: "Mixed pairs match equal-fraction cards against the wall. On their feet, low stakes, a good close.",
        aiNote: "Reuses last week's printed card set — no new materials needed.",
        decision: "accepted",
      },
    ],
    roster: roster(
      ["Riya Menon", "Kabir Shah", "Diya Pillai", "Ishaan Verma", "Aarav Reddy", "Saanvi Iyer", "Vihaan Gupta", "Myra Joshi", "Aditya Rao", "Anvi Nair", "Navya Hegde", "Kiaan Bose", "Dhruv Patel", "Pari Deshpande", "Reyansh Kulkarni", "Tara Krishnan", "Advait Menon", "Zara Khan", "Aisha Sheikh", "Sara Thomas"],
      {
        "Riya Menon": { pace: "behind", note: "Adds across when adding fractions" },
        "Kabir Shah": { pace: "behind", note: "Skips the equal-fraction step" },
        "Diya Pillai": { pace: "behind", note: "Still building the wall in her head" },
        "Ishaan Verma": { pace: "behind", note: "Away Mon–Tue, may just be missed time" },
        "Aarav Reddy": { pace: "ahead", note: "Ready for first word problems" },
        "Saanvi Iyer": { pace: "ahead", note: "Wants a harder challenge" },
        "Reyansh Kulkarni": { pace: "on", note: "Recall slipping a little after a house move" },
      },
    ),
    support: [
      { name: "Riya Menon", reason: "Last sheet: equal fractions not secure yet" },
      { name: "Kabir Shah", reason: "Added across on three of five fraction sums" },
      { name: "Diya Pillai", reason: "Needs the wall to find an equal fraction" },
      { name: "Ishaan Verma", reason: "Missed the intro lesson; gap may be time, not idea" },
    ],
    worksheets: [
      {
        title: "Equal fractions — building from the wall",
        difficulty: "support",
        targetSkill: "Make an equal fraction",
        reviewStatus: "needs-review",
        questions: [
          "Use the wall. Fill in: 1/2 = ?/4 = ?/6.",
          "Draw a picture to show 2/3 = 4/6.",
          "Sai says 1/3 = 2/5. Is he right? Show why on the wall.",
        ],
      },
      {
        title: "Equal fractions into comparing",
        difficulty: "core",
        targetSkill: "Compare two fractions",
        reviewStatus: "approved",
        questions: [
          "Which is bigger: 3/4 or 2/3? Make equal fractions first.",
          "Put in order, smallest first: 1/2, 2/3, 3/4.",
          "Find a fraction that sits between 1/2 and 3/4.",
        ],
      },
      {
        title: "Into adding and first word problems",
        difficulty: "stretch",
        targetSkill: "Add fractions with unlike bottoms",
        reviewStatus: "approved",
        questions: [
          "Work out 2/3 + 1/4. Make the bottoms the same first.",
          "Maya ate 1/2 of a roti and Ato ate 1/3. How much in all?",
          "Make up your own fraction-adding question and solve it.",
        ],
      },
    ],
  },
  {
    id: "cls-frac-5g",
    teacherId: "tp-lakshmi",
    kind: "concept",
    subject: "Mathematics",
    topic: "Comparing and ordering fractions",
    klass: "Class 5 · Ganga",
    room: "Numbers Room 2",
    day: "Thu",
    start: "10:15",
    end: "11:15",
    competency: "Compare and order fractions with unlike bottoms",
    oneMove: {
      headline: "Aanya and two others — comparing by the top number only",
      names: ["Aanya", "Veer", "Mira"],
      why: "These three pick the bigger fraction by looking only at the top number, so they think 3/8 is bigger than 1/2. They need to make the bottoms match before comparing.",
      everyoneElse: "The rest are ordering three fractions well and are ready to slot a fourth one in.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "Same bottom, then compare",
        detail: "Whole class: turn 3/4 and 2/3 into twelfths, then compare. Show why you cannot trust the top number alone.",
        aiNote: "Builds straight on Tuesday's equal-fractions lesson, so it should feel familiar.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "Bigger or smaller, and why",
        detail: "Pairs sort six fraction cards into bigger-than-half and smaller-than-half, saying the reason each time.",
        aiNote: "Half is a friendly anchor; it catches the 'top number only' mix-up fast.",
        decision: "edited",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Order the fraction sets",
        detail: "Three levels of ordering sheets by name. Pull Aanya, Veer and Mira to a quick same-bottom drill.",
        aiNote: "Support sheet keeps the bottoms small (halves, quarters, eighths) on purpose.",
        decision: "accepted",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Human number line",
        detail: "Six children hold fraction cards and arrange themselves smallest to largest at the front. The class checks.",
        aiNote: "Movement close; no materials beyond the printed cards.",
        decision: "accepted",
      },
    ],
    roster: roster(
      ["Aanya Bhat", "Veer Malhotra", "Mira Sundaram", "Rohan Pillai", "Ira Nambiar", "Yuvan Raj", "Anaya Desai", "Atharv Kamath", "Siya Menon", "Arnav Ghosh", "Kavya Rao", "Devansh Jain", "Ahana Pai", "Vivaan Shetty", "Nitara Reddy", "Shaurya Kapoor", "Riaan Verma", "Meher Singh", "Aradhya Nair", "Laksh Iyer"],
      {
        "Aanya Bhat": { pace: "behind", note: "Compares by the top number only" },
        "Veer Malhotra": { pace: "behind", note: "Forgets to match the bottoms" },
        "Mira Sundaram": { pace: "behind", note: "Unsure once the bottoms differ" },
        "Yuvan Raj": { pace: "ahead", note: "Ordering five fractions cleanly" },
        "Kavya Rao": { pace: "ahead", note: "Asks about fractions on a number line" },
      },
    ),
    support: [
      { name: "Aanya Bhat", reason: "Last sheet: chose 3/8 over 1/2 — top-number habit" },
      { name: "Veer Malhotra", reason: "Did not match bottoms before comparing" },
      { name: "Mira Sundaram", reason: "Comparing unlike bottoms not secure yet" },
    ],
    worksheets: [
      {
        title: "Bigger than half, smaller than half",
        difficulty: "support",
        targetSkill: "Use half as an anchor",
        reviewStatus: "approved",
        questions: [
          "Is 3/8 bigger or smaller than 1/2? Show how you know.",
          "Sort these into two groups: 1/3, 5/8, 2/5, 3/4.",
          "Write one fraction that is just bigger than 1/2.",
        ],
      },
      {
        title: "Order three fractions",
        difficulty: "core",
        targetSkill: "Order with unlike bottoms",
        reviewStatus: "needs-review",
        questions: [
          "Order smallest first: 2/3, 1/2, 5/6.",
          "Make the bottoms the same, then order: 3/4, 2/5, 7/10.",
          "Which two of 1/2, 3/8, 5/8 are closest together?",
        ],
      },
      {
        title: "Slot in a fourth fraction",
        difficulty: "stretch",
        targetSkill: "Reason about size",
        reviewStatus: "approved",
        questions: [
          "Place 5/9 into the order: 1/3, 1/2, 2/3.",
          "Find a fraction between 2/5 and 1/2.",
          "True or false: a bigger bottom always means a smaller fraction? Explain.",
        ],
      },
    ],
  },
  {
    id: "cls-mult-4k",
    teacherId: "tp-lakshmi",
    kind: "concept",
    subject: "Mathematics",
    topic: "Multiplication facts to 10 × 10",
    klass: "Class 4 · Kaveri",
    room: "Numbers Room 2",
    day: "Thu",
    start: "11:30",
    end: "12:30",
    competency: "Recall times tables to 10 × 10 quickly and surely",
    oneMove: {
      headline: "Nivaan and three others — the 7s and 8s are slow",
      names: ["Nivaan", "Sara", "Ayaan", "Tanvi"],
      why: "These four count up on their fingers for the 7 and 8 tables, which slows down every word problem later. A few minutes of skip-counting practice each day will make these stick.",
      everyoneElse: "Most of the class is fast on every table and ready to use them inside two-step problems.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "The hard squares of the table",
        detail: "Whole class: shade the 6, 7, 8 corner of the times-table grid and show the patterns that make those facts easier to hold.",
        aiNote: "Targets exactly the facts the class is slow on, not the ones already secure.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "Quick-fire pairs",
        detail: "Pairs test each other on a small deck of 7 and 8 facts, keeping a tally of fast ones.",
        aiNote: "Pairs balanced so no child faces a much faster partner.",
        decision: "accepted",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Fact sheets and first two-step problems",
        detail: "Support sheet drills the slow facts; core and stretch move into word problems. Pull Nivaan's group for skip-counting.",
        aiNote: "Support sheet stays on 7s and 8s; harder sheet uses facts inside problems.",
        decision: "pending",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Times-table bingo",
        detail: "Call out facts; children mark answers on a grid. First full line calls it.",
        aiNote: "Reuses the printed bingo grids from last month.",
        decision: "accepted",
      },
    ],
    roster: roster(
      ["Nivaan Joshi", "Sara Qureshi", "Ayaan Khan", "Tanvi Desai", "Arush Mehta", "Inaya Sheikh", "Vedant Rao", "Pihu Agarwal", "Reyansh Pai", "Khushi Nair", "Daksh Shetty", "Anika Menon", "Yug Patel", "Saira Kapoor", "Ranbir Singh", "Mahira Bose", "Hrithik Iyer", "Naira Ghosh", "Aryan Reddy", "Kiara Pillai"],
      {
        "Nivaan Joshi": { pace: "behind", note: "Counts on fingers for 7s and 8s" },
        "Sara Qureshi": { pace: "behind", note: "Slow on the 8 table" },
        "Ayaan Khan": { pace: "behind", note: "Mixes 7×8 and 6×8" },
        "Tanvi Desai": { pace: "behind", note: "Needs more time on 7s" },
        "Arush Mehta": { pace: "ahead", note: "Fast on all tables, ready for two-step" },
        "Pihu Agarwal": { pace: "ahead", note: "Asks for harder word problems" },
      },
    ),
    support: [
      { name: "Nivaan Joshi", reason: "Last sheet: 7 and 8 facts not yet quick" },
      { name: "Sara Qureshi", reason: "Hesitates on the 8 table" },
      { name: "Ayaan Khan", reason: "Mixed up two of the 8 facts" },
      { name: "Tanvi Desai", reason: "Recall of 7s still building" },
    ],
    worksheets: [
      {
        title: "The 7 and 8 tables, little and often",
        difficulty: "support",
        targetSkill: "Recall 7 and 8 facts",
        reviewStatus: "approved",
        questions: [
          "Fill the gaps: 7 × 6 = ?, 8 × 4 = ?, 7 × 9 = ?",
          "Skip-count in 8s up to 80.",
          "Circle the harder one and practise it: 7 × 8 or 7 × 2.",
        ],
      },
      {
        title: "Tables inside word problems",
        difficulty: "core",
        targetSkill: "Use facts in one step",
        reviewStatus: "approved",
        questions: [
          "A box holds 8 pens. How many in 7 boxes?",
          "There are 6 rows of 9 chairs. How many chairs?",
          "Write the fact that helps you here: 56 = ? × ?",
        ],
      },
      {
        title: "Two-step problems",
        difficulty: "stretch",
        targetSkill: "Use facts across two steps",
        reviewStatus: "needs-review",
        questions: [
          "7 packs of 8 stickers, then 5 given away. How many left?",
          "A hall has 8 rows of 7 seats. If 9 are empty, how many filled?",
          "Make up a two-step problem that uses 8 × 6.",
        ],
      },
    ],
  },
  {
    id: "cls-builder-45",
    teacherId: "tp-lakshmi",
    kind: "path",
    subject: "PATH · Builder",
    topic: "Make, test and fix",
    klass: "Class 4–5 · Workshop",
    room: "Workshop",
    day: "Thu",
    start: "13:00",
    end: "14:00",
    competency: "Build something, test it, and make it better",
    oneMove: {
      headline: "Two builders need a nudge to test before they finish",
      names: ["Kabir", "Yug"],
      why: "Both rush to glue things down before checking if the idea works, so a small fault becomes a big rebuild. A quick 'test it first' habit will lift the standard of their work.",
      everyoneElse: "The rest are on their third or fourth try and fixing faults as they go.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "Show-and-tell of last week's builds",
        detail: "Two builders show a fault they found and how they fixed it. Name the habit: try it, test it, fix it.",
        aiNote: "Opening with peers' work sets the bar without you having to lecture.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "Plan the next test",
        detail: "Each builder tells a partner the one thing they will test today before building further.",
        aiNote: "Catches the 'glue it first' habit early in the session.",
        decision: "accepted",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Build and test time",
        detail: "Groups work on their projects. Move between them; sit longer with Kabir and Yug on testing.",
        aiNote: "No new materials; carried over from last week's workshop.",
        decision: "accepted",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Two-minute fault hunt",
        detail: "Swap projects with another group and find one thing to improve. Hand it back with a kind note.",
        aiNote: "Peer feedback close; keeps the room generous.",
        decision: "edited",
      },
    ],
    roster: roster(
      ["Kabir Shah", "Yug Patel", "Aarav Reddy", "Vihaan Gupta", "Diya Pillai", "Arush Mehta", "Daksh Shetty", "Reyansh Pai", "Tara Krishnan", "Advait Menon", "Anika Menon", "Vedant Rao", "Aryan Reddy", "Khushi Nair", "Ranbir Singh", "Nivaan Joshi", "Pihu Agarwal", "Kiara Pillai", "Hrithik Iyer", "Saira Kapoor"],
      {
        "Kabir Shah": { pace: "behind", note: "Glues before testing" },
        "Yug Patel": { pace: "behind", note: "Rushes to finish" },
        "Aarav Reddy": { pace: "ahead", note: "On his fourth iteration, strong test reflex" },
        "Arush Mehta": { pace: "ahead", note: "Helps others debug their builds" },
      },
    ),
    support: [
      { name: "Kabir Shah", reason: "Craft: tests too late, after gluing" },
      { name: "Yug Patel", reason: "Craft: finishes before checking it works" },
      { name: "Diya Pillai", reason: "Craft: needs help breaking a build into steps" },
    ],
    worksheets: [
      {
        title: "Build log — try, test, fix",
        difficulty: "support",
        targetSkill: "Test before finishing",
        reviewStatus: "approved",
        questions: [
          "What is the one thing you will test today?",
          "What happened when you tested it?",
          "What will you change next try?",
        ],
      },
      {
        title: "Design a fair test",
        difficulty: "core",
        targetSkill: "Plan a simple test",
        reviewStatus: "approved",
        questions: [
          "How will you know your build worked?",
          "What will you keep the same so the test is fair?",
          "Draw your build and label the part you are testing.",
        ],
      },
    ],
    groups: [
      { groupName: "Marble runs", members: ["Kabir Shah", "Aarav Reddy", "Yug Patel"] },
      { groupName: "Bridges", members: ["Vihaan Gupta", "Arush Mehta", "Daksh Shetty"] },
      { groupName: "Simple machines", members: ["Diya Pillai", "Reyansh Pai", "Anika Menon"] },
    ],
    recentWork: [
      { studentName: "Aarav Reddy", title: "Cardboard marble-run v4 (gravity gate)", rating: 4, note: "Fourth try — added a working gate after two failures. Strong test-and-fix reflex." },
      { studentName: "Arush Mehta", title: "Spaghetti bridge that held 12 coins", rating: 4, note: "Tested the load step by step instead of all at once. Careful builder." },
      { studentName: "Kabir Shah", title: "Pulley lift, first working version", rating: 3, note: "Got it lifting at last. Still glues before testing — that is this term's focus." },
    ],
  },
  {
    id: "cls-scholar-5",
    teacherId: "tp-lakshmi",
    kind: "path",
    subject: "PATH · Scholar",
    topic: "Ask why it is true",
    klass: "Class 5 · Seminar",
    room: "Seminar 1",
    day: "Thu",
    start: "14:15",
    end: "15:15",
    competency: "Notice a pattern and try to explain why it works",
    oneMove: {
      headline: "Three scholars stop at the pattern, not the why",
      names: ["Saanvi", "Kavya", "Aanya"],
      why: "They spot a number pattern quickly but stop there, without asking why it holds. A gentle 'can you show it is always true?' pushes them from noticing to proving.",
      everyoneElse: "The others are already trying small proofs and testing their own claims.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "From pattern to proof",
        detail: "Look at the digit-sum pattern in the 9 times table together. Move from 'I notice' to 'here is why it must be true'.",
        aiNote: "Uses a pattern most of the group already met, so the focus stays on the why.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "Convince your partner",
        detail: "Each scholar tries to convince a partner that their pattern always works. The partner plays friendly doubter.",
        aiNote: "The doubter role is what turns a guess into an argument.",
        decision: "accepted",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Your own small proof",
        detail: "Pick a pattern and write why it works. Sit with Saanvi, Kavya and Aanya to push past 'I just noticed it'.",
        aiNote: "Open task; the support prompt gives a sentence starter for the why.",
        decision: "edited",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Prove it or break it",
        detail: "Swap claims with another pair. Either show it is always true or find one case where it fails.",
        aiNote: "Counter-examples are celebrated, not penalised.",
        decision: "accepted",
      },
    ],
    roster: roster(
      ["Saanvi Iyer", "Kavya Rao", "Aanya Bhat", "Aarav Reddy", "Yuvan Raj", "Ira Nambiar", "Atharv Kamath", "Devansh Jain", "Siya Menon", "Arnav Ghosh", "Advait Menon", "Tara Krishnan", "Nitara Reddy", "Shaurya Kapoor", "Pihu Agarwal", "Riaan Verma", "Meher Singh", "Aradhya Nair", "Laksh Iyer", "Vivaan Shetty"],
      {
        "Saanvi Iyer": { pace: "behind", note: "Notices patterns but stops there" },
        "Kavya Rao": { pace: "behind", note: "Needs a push to the why" },
        "Aanya Bhat": { pace: "behind", note: "Spots it fast, explains slowly" },
        "Yuvan Raj": { pace: "ahead", note: "Writing real little proofs" },
        "Atharv Kamath": { pace: "ahead", note: "Loves finding counter-examples" },
      },
    ),
    support: [
      { name: "Saanvi Iyer", reason: "Craft: stops at the pattern, not the proof" },
      { name: "Kavya Rao", reason: "Craft: needs the 'why is it true' step" },
      { name: "Aanya Bhat", reason: "Craft: explaining an argument clearly" },
    ],
    worksheets: [
      {
        title: "From 'I notice' to 'because'",
        difficulty: "support",
        targetSkill: "Explain why a pattern holds",
        reviewStatus: "approved",
        questions: [
          "Finish the sentence: I notice that… because…",
          "Try three more numbers. Does your pattern still work?",
          "Can you find one case where it fails?",
        ],
      },
      {
        title: "A small proof of your own",
        difficulty: "stretch",
        targetSkill: "Build a simple argument",
        reviewStatus: "needs-review",
        questions: [
          "Show why the digits of any 9-times answer add to 9.",
          "Pick your own pattern and argue why it must be true.",
          "Where would your argument break if the numbers changed?",
        ],
      },
    ],
    groups: [
      { groupName: "Number patterns", members: ["Saanvi Iyer", "Yuvan Raj", "Devansh Jain"] },
      { groupName: "Shape and space", members: ["Kavya Rao", "Atharv Kamath", "Siya Menon"] },
      { groupName: "Puzzles and logic", members: ["Aanya Bhat", "Aarav Reddy", "Arnav Ghosh"] },
    ],
    recentWork: [
      { studentName: "Saanvi Iyer", title: "Patterns in the 9× table — a small proof", rating: 5, note: "Noticed the digit-sum pattern unprompted and tried to explain why. The academic spark, emerging." },
      { studentName: "Yuvan Raj", title: "Why three odd numbers add to an odd number", rating: 4, note: "Clear argument with one small gap. Asked for a harder claim straight after." },
      { studentName: "Atharv Kamath", title: "Broke a 'rule' with one counter-example", rating: 4, note: "Found the single case that disproved a class claim. Sharp doubter." },
    ],
  },

  /* ---------------------------------------------------------------------- *
   * T2 — Meghna Rao · Middle School · English
   * ---------------------------------------------------------------------- */
  {
    id: "cls-tense-7n",
    teacherId: "tp-meghna",
    kind: "concept",
    subject: "English",
    topic: "Keeping tense consistent in a narrative",
    klass: "Class 7 · Narmada",
    room: "Language Room 1",
    day: "Thu",
    start: "09:00",
    end: "10:00",
    competency: "Hold one tense steadily across a story",
    oneMove: {
      headline: "Aditi and two others slip between past and present",
      names: ["Aditi", "Farhan", "Nidhi"],
      why: "Their stories start in the past then drift into the present mid-paragraph, which confuses the reader. A quick edit pass hunting tense changes will fix most of it.",
      everyoneElse: "The rest hold one tense well and are ready to vary sentence length for effect.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "Spot the tense slip",
        detail: "Whole class: read a short paragraph that drifts from past to present. Mark every verb and find the moment it slips.",
        aiNote: "Uses a passage with the exact slip three children make, so the lesson lands.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "Read it aloud to your partner",
        detail: "Partners read each other's last paragraph aloud — slips are easier to hear than to see.",
        aiNote: "Reading aloud surfaces tense changes the eye skips over.",
        decision: "accepted",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Edit your own narrative",
        detail: "Each writer fixes the tense in their draft. Pull Aditi, Farhan and Nidhi for a guided edit.",
        aiNote: "Support sheet gives a verb checklist; stretch asks them to choose past or present on purpose.",
        decision: "pending",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Tense-switch challenge",
        detail: "Rewrite one paragraph from past into present, then read both. Which suits the story?",
        aiNote: "Turns the rule into a choice writers make, not just a correction.",
        decision: "accepted",
      },
    ],
    roster: roster(
      ["Aditi Sharma", "Farhan Ali", "Nidhi Rao", "Karthik Menon", "Sneha Pillai", "Rohit Verma", "Ananya Das", "Imran Sheikh", "Pooja Nair", "Varun Hegde", "Tanya Kapoor", "Sahil Gupta", "Diya Bose", "Manav Shetty", "Riya Iyer", "Aryan Joshi", "Megha Pai", "Zoya Khan", "Kunal Reddy", "Ishita Ghosh"],
      {
        "Aditi Sharma": { pace: "behind", note: "Drifts from past to present" },
        "Farhan Ali": { pace: "behind", note: "Switches tense mid-paragraph" },
        "Nidhi Rao": { pace: "behind", note: "Loses the tense when excited" },
        "Karthik Menon": { pace: "ahead", note: "Ready to vary sentence length" },
        "Ananya Das": { pace: "ahead", note: "Plays with tense on purpose" },
      },
    ),
    support: [
      { name: "Aditi Sharma", reason: "Last piece: tense slipped past to present twice" },
      { name: "Farhan Ali", reason: "Changed tense inside one paragraph" },
      { name: "Nidhi Rao", reason: "Tense control not steady yet" },
    ],
    worksheets: [
      {
        title: "Find and fix the tense slip",
        difficulty: "support",
        targetSkill: "Spot a tense change",
        reviewStatus: "approved",
        questions: [
          "Underline every verb in this paragraph.",
          "Circle the verb where the tense changes.",
          "Rewrite the paragraph so it stays in the past.",
        ],
      },
      {
        title: "Edit a classmate's draft",
        difficulty: "core",
        targetSkill: "Edit for one tense",
        reviewStatus: "needs-review",
        questions: [
          "Read the draft. Mark any tense slips.",
          "Suggest a fix for each slip you found.",
          "Write one kind note about what works in the writing.",
        ],
      },
      {
        title: "Choose your tense on purpose",
        difficulty: "stretch",
        targetSkill: "Use tense for effect",
        reviewStatus: "approved",
        questions: [
          "Write the same scene once in past, once in present.",
          "Which tense makes it feel more urgent? Why?",
          "Pick one and finish the scene in that tense.",
        ],
      },
    ],
  },
  {
    id: "cls-persuade-8y",
    teacherId: "tp-meghna",
    kind: "concept",
    subject: "English",
    topic: "Building a persuasive paragraph",
    klass: "Class 8 · Yamuna",
    room: "Language Room 2",
    day: "Thu",
    start: "10:15",
    end: "11:15",
    competency: "Make a point, back it with a reason and an example",
    oneMove: {
      headline: "Three writers state an opinion with no reason",
      names: ["Rehan", "Sara", "Ojas"],
      why: "They write a strong opinion but stop before giving a reason or example, so it reads as a claim, not an argument. A point–reason–example frame gives them the missing middle.",
      everyoneElse: "The rest are linking two reasons and are ready to handle the other side.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "Point, reason, example",
        detail: "Whole class: take a flat opinion and build it up with a reason and a real example. Show the difference on the board.",
        aiNote: "The frame matches exactly what three writers are missing — the reason.",
        decision: "edited",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "Say your reason out loud",
        detail: "Partners take an opinion and push each other with 'but why?' until a real reason appears.",
        aiNote: "Speaking the reason first makes writing it far easier.",
        decision: "accepted",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Write one strong paragraph",
        detail: "Each writer builds a point–reason–example paragraph. Pull Rehan, Sara and Ojas to find their reasons.",
        aiNote: "Support sheet gives the frame; stretch adds answering the other side.",
        decision: "pending",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Rate the paragraph",
        detail: "Swap paragraphs and mark them out of three: point, reason, example. Hand back with one tip.",
        aiNote: "Quick peer review that names the three parts.",
        decision: "accepted",
      },
    ],
    roster: roster(
      ["Rehan Khan", "Sara Menon", "Ojas Patel", "Aarohi Rao", "Dev Sharma", "Tisha Nair", "Yash Gupta", "Kriti Pillai", "Armaan Sheikh", "Nandini Hegde", "Vihaan Das", "Saanvi Bose", "Rishi Shetty", "Anaya Iyer", "Pranav Joshi", "Mahi Kapoor", "Ayan Verma", "Diya Ghosh", "Kabir Pai", "Tara Reddy"],
      {
        "Rehan Khan": { pace: "behind", note: "States an opinion, no reason" },
        "Sara Menon": { pace: "behind", note: "Skips the example" },
        "Ojas Patel": { pace: "behind", note: "Reason and opinion run together" },
        "Aarohi Rao": { pace: "ahead", note: "Linking two reasons well" },
        "Dev Sharma": { pace: "ahead", note: "Ready to answer the other side" },
      },
    ),
    support: [
      { name: "Rehan Khan", reason: "Last piece: opinion with no reason given" },
      { name: "Sara Menon", reason: "Left out the supporting example" },
      { name: "Ojas Patel", reason: "Reason not yet clear from the opinion" },
    ],
    worksheets: [
      {
        title: "Point, reason, example frame",
        difficulty: "support",
        targetSkill: "Add a reason to a point",
        reviewStatus: "approved",
        questions: [
          "Write your opinion in one sentence.",
          "Now answer: why do you think that?",
          "Give one real example that backs it up.",
        ],
      },
      {
        title: "Build a full paragraph",
        difficulty: "core",
        targetSkill: "Join point, reason, example",
        reviewStatus: "approved",
        questions: [
          "Write a paragraph arguing for a longer lunch break.",
          "Underline your point, your reason and your example.",
          "Add a sentence that links your two ideas.",
        ],
      },
      {
        title: "Answer the other side",
        difficulty: "stretch",
        targetSkill: "Handle a counter-argument",
        reviewStatus: "needs-review",
        questions: [
          "What would someone who disagrees say?",
          "Write a sentence that answers them fairly.",
          "End your paragraph so your point still stands.",
        ],
      },
    ],
  },
  {
    id: "cls-infer-6k",
    teacherId: "tp-meghna",
    kind: "concept",
    subject: "English",
    topic: "Inference in reading",
    klass: "Class 6 · Kaveri",
    room: "Reading Nook",
    day: "Thu",
    start: "11:30",
    end: "12:30",
    competency: "Read between the lines using clues in the text",
    oneMove: {
      headline: "Aryan and two others answer only what is on the page",
      names: ["Aryan", "Meher", "Tanish"],
      why: "When a question needs reading between the lines, these three copy a line straight from the text instead of using the clue. Pointing to the words that hint at the answer will build the habit.",
      everyoneElse: "The rest are using clues well and are ready to back an inference with evidence.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "What the clues tell us",
        detail: "Whole class: read a short passage and find what is not said but hinted. Point to the exact words that gave it away.",
        aiNote: "Chosen passage hides its answer in a clue, not on the surface.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "Show me the clue",
        detail: "Partners ask each other 'how do you know?' and must point to the words in the text.",
        aiNote: "The 'how do you know' question is what moves copying to inferring.",
        decision: "accepted",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Read and infer",
        detail: "Three levels of passages with inference questions. Pull Aryan, Meher and Tanish to underline clues first.",
        aiNote: "Support sheet asks them to underline the clue before answering.",
        decision: "pending",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Guess the feeling",
        detail: "Read a line of dialogue and guess the character's mood, pointing to the clue word.",
        aiNote: "Short and lively; keeps evidence at the centre.",
        decision: "edited",
      },
    ],
    roster: roster(
      ["Aryan Nair", "Meher Kaur", "Tanish Rao", "Sara Pillai", "Vivaan Menon", "Aisha Sheikh", "Rudra Gupta", "Navya Das", "Irfan Khan", "Pari Hegde", "Aarav Bose", "Siya Shetty", "Kabir Iyer", "Anvi Joshi", "Reyansh Kapoor", "Myra Verma", "Dhruv Ghosh", "Tara Pai", "Ayaan Reddy", "Ishaan Sharma"],
      {
        "Aryan Nair": { pace: "behind", note: "Copies a line instead of inferring" },
        "Meher Kaur": { pace: "behind", note: "Answers only the literal question" },
        "Tanish Rao": { pace: "behind", note: "Misses the clue word" },
        "Aisha Sheikh": { pace: "ahead", note: "Backs answers with evidence" },
        "Navya Das": { pace: "ahead", note: "Reads tone and mood well" },
      },
    ),
    support: [
      { name: "Aryan Nair", reason: "Last task: copied the text, did not use the clue" },
      { name: "Meher Kaur", reason: "Answered the literal, missed the inference" },
      { name: "Tanish Rao", reason: "Did not spot the clue word" },
    ],
    worksheets: [
      {
        title: "Underline the clue first",
        difficulty: "support",
        targetSkill: "Find a clue in the text",
        reviewStatus: "approved",
        questions: [
          "Read the passage. Underline the words that hint at the answer.",
          "What do those words tell you that the text does not say outright?",
          "Answer the question using your underlined clue.",
        ],
      },
      {
        title: "Read between the lines",
        difficulty: "core",
        targetSkill: "Make an inference",
        reviewStatus: "approved",
        questions: [
          "How is the character feeling? How do you know?",
          "Why did she leave the room? Use a clue.",
          "What time of day is it? Point to the evidence.",
        ],
      },
      {
        title: "Back it with evidence",
        difficulty: "stretch",
        targetSkill: "Support an inference",
        reviewStatus: "needs-review",
        questions: [
          "Make a claim about the character and quote two clues.",
          "Could someone read it differently? Explain.",
          "Which clue is the strongest? Why?",
        ],
      },
    ],
  },
  {
    id: "cls-comm-678",
    teacherId: "tp-meghna",
    kind: "path",
    subject: "PATH · Communicator",
    topic: "Speak, listen, persuade",
    klass: "Class 6–8 · Forum",
    room: "Forum",
    day: "Thu",
    start: "13:00",
    end: "14:00",
    competency: "Build a clear case and answer the other side",
    oneMove: {
      headline: "Two debaters argue past the other team",
      names: ["Dev", "Aarohi"],
      why: "Both make strong opening points but do not answer what the other side actually said, so the clash never happens. A 'they said, I say' note card will anchor their rebuttals.",
      everyoneElse: "The rest are listening closely and rebutting the real point.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "Listen, then answer",
        detail: "Watch a short clip of two speakers. Mark where one truly answers the other and where they just repeat themselves.",
        aiNote: "Models the exact skill two debaters are missing — real rebuttal.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "They said, I say",
        detail: "In pairs, one makes a point; the partner must first say it back, then answer it.",
        aiNote: "Saying the point back forces real listening before the reply.",
        decision: "accepted",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Prep your rebuttal",
        detail: "Speakers write note cards for tomorrow's motion. Sit with Dev and Aarohi on answering the clash.",
        aiNote: "Support card gives the 'they said / I say' two-column layout.",
        decision: "edited",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "One-minute clash",
        detail: "Quick-fire pairs: a point, then a 30-second rebuttal that must answer it. The room judges the clash.",
        aiNote: "Short, high-energy; rewards listening over volume.",
        decision: "accepted",
      },
    ],
    roster: roster(
      ["Dev Sharma", "Aarohi Rao", "Karthik Menon", "Ananya Das", "Rehan Khan", "Tanya Kapoor", "Armaan Sheikh", "Nandini Hegde", "Aisha Sheikh", "Navya Das", "Pranav Joshi", "Mahi Kapoor", "Vivaan Menon", "Sneha Pillai", "Yash Gupta", "Kriti Pillai", "Aryan Joshi", "Zoya Khan", "Rishi Shetty", "Tara Reddy"],
      {
        "Dev Sharma": { pace: "behind", note: "Argues past the other side" },
        "Aarohi Rao": { pace: "behind", note: "Repeats her point instead of rebutting" },
        "Karthik Menon": { pace: "ahead", note: "Answers the real clash" },
        "Ananya Das": { pace: "ahead", note: "Calm under pressure, listens well" },
      },
    ),
    support: [
      { name: "Dev Sharma", reason: "Craft: rebuttal does not answer the point made" },
      { name: "Aarohi Rao", reason: "Craft: repeats rather than responds" },
      { name: "Rehan Khan", reason: "Craft: speaks well but talks over others" },
    ],
    worksheets: [
      {
        title: "They said, I say",
        difficulty: "support",
        targetSkill: "Answer the point made",
        reviewStatus: "approved",
        questions: [
          "Write down the other side's point in your own words.",
          "Now write your answer to that exact point.",
          "Add one example that backs your answer.",
        ],
      },
      {
        title: "Build your case",
        difficulty: "core",
        targetSkill: "Order three arguments",
        reviewStatus: "needs-review",
        questions: [
          "List your three strongest points in order.",
          "For each, note one reason and one example.",
          "Which point will you lead with, and why?",
        ],
      },
    ],
    groups: [
      { groupName: "Motion A — homework", members: ["Dev Sharma", "Karthik Menon", "Tanya Kapoor"] },
      { groupName: "Motion B — screen time", members: ["Aarohi Rao", "Ananya Das", "Armaan Sheikh"] },
      { groupName: "Storytelling circle", members: ["Rehan Khan", "Nandini Hegde", "Aisha Sheikh"] },
    ],
    recentWork: [
      { studentName: "Karthik Menon", title: "Rebuttal on 'ban homework' motion", rating: 5, note: "Answered the exact point the other side made, then turned it. Real clash." },
      { studentName: "Ananya Das", title: "Storytelling — 'The Last Bus Home'", rating: 4, note: "Held the room for four minutes. Pacing and pauses are getting strong." },
      { studentName: "Dev Sharma", title: "Opening speech on screen time", rating: 3, note: "Strong, clear opening. Next step is answering what the other side actually said." },
    ],
  },
  {
    id: "cls-artist-678",
    teacherId: "tp-meghna",
    kind: "path",
    subject: "PATH · Artist",
    topic: "Make a zine, find a voice",
    klass: "Class 6–8 · Atelier",
    room: "Atelier",
    day: "Thu",
    start: "14:15",
    end: "15:15",
    competency: "Shape words and images into a piece with a point of view",
    oneMove: {
      headline: "Two writers describe everything and choose nothing",
      names: ["Tisha", "Saanvi"],
      why: "Their zine pages pack in every detail, so the reader cannot tell what matters most. Choosing one strong image and cutting the rest will sharpen their voice.",
      everyoneElse: "The rest are editing for impact and laying out pages with care.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "Cut to the one strong image",
        detail: "Look at two zine spreads, one cluttered, one spare. Name what the spare one gains by leaving things out.",
        aiNote: "Targets the 'describe everything' habit two writers show.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "Which line stays",
        detail: "Partners read each other's draft and circle the one line that must stay. Everything else is up for cutting.",
        aiNote: "Choosing one line first makes cutting the rest less painful.",
        decision: "accepted",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Make and edit your spread",
        detail: "Writers draft and trim a zine page. Sit with Tisha and Saanvi on choosing one image to lead.",
        aiNote: "Support prompt asks: if you kept only one image, which?",
        decision: "edited",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Gallery walk",
        detail: "Pin up the spreads. Each writer leaves one sticky note naming a page's strongest choice.",
        aiNote: "Quiet, generous close that celebrates editing, not just making.",
        decision: "accepted",
      },
    ],
    roster: roster(
      ["Tisha Nair", "Saanvi Bose", "Kriti Pillai", "Nandini Hegde", "Mahi Kapoor", "Diya Ghosh", "Anaya Iyer", "Zoya Khan", "Aarohi Rao", "Tanya Kapoor", "Sneha Pillai", "Pooja Nair", "Riya Iyer", "Megha Pai", "Ishita Ghosh", "Kabir Pai", "Ayan Verma", "Pranav Joshi", "Rishi Shetty", "Tara Reddy"],
      {
        "Tisha Nair": { pace: "behind", note: "Describes everything, chooses nothing" },
        "Saanvi Bose": { pace: "behind", note: "Pages feel crowded" },
        "Kriti Pillai": { pace: "ahead", note: "Editing for impact already" },
        "Diya Ghosh": { pace: "ahead", note: "Strong sense of layout" },
      },
    ),
    support: [
      { name: "Tisha Nair", reason: "Craft: too many details, no clear focus" },
      { name: "Saanvi Bose", reason: "Craft: pages crowded, voice gets lost" },
      { name: "Anaya Iyer", reason: "Craft: unsure which line to keep" },
    ],
    worksheets: [
      {
        title: "Keep only one",
        difficulty: "support",
        targetSkill: "Choose the strongest image",
        reviewStatus: "approved",
        questions: [
          "If you kept only one image on this page, which?",
          "Why is that the one that matters?",
          "Cross out two details you could lose.",
        ],
      },
      {
        title: "Lay out your spread",
        difficulty: "core",
        targetSkill: "Use space for effect",
        reviewStatus: "needs-review",
        questions: [
          "Sketch where your one strong image will sit.",
          "Where will the reader's eye go first?",
          "What will you leave empty, on purpose?",
        ],
      },
    ],
    groups: [
      { groupName: "Poetry zine", members: ["Tisha Nair", "Kriti Pillai", "Mahi Kapoor"] },
      { groupName: "Comics", members: ["Saanvi Bose", "Diya Ghosh", "Anaya Iyer"] },
      { groupName: "Photo essay", members: ["Nandini Hegde", "Zoya Khan", "Aarohi Rao"] },
    ],
    recentWork: [
      { studentName: "Kriti Pillai", title: "Poetry zine — 'Monsoon, Building 3'", rating: 5, note: "Cut hard to one image per page. The restraint is what makes it sing." },
      { studentName: "Diya Ghosh", title: "Three-panel comic — 'The Late Bell'", rating: 4, note: "Strong layout; the silent panel does a lot of work." },
      { studentName: "Tisha Nair", title: "Photo-and-words spread — market day", rating: 3, note: "Lovely detail, but the page is crowded. This term: choose one image to lead." },
    ],
  },

  /* ---------------------------------------------------------------------- *
   * T3 — Arvind Sundaram · High School · Social Science
   * ---------------------------------------------------------------------- */
  {
    id: "cls-nation-10g",
    teacherId: "tp-arvind",
    kind: "concept",
    subject: "History",
    topic: "Nationalism in India",
    klass: "Class 10 · Ganga",
    room: "Humanities 1",
    day: "Thu",
    start: "09:00",
    end: "10:00",
    competency: "Use sources to explain why the movement grew",
    oneMove: {
      headline: "Three students retell events but skip the why",
      names: ["Ishaan", "Tara", "Rohit"],
      why: "They can list what happened in 1919–22 in order but do not explain why people joined the movement. Linking each event to a cause and a source will lift their answers.",
      everyoneElse: "The rest are weighing causes against each other and citing sources well.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "From timeline to causes",
        detail: "Whole class: take the Rowlatt Act to Non-Cooperation and ask, for each step, why did people join? Pin a cause to each event.",
        aiNote: "Moves the class from narrating events to explaining them — the gap three students show.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "Source or opinion",
        detail: "Pairs sort short quotes into 'evidence from a source' and 'a claim'. Decide what each one proves.",
        aiNote: "Sharpens use of sources before the writing task.",
        decision: "edited",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Explain one cause with evidence",
        detail: "Students write a paragraph on why the movement grew, using one source. Pull Ishaan, Tara and Rohit to add the 'why'.",
        aiNote: "Support sheet gives a cause–evidence sentence frame.",
        decision: "pending",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Rank the causes",
        detail: "Small groups rank three causes by importance and defend their order to the class.",
        aiNote: "Disagreement is the point; there is no single right order.",
        decision: "accepted",
      },
    ],
    roster: roster(
      ["Ishaan Pillai", "Tara Menon", "Rohit Das", "Ananya Rao", "Vikram Nair", "Sneha Iyer", "Aman Sheikh", "Priya Hegde", "Karan Gupta", "Divya Bose", "Aditya Shetty", "Nisha Joshi", "Rahul Kapoor", "Pooja Verma", "Siddharth Ghosh", "Anjali Pai", "Varun Reddy", "Kavya Sharma", "Naveen Menon", "Riya Kulkarni"],
      {
        "Ishaan Pillai": { pace: "behind", note: "Narrates events, skips the why" },
        "Tara Menon": { pace: "behind", note: "Lists causes without evidence" },
        "Rohit Das": { pace: "behind", note: "Strong recall, weak explanation" },
        "Ananya Rao": { pace: "ahead", note: "Weighs causes against each other" },
        "Vikram Nair": { pace: "ahead", note: "Cites sources confidently" },
      },
    ),
    support: [
      { name: "Ishaan Pillai", reason: "Last answer: told the story, did not explain causes" },
      { name: "Tara Menon", reason: "Causes stated without a source" },
      { name: "Rohit Das", reason: "Explanation step not secure yet" },
    ],
    worksheets: [
      {
        title: "Cause and evidence frame",
        difficulty: "support",
        targetSkill: "Link a cause to a source",
        reviewStatus: "approved",
        questions: [
          "Pick one event. Why did people join after it?",
          "Quote one source that supports your reason.",
          "Finish: People joined because… as shown by…",
        ],
      },
      {
        title: "Explain why the movement grew",
        difficulty: "core",
        targetSkill: "Build a causal paragraph",
        reviewStatus: "needs-review",
        questions: [
          "Write a paragraph on one cause of the movement's growth.",
          "Use at least one source as evidence.",
          "End with how this cause linked to another.",
        ],
      },
      {
        title: "Weigh the causes",
        difficulty: "stretch",
        targetSkill: "Compare causes",
        reviewStatus: "approved",
        questions: [
          "Which cause was most important? Argue your choice.",
          "Which source best supports your view?",
          "How might someone argue the opposite?",
        ],
      },
    ],
  },
  {
    id: "cls-civics-9n",
    teacherId: "tp-arvind",
    kind: "concept",
    subject: "Civics",
    topic: "How democracies work",
    klass: "Class 9 · Narmada",
    room: "Humanities 2",
    day: "Thu",
    start: "10:15",
    end: "11:15",
    competency: "Explain how a decision is made in a democracy",
    oneMove: {
      headline: "Three students mix up the three branches",
      names: ["Aman", "Divya", "Karan"],
      why: "They swap what the legislature, executive and judiciary each do, so the path a law takes gets muddled. A clear 'who does what' map will steady this.",
      everyoneElse: "The rest can trace a bill into law and are ready to debate a real case.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "Who does what",
        detail: "Whole class: build a simple map of the three branches and what each one does, then trace a law from idea to act.",
        aiNote: "Targets the exact mix-up three students make about the branches.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "Sort the powers",
        detail: "Pairs sort role cards (makes laws, carries them out, settles disputes) under the right branch.",
        aiNote: "Hands-on sort makes the boundaries concrete.",
        decision: "accepted",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Trace a decision",
        detail: "Students write how one real decision was made, naming each branch's part. Pull Aman, Divya and Karan to the map.",
        aiNote: "Support sheet gives the three branches as labelled boxes to fill.",
        decision: "pending",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Spot the overreach",
        detail: "Short scenarios: which branch has stepped on another's job? Quick group calls.",
        aiNote: "Introduces checks and balances without the jargon.",
        decision: "edited",
      },
    ],
    roster: roster(
      ["Aman Sheikh", "Divya Bose", "Karan Gupta", "Sneha Iyer", "Vikram Nair", "Priya Hegde", "Aditya Shetty", "Nisha Joshi", "Rahul Kapoor", "Pooja Verma", "Ishaan Pillai", "Tara Menon", "Siddharth Ghosh", "Anjali Pai", "Varun Reddy", "Kavya Sharma", "Naveen Menon", "Riya Kulkarni", "Rohit Das", "Ananya Rao"],
      {
        "Aman Sheikh": { pace: "behind", note: "Swaps legislature and executive" },
        "Divya Bose": { pace: "behind", note: "Unsure what the judiciary does" },
        "Karan Gupta": { pace: "behind", note: "Muddles the path of a law" },
        "Sneha Iyer": { pace: "ahead", note: "Traces a bill into law cleanly" },
        "Vikram Nair": { pace: "ahead", note: "Ready to debate a real case" },
      },
    ),
    support: [
      { name: "Aman Sheikh", reason: "Last task: mixed up two of the three branches" },
      { name: "Divya Bose", reason: "Judiciary's role not clear yet" },
      { name: "Karan Gupta", reason: "Path of a law not secure" },
    ],
    worksheets: [
      {
        title: "Three branches, labelled boxes",
        difficulty: "support",
        targetSkill: "Name what each branch does",
        reviewStatus: "approved",
        questions: [
          "Write one job in each box: legislature, executive, judiciary.",
          "Which branch makes the laws?",
          "Which branch settles disputes about them?",
        ],
      },
      {
        title: "Trace a decision",
        difficulty: "core",
        targetSkill: "Follow a law's path",
        reviewStatus: "approved",
        questions: [
          "Pick a decision. Who proposed it?",
          "Who approved it, and who carries it out?",
          "Where could a court step in?",
        ],
      },
      {
        title: "Checks and balances",
        difficulty: "stretch",
        targetSkill: "Explain a check on power",
        reviewStatus: "needs-review",
        questions: [
          "Give one way a branch can check another.",
          "Why does that matter for fairness?",
          "Read the scenario: which branch overstepped?",
        ],
      },
    ],
  },
  {
    id: "cls-resource-9y",
    teacherId: "tp-arvind",
    kind: "concept",
    subject: "Geography",
    topic: "Resources and development",
    klass: "Class 9 · Yamuna",
    room: "Humanities 3",
    day: "Thu",
    start: "11:30",
    end: "12:30",
    competency: "Read a resource map and link it to development",
    oneMove: {
      headline: "Three students read the map but miss the pattern",
      names: ["Priya", "Aditya", "Nisha"],
      why: "They can find a symbol on the resource map but do not yet link where resources sit to where industry grows. A 'why here?' question over the map will build that link.",
      everyoneElse: "The rest are connecting resources to development and are ready to weigh costs.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "Why here, not there",
        detail: "Whole class: lay a resource map beside an industry map and ask why factories cluster where they do.",
        aiNote: "Pushes from reading symbols to reading patterns — the gap three students show.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "Match resource to place",
        detail: "Pairs match resource cards to regions and say one reason industry might grow there.",
        aiNote: "Builds the resource-to-development link before writing.",
        decision: "accepted",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Read the pattern",
        detail: "Students answer map questions that ask 'why here?'. Pull Priya, Aditya and Nisha to read patterns, not just points.",
        aiNote: "Support sheet pairs each map question with a 'because…' line.",
        decision: "pending",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Where would you build it",
        detail: "Groups pick a spot on the map for a new factory and defend it using the resources nearby.",
        aiNote: "Turns the map into a decision, with trade-offs.",
        decision: "edited",
      },
    ],
    roster: roster(
      ["Priya Hegde", "Aditya Shetty", "Nisha Joshi", "Vikram Nair", "Sneha Iyer", "Aman Sheikh", "Divya Bose", "Karan Gupta", "Rahul Kapoor", "Pooja Verma", "Siddharth Ghosh", "Anjali Pai", "Varun Reddy", "Kavya Sharma", "Naveen Menon", "Riya Kulkarni", "Ishaan Pillai", "Tara Menon", "Rohit Das", "Ananya Rao"],
      {
        "Priya Hegde": { pace: "behind", note: "Reads symbols, misses the pattern" },
        "Aditya Shetty": { pace: "behind", note: "Finds points, not links" },
        "Nisha Joshi": { pace: "behind", note: "Unsure why industry clusters" },
        "Vikram Nair": { pace: "ahead", note: "Links resources to development" },
        "Sneha Iyer": { pace: "ahead", note: "Ready to weigh costs and benefits" },
      },
    ),
    support: [
      { name: "Priya Hegde", reason: "Last map task: read the symbol, not the pattern" },
      { name: "Aditya Shetty", reason: "Did not link resource to industry" },
      { name: "Nisha Joshi", reason: "Pattern-reading not secure yet" },
    ],
    worksheets: [
      {
        title: "Read the map, then say why",
        difficulty: "support",
        targetSkill: "Link a symbol to a reason",
        reviewStatus: "approved",
        questions: [
          "Find the coal symbol. Which region is it in?",
          "Why might steel factories grow near coal?",
          "Finish: Industry is here because…",
        ],
      },
      {
        title: "Resources and where they lead",
        difficulty: "core",
        targetSkill: "Connect resource and development",
        reviewStatus: "needs-review",
        questions: [
          "Name two resources and one industry each supports.",
          "Why do ports help some industries grow?",
          "Pick a region. Why is it developed the way it is?",
        ],
      },
      {
        title: "Weigh the costs",
        difficulty: "stretch",
        targetSkill: "Judge a trade-off",
        reviewStatus: "approved",
        questions: [
          "What is gained when a region uses its resources fast?",
          "What might be lost?",
          "Would you build here? Defend your choice.",
        ],
      },
    ],
  },
  {
    id: "cls-explorer-910",
    teacherId: "tp-arvind",
    kind: "path",
    subject: "PATH · Explorer",
    topic: "Field study, real questions",
    klass: "Class 9–10 · Field",
    room: "Field Base",
    day: "Thu",
    start: "13:00",
    end: "14:00",
    competency: "Ask a real question and gather evidence to answer it",
    oneMove: {
      headline: "Two explorers gather data with no clear question",
      names: ["Karan", "Anjali"],
      why: "Both collect lots of field notes but have not set a question first, so the data has no centre. Helping them write one sharp question will focus the whole study.",
      everyoneElse: "The rest have a question and are testing it against what they find.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "A question worth answering",
        detail: "Look at two field projects: one with a sharp question, one without. Name what the focused one can do that the other cannot.",
        aiNote: "Targets the 'data with no question' habit two explorers show.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "Sharpen the question",
        detail: "Partners turn a broad topic into one answerable question, then test if their data could answer it.",
        aiNote: "A narrower question is almost always the better one.",
        decision: "accepted",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Plan or sort your study",
        detail: "Explorers write their question and sort evidence under it. Sit with Karan and Anjali on framing the question.",
        aiNote: "Support card gives a 'I want to find out whether…' starter.",
        decision: "edited",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Question swap",
        detail: "Swap questions with another pair and suggest one way to make it sharper or more answerable.",
        aiNote: "Peer feedback that targets the question, not the topic.",
        decision: "accepted",
      },
    ],
    roster: roster(
      ["Karan Gupta", "Anjali Pai", "Vikram Nair", "Sneha Iyer", "Ananya Rao", "Priya Hegde", "Siddharth Ghosh", "Kavya Sharma", "Varun Reddy", "Naveen Menon", "Aditya Shetty", "Nisha Joshi", "Riya Kulkarni", "Rahul Kapoor", "Pooja Verma", "Aman Sheikh", "Divya Bose", "Ishaan Pillai", "Tara Menon", "Rohit Das"],
      {
        "Karan Gupta": { pace: "behind", note: "Collects data with no question" },
        "Anjali Pai": { pace: "behind", note: "Broad topic, no focus yet" },
        "Vikram Nair": { pace: "ahead", note: "Tests his question against findings" },
        "Sneha Iyer": { pace: "ahead", note: "Strong, answerable question" },
      },
    ),
    support: [
      { name: "Karan Gupta", reason: "Craft: gathering data before setting a question" },
      { name: "Anjali Pai", reason: "Craft: question still too broad" },
      { name: "Siddharth Ghosh", reason: "Craft: question and data not yet linked" },
    ],
    worksheets: [
      {
        title: "One sharp question",
        difficulty: "support",
        targetSkill: "Frame an answerable question",
        reviewStatus: "approved",
        questions: [
          "Finish: I want to find out whether…",
          "Could the notes you have answer it? If not, what is missing?",
          "Make your question one step narrower.",
        ],
      },
      {
        title: "Sort evidence under your question",
        difficulty: "core",
        targetSkill: "Match evidence to a question",
        reviewStatus: "needs-review",
        questions: [
          "Write your question at the top.",
          "List which notes help answer it.",
          "What would change your answer?",
        ],
      },
    ],
    groups: [
      { groupName: "Lake water study", members: ["Karan Gupta", "Vikram Nair", "Siddharth Ghosh"] },
      { groupName: "Market survey", members: ["Anjali Pai", "Sneha Iyer", "Kavya Sharma"] },
      { groupName: "Traffic and noise", members: ["Ananya Rao", "Varun Reddy", "Naveen Menon"] },
    ],
    recentWork: [
      { studentName: "Sneha Iyer", title: "Does the lake smell worse after rain? — field notes", rating: 5, note: "Two weeks of observation, a real hypothesis, and a revision when the first guess failed." },
      { studentName: "Vikram Nair", title: "Where do shoppers come from? — market map", rating: 4, note: "Sharp question; clear way of recording. Next step is reading the pattern in the data." },
      { studentName: "Karan Gupta", title: "Lake-edge plant survey, notes", rating: 3, note: "Lots of careful notes, but no question yet. This term: set the question first." },
    ],
  },
  {
    id: "cls-mun-910",
    teacherId: "tp-arvind",
    kind: "path",
    subject: "PATH · Scholar",
    topic: "Model UN — argue a position",
    klass: "Class 9–10 · Council",
    room: "Council Room",
    day: "Thu",
    start: "14:15",
    end: "15:15",
    competency: "Hold a country's position and negotiate with evidence",
    oneMove: {
      headline: "Two delegates argue their view, not their country's",
      names: ["Ananya", "Varun"],
      why: "Both make strong points but slip into their own opinion instead of their assigned country's position. A quick position brief on the desk will keep them in role.",
      everyoneElse: "The rest are staying in role and building alliances with evidence.",
    },
    plan: [
      {
        kind: "Instruction",
        minutes: 20,
        title: "Speak for your country",
        detail: "Watch a short clip of a delegate who stays in role and one who slips. Name how you can tell the difference.",
        aiNote: "Targets the 'my view, not my country's' slip two delegates make.",
        decision: "accepted",
      },
      {
        kind: "1:1 Talk-buddy",
        minutes: 10,
        title: "In role, with evidence",
        detail: "Pairs state their country's position on one issue and back it with one fact from the brief.",
        aiNote: "Pairs matched across opposing blocs to surface real clash.",
        decision: "accepted",
      },
      {
        kind: "Self-work",
        minutes: 20,
        title: "Write your position speech",
        detail: "Delegates draft a one-minute position speech. Sit with Ananya and Varun to keep them in their country's voice.",
        aiNote: "Support brief highlights the country's three core interests.",
        decision: "edited",
      },
      {
        kind: "Activity",
        minutes: 10,
        title: "Two-bloc negotiation",
        detail: "Two blocs try to agree one line of a resolution. Each gives one thing to get one thing.",
        aiNote: "Negotiation, not debate — the win is a shared line.",
        decision: "accepted",
      },
    ],
    roster: roster(
      ["Ananya Rao", "Varun Reddy", "Vikram Nair", "Sneha Iyer", "Siddharth Ghosh", "Kavya Sharma", "Naveen Menon", "Riya Kulkarni", "Priya Hegde", "Aditya Shetty", "Karan Gupta", "Anjali Pai", "Rahul Kapoor", "Pooja Verma", "Aman Sheikh", "Divya Bose", "Nisha Joshi", "Ishaan Pillai", "Tara Menon", "Rohit Das"],
      {
        "Ananya Rao": { pace: "behind", note: "Argues her own view, not the country's" },
        "Varun Reddy": { pace: "behind", note: "Slips out of role under pressure" },
        "Vikram Nair": { pace: "ahead", note: "Stays in role, builds alliances" },
        "Sneha Iyer": { pace: "ahead", note: "Negotiates with evidence" },
      },
    ),
    support: [
      { name: "Ananya Rao", reason: "Craft: own opinion replaces country's position" },
      { name: "Varun Reddy", reason: "Craft: leaves role when challenged" },
      { name: "Siddharth Ghosh", reason: "Craft: position not backed with evidence" },
    ],
    worksheets: [
      {
        title: "Your country's three interests",
        difficulty: "support",
        targetSkill: "Stay in role",
        reviewStatus: "approved",
        questions: [
          "Name your country's three core interests.",
          "On this issue, what would your country say?",
          "Which fact from the brief backs that?",
        ],
      },
      {
        title: "Draft a position speech",
        difficulty: "core",
        targetSkill: "Argue a set position",
        reviewStatus: "needs-review",
        questions: [
          "Open with your country's stance in one line.",
          "Give two reasons drawn from the brief.",
          "End with what you want the council to do.",
        ],
      },
    ],
    groups: [
      { groupName: "Bloc — Water rights", members: ["Ananya Rao", "Vikram Nair", "Kavya Sharma"] },
      { groupName: "Bloc — Trade", members: ["Varun Reddy", "Sneha Iyer", "Naveen Menon"] },
      { groupName: "Chairing & notes", members: ["Siddharth Ghosh", "Riya Kulkarni", "Priya Hegde"] },
    ],
    recentWork: [
      { studentName: "Vikram Nair", title: "Position speech — water-sharing motion", rating: 5, note: "Held his country's line and still found common ground. Real diplomacy." },
      { studentName: "Sneha Iyer", title: "Brokered one line of the resolution", rating: 4, note: "Gave one point to win another. Strong negotiation instinct." },
      { studentName: "Ananya Rao", title: "Opening statement — trade bloc", rating: 3, note: "Clear and confident, but drifted into her own view. This term: stay in role." },
    ],
  },
];

/* ============================================================================
   HELPERS
   ========================================================================== */
export function classesForTeacher(teacherId: string): TeacherClass[] {
  return teacherClasses.filter((c) => c.teacherId === teacherId);
}

export function classById(classId: string): TeacherClass | undefined {
  return teacherClasses.find((c) => c.id === classId);
}

export const conceptClasses = teacherClasses.filter((c) => c.kind === "concept");
export const pathClasses = teacherClasses.filter((c) => c.kind === "path");

/* ============================================================================
   ACTION INBOX — unified pending actions across all three teachers
   ========================================================================== */
export type InboxColumn = "needs-you" | "in-progress" | "cleared";
export type InboxKind =
  | "worksheet"
  | "low-confidence"
  | "parent"
  | "coach"
  | "path-artifact";

export interface InboxItem {
  id: string;
  teacherId: string;
  column: InboxColumn;
  kind: InboxKind;
  title: string;
  detail: string;
  when: string; // human relative phrase
  classId?: string; // link back to a class where it helps
  action: string; // the verb on the control, e.g. "Approve worksheet"
}

export const inboxItems: InboxItem[] = [
  // --- Lakshmi ---
  {
    id: "inb-l1",
    teacherId: "tp-lakshmi",
    column: "needs-you",
    kind: "worksheet",
    title: "Approve the support sheet for equal fractions",
    detail: "Built from yesterday's scans for Riya, Kabir, Diya and Ishaan. It keeps the numbers small and works from the fraction wall. Your okay sends it out for the 09:00 block.",
    when: "Ready since last night",
    classId: "cls-frac-5k",
    action: "Approve worksheet",
  },
  {
    id: "inb-l2",
    teacherId: "tp-lakshmi",
    column: "needs-you",
    kind: "low-confidence",
    title: "Check a mark the system is unsure about",
    detail: "Ishaan's last sheet was hard to read where he crossed out his working. The system marked it low-confidence and would like your eye before it counts.",
    when: "Flagged this morning",
    classId: "cls-frac-5k",
    action: "Confirm the mark",
  },
  {
    id: "inb-l3",
    teacherId: "tp-lakshmi",
    column: "in-progress",
    kind: "path-artifact",
    title: "Rate Kabir's pulley lift",
    detail: "First working version after two failed tries. You started a note last session; finish the rating to track how his craft is rising.",
    when: "Started yesterday",
    classId: "cls-builder-45",
    action: "Finish the rating",
  },
  {
    id: "inb-l4",
    teacherId: "tp-lakshmi",
    column: "cleared",
    kind: "parent",
    title: "Replied to Riya's mother",
    detail: "She asked how Riya is doing with fractions. You shared the plan for the small group this week and said you would update her on Friday.",
    when: "Cleared yesterday",
    action: "View reply",
  },
  // --- Meghna ---
  {
    id: "inb-m1",
    teacherId: "tp-meghna",
    column: "needs-you",
    kind: "parent",
    title: "Reply to Aditi's father",
    detail: "He has noticed her stories jump between past and present and asks how to help at home. A short note about reading drafts aloud together would go a long way.",
    when: "2 days waiting",
    classId: "cls-tense-7n",
    action: "Write a reply",
  },
  {
    id: "inb-m2",
    teacherId: "tp-meghna",
    column: "needs-you",
    kind: "worksheet",
    title: "Approve the persuasive-paragraph frame",
    detail: "A support sheet giving Rehan, Sara and Ojas a point–reason–example frame. Your okay adds it to today's 10:15 block.",
    when: "Ready this morning",
    classId: "cls-persuade-8y",
    action: "Approve worksheet",
  },
  {
    id: "inb-m3",
    teacherId: "tp-meghna",
    column: "in-progress",
    kind: "low-confidence",
    title: "Review a borderline inference mark",
    detail: "Aryan's answer used a clue but also copied a line. The system was unsure whether to count it as inference. You opened it; a quick decision will settle it.",
    when: "Opened today",
    classId: "cls-infer-6k",
    action: "Decide the mark",
  },
  {
    id: "inb-m4",
    teacherId: "tp-meghna",
    column: "cleared",
    kind: "path-artifact",
    title: "Rated Kriti's poetry zine",
    detail: "Marked it a 5 for how hard she cut to one image per page. Note saved to her PATH record.",
    when: "Cleared 2 days ago",
    action: "View rating",
  },
  // --- Arvind ---
  {
    id: "inb-a1",
    teacherId: "tp-arvind",
    column: "needs-you",
    kind: "coach",
    title: "Read a hand-off note from the coach",
    detail: "Rohan has flagged that Ishaan's confidence dipped after a hard practice paper. He suggests easing the next History task and naming one thing Ishaan did well.",
    when: "Sent this morning",
    classId: "cls-nation-10g",
    action: "Acknowledge note",
  },
  {
    id: "inb-a2",
    teacherId: "tp-arvind",
    column: "needs-you",
    kind: "worksheet",
    title: "Approve the causal-paragraph sheet",
    detail: "A core sheet for Nationalism asking students to back one cause with a source. Marked needs-review because two questions were rephrased overnight.",
    when: "Ready since last night",
    classId: "cls-nation-10g",
    action: "Approve worksheet",
  },
  {
    id: "inb-a3",
    teacherId: "tp-arvind",
    column: "in-progress",
    kind: "path-artifact",
    title: "Rate Ananya's MUN opening",
    detail: "Clear and confident, but she drifted into her own view. You began a note on staying in role; finish it to log this term's focus.",
    when: "Started yesterday",
    classId: "cls-mun-910",
    action: "Finish the rating",
  },
  {
    id: "inb-a4",
    teacherId: "tp-arvind",
    column: "cleared",
    kind: "worksheet",
    title: "Approved the resource-map stretch sheet",
    detail: "The trade-off sheet for Class 9 Yamuna is okayed and queued for the 11:30 block.",
    when: "Cleared this morning",
    action: "View worksheet",
  },
];

export function inboxForTeacher(teacherId: string): InboxItem[] {
  return inboxItems.filter((i) => i.teacherId === teacherId);
}
