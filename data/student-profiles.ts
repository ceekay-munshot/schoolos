import { studentById } from "@/data";
import type { Student } from "@/data/types";

/* ============================================================================
   Student OS — the three learner profiles behind the desktop dashboard.

   One typed shape (StudentProfile) carries everything a child sees: a warm
   greeting, their week at a glance, the lesson their teacher planned for the
   current class, the work they uploaded with a plain-language AI observation
   on each, and — for middle and high — a guard-railed practice thread with the
   AI tutor on the topic just taught.

   • Riya Iyer    — Class 5 · Kaveri   (elementary)  — hasTutor: false
   • Mahira Qureshi — Class 6 · Yamuna (middle)      — hasTutor: true
   • Aditya Varghese — Class 10 · Ganga (high)       — hasTutor: true

   Today is treated as Thursday, 18 June 2026.

   Mahira's rich tutor/learn content already lives in data/student-extra.ts and
   is reused there — it is not duplicated here.
   ========================================================================== */

/* ---- a half-day, one row per weekday ---- */
export type ScheduleKind = "concept" | "path";

export interface ScheduleBlock {
  start: string; // "08:30"
  end: string; // "09:20"
  kind: ScheduleKind;
  label: string; // "Mathematics" · "PATH · Scholar"
  room: string;
  topic: string; // the day's focus, in a child's words
}

export interface DaySchedule {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
  date: string; // "16 Jun" — the short label under the day
  blocks: ScheduleBlock[];
}

/* ---- the lesson the teacher planned for the class happening now ---- */
export interface LessonStep {
  title: string;
  minutes: number;
  detail: string;
}

export interface CurrentClass {
  subject: string;
  topic: string;
  teacherName: string;
  room: string;
  time: string;
  /** the teacher's plan, shown read-only and warmly */
  plan: LessonStep[];
  /** a short note from the teacher to the class, in their own voice */
  prepNote: string;
}

/* ---- past work, each piece with one encouraging AI observation ---- */
export interface PastWorkItem {
  id: string;
  title: string;
  date: string; // "16 June"
  subject: string;
  /** a plain, encouraging observation tied to real evidence */
  aiInsight: string;
  /** the evidence the observation is grounded in */
  evidence: string;
}

/* ---- the guard-railed tutor practice thread (middle & high only) ---- */
export interface TutorTurn {
  from: "tutor" | "student";
  text: string;
}

export interface TutorSection {
  topic: string;
  taughtBy: string;
  /** the one-line rail that bounds what the tutor is for */
  rail: string;
  thread: TutorTurn[];
  /** the judgment the tutor explicitly hands back to the teacher */
  defersToTeacher: string;
}

export interface StudentProfile {
  id: string;
  /** resolved identity, pulled from the shared roster where it exists */
  name: string;
  grade: string;
  gradeNum: number;
  house: string;
  stage: Student["stage"];
  /** middle & high have the AI tutor; elementary is paper-first */
  hasTutor: boolean;
  /** a warm, first-name greeting line for today */
  greeting: string;
  /** today's date label */
  todayLabel: string;
  /** the one-line "today" intention */
  todayLine: string;
  schedule: DaySchedule[];
  currentClass: CurrentClass;
  pastWork: PastWorkItem[];
  /** present only when hasTutor is true */
  tutor?: TutorSection;
}

/* Helper: pull shared identity from the roster, fall back to local values for
   the high-school student who is defined here. */
function identity(
  id: string,
  fallback: { name: string; grade: string; gradeNum: number; house: string; stage: Student["stage"] },
) {
  const s = studentById(id);
  return {
    id,
    name: s?.name ?? fallback.name,
    grade: s?.grade ?? fallback.grade,
    gradeNum: s?.gradeNum ?? fallback.gradeNum,
    house: s?.house ?? fallback.house,
    stage: s?.stage ?? fallback.stage,
  };
}

/* ===========================================================================
   RIYA IYER — Class 5 · Kaveri (elementary). Paper-first: no AI tutor yet.
   Her maths story is the equivalent-fractions gap, so her week and her work
   sit honestly around that — building the picture before the rule.
   ========================================================================= */
const riya: StudentProfile = {
  ...identity("stu-riya", {
    name: "Riya Iyer",
    grade: "Class 5",
    gradeNum: 5,
    house: "Kaveri",
    stage: "elementary",
  }),
  hasTutor: false,
  greeting: "Hi Riya",
  todayLabel: "Thursday · 18 June 2026",
  todayLine: "A good day for fractions — we draw the pieces first, then count them.",
  schedule: [
    {
      day: "Mon",
      date: "15 Jun",
      blocks: [
        { start: "08:30", end: "09:20", kind: "concept", label: "Mathematics", room: "Kaveri Room", topic: "Equal parts of a whole" },
        { start: "09:25", end: "10:15", kind: "concept", label: "English", room: "Kaveri Room", topic: "Reading aloud — 'The Kite'" },
        { start: "11:30", end: "12:40", kind: "path", label: "PATH · Artist", room: "Atelier", topic: "Madhubani — first ink lines" },
      ],
    },
    {
      day: "Tue",
      date: "16 Jun",
      blocks: [
        { start: "08:30", end: "09:20", kind: "concept", label: "Mathematics", room: "Kaveri Room", topic: "Same fraction, drawn two ways" },
        { start: "09:25", end: "10:15", kind: "concept", label: "EVS", room: "Discovery Lab", topic: "Where our water comes from" },
        { start: "11:30", end: "12:40", kind: "path", label: "PATH · Explorer", room: "Garden", topic: "Watching the bean seeds" },
      ],
    },
    {
      day: "Wed",
      date: "17 Jun",
      blocks: [
        { start: "08:30", end: "09:20", kind: "concept", label: "Mathematics", room: "Kaveri Room", topic: "Halves and quarters together" },
        { start: "09:25", end: "10:15", kind: "concept", label: "Hindi", room: "Kaveri Room", topic: "मात्रा practice" },
        { start: "11:30", end: "12:40", kind: "path", label: "PATH · Artist", room: "Atelier", topic: "Adding colour to the fish" },
      ],
    },
    {
      day: "Thu",
      date: "18 Jun",
      blocks: [
        { start: "08:30", end: "09:20", kind: "concept", label: "Mathematics", room: "Kaveri Room", topic: "Equivalent fractions — the picture" },
        { start: "09:25", end: "10:15", kind: "concept", label: "English", room: "Kaveri Room", topic: "Writing about a small moment" },
        { start: "11:30", end: "12:40", kind: "path", label: "PATH · Explorer", room: "Garden", topic: "Measuring how tall the beans grew" },
      ],
    },
    {
      day: "Fri",
      date: "19 Jun",
      blocks: [
        { start: "08:30", end: "09:20", kind: "concept", label: "Mathematics", room: "Kaveri Room", topic: "A small quiz, together on paper" },
        { start: "09:25", end: "10:15", kind: "concept", label: "Library", room: "Reading Room", topic: "Choose your weekend book" },
        { start: "11:30", end: "12:40", kind: "path", label: "PATH · Artist", room: "Atelier", topic: "Finishing the Madhubani fish" },
      ],
    },
  ],
  currentClass: {
    subject: "Mathematics",
    topic: "Equivalent fractions — the picture",
    teacherName: "Ms. Lakshmi Krishnan",
    room: "Kaveri Room",
    time: "8:30 am",
    plan: [
      {
        title: "Fold the paper strip",
        minutes: 10,
        detail: "Take one paper strip. Fold it in half, then in half again. See how one-half is the same space as two-quarters.",
      },
      {
        title: "Colour and compare",
        minutes: 15,
        detail: "Colour one-half on the first strip and two-quarters on the second. Hold them side by side. Same amount, different pieces.",
      },
      {
        title: "Draw it in your book",
        minutes: 15,
        detail: "Copy the two strips into your maths book. Write under them: 1/2 = 2/4. Say it out loud to your partner.",
      },
      {
        title: "Show your partner",
        minutes: 10,
        detail: "Find one more pair that matches, like one-half and three-sixths. Show your partner how you know.",
      },
    ],
    prepNote:
      "Today we will fold paper strips to see that one-half and two-quarters cover the very same space. Bring your safety scissors and a sharp pencil. No rush — we are looking, not racing.",
  },
  pastWork: [
    {
      id: "rw-1",
      title: "Fraction strips — halves and quarters",
      date: "17 June",
      subject: "Mathematics",
      aiInsight:
        "You shaded every strip into truly equal parts this week — no eyeballing. That careful habit is exactly what makes the next step, matching fractions, much easier.",
      evidence: "Wednesday's strip worksheet · all 6 strips divided equally",
    },
    {
      id: "rw-2",
      title: "Madhubani fish — ink lines",
      date: "16 June",
      subject: "PATH · Artist",
      aiInsight:
        "Your fish lines are getting steadier and more confident. A real Madhubani hand is starting to show in how you fill the border.",
      evidence: "Atelier · first ink pass, photographed",
    },
    {
      id: "rw-3",
      title: "Reading aloud — 'The Kite'",
      date: "16 June",
      subject: "English",
      aiInsight:
        "You paused at every full stop when you read aloud. That makes the story easy to follow — keep letting the punctuation guide you.",
      evidence: "Monday reading circle · teacher note",
    },
    {
      id: "rw-4",
      title: "Bean seed observation",
      date: "16 June",
      subject: "PATH · Explorer",
      aiInsight:
        "You drew exactly what you saw, not what you expected — even the bent little shoot. Careful noticing like this is what good explorers do first.",
      evidence: "Garden journal · Tuesday entry",
    },
  ],
  // no tutor — paper-first for young children
};

/* ===========================================================================
   MAHIRA QURESHI — Class 6 · Yamuna (middle). Has the AI tutor. Her rich
   learn / practice content lives in data/student-extra.ts and is surfaced from
   there; the tutor thread below is a short guard-railed exchange on the same
   just-taught node (fraction word problems · the bar model).
   ========================================================================= */
const mahira: StudentProfile = {
  ...identity("stu-mahira", {
    name: "Mahira Qureshi",
    grade: "Class 6",
    gradeNum: 6,
    house: "Yamuna",
    stage: "middle",
  }),
  hasTutor: true,
  greeting: "Hi Mahira",
  todayLine: "One thing to get sharper at today — on the fractions you just learnt.",
  todayLabel: "Thursday · 18 June 2026",
  schedule: [
    {
      day: "Mon",
      date: "15 Jun",
      blocks: [
        { start: "08:30", end: "09:30", kind: "concept", label: "Mathematics", room: "Yamuna Room", topic: "Equivalent fractions, revisited" },
        { start: "09:35", end: "10:25", kind: "concept", label: "Science", room: "Science Lab 1", topic: "Separating mixtures" },
        { start: "11:40", end: "13:00", kind: "path", label: "PATH · Scholar", room: "Seminar Room", topic: "Olympiad warm-ups" },
      ],
    },
    {
      day: "Tue",
      date: "16 Jun",
      blocks: [
        { start: "08:30", end: "09:30", kind: "concept", label: "Mathematics", room: "Yamuna Room", topic: "Comparing unlike fractions" },
        { start: "09:35", end: "10:25", kind: "concept", label: "English", room: "Yamuna Room", topic: "Endings that land" },
        { start: "11:40", end: "13:00", kind: "path", label: "PATH · Artist", room: "Printmaking Studio", topic: "Carving the lino block" },
      ],
    },
    {
      day: "Wed",
      date: "17 Jun",
      blocks: [
        { start: "08:30", end: "09:30", kind: "concept", label: "Mathematics", room: "Yamuna Room", topic: "Fractions of a quantity — intro" },
        { start: "09:35", end: "10:25", kind: "concept", label: "Social Science", room: "Yamuna Room", topic: "Rivers of India" },
        { start: "11:40", end: "13:00", kind: "path", label: "PATH · Scholar", room: "Seminar Room", topic: "'The Fraction Around You' project" },
      ],
    },
    {
      day: "Thu",
      date: "18 Jun",
      blocks: [
        { start: "08:30", end: "09:30", kind: "concept", label: "Mathematics", room: "Yamuna Room", topic: "Fraction word problems — the bar model" },
        { start: "09:35", end: "10:25", kind: "concept", label: "Science", room: "Science Lab 1", topic: "Filtration in everyday life" },
        { start: "11:40", end: "13:00", kind: "path", label: "PATH · Artist", room: "Printmaking Studio", topic: "First print pull" },
        { start: "14:10", end: "14:55", kind: "concept", label: "Practice time", room: "Yamuna Room", topic: "Tutor practice — bar-model word problems" },
      ],
    },
    {
      day: "Fri",
      date: "19 Jun",
      blocks: [
        { start: "08:30", end: "09:30", kind: "concept", label: "Mathematics", room: "Yamuna Room", topic: "Word problems — mixed practice" },
        { start: "09:35", end: "10:25", kind: "concept", label: "English", room: "Yamuna Room", topic: "Reading a short story" },
        { start: "11:40", end: "13:00", kind: "path", label: "PATH · Scholar", room: "Seminar Room", topic: "Test a problem on a classmate" },
      ],
    },
  ],
  currentClass: {
    subject: "Mathematics",
    topic: "Fraction word problems — the bar model",
    teacherName: "Ms. Lakshmi Krishnan",
    room: "Yamuna Room",
    time: "8:30 am",
    plan: [
      {
        title: "Read the problem twice",
        minutes: 8,
        detail: "Read it once for the story, once for the numbers. Underline the whole amount and the fraction you are asked for.",
      },
      {
        title: "Draw the bar before any sums",
        minutes: 14,
        detail: "Draw one bar for the whole amount. The bottom number tells you how many equal parts to split it into. Do this before touching the numbers.",
      },
      {
        title: "Take the parts you need",
        minutes: 14,
        detail: "The top number tells you how many parts to shade and add up. Circle your answer and label what it means.",
      },
      {
        title: "Swap and check",
        minutes: 9,
        detail: "Trade books with a partner. Can you follow their bar model without them explaining it? If not, where does it get confusing?",
      },
    ],
    prepNote:
      "Today we will turn fraction word problems into bar models — the picture before the numbers, every single time. Bring your ruler so the bars come out neat. If you get stuck, draw first and the numbers will follow.",
  },
  pastWork: [
    {
      id: "mw-1",
      title: "Bar-model word problems — set A",
      date: "17 June",
      subject: "Mathematics",
      aiInsight:
        "You set up the bar model first every single time this week — before reaching for the numbers. That one habit is exactly what is making these word problems click.",
      evidence: "Wednesday's practice · 5 of 6 with a bar model drawn first",
    },
    {
      id: "mw-2",
      title: "Comparing unlike fractions",
      date: "16 June",
      subject: "Mathematics",
      aiInsight:
        "You stopped guessing and started choosing your method — common denominator when the numbers were friendly, otherwise the picture. That is real decision-making, not luck.",
      evidence: "Tutor session · you picked the method yourself the second time",
    },
    {
      id: "mw-3",
      title: "Fraction hunt — notes",
      date: "16 June",
      subject: "PATH · Scholar",
      aiInsight:
        "Your cricket-over example is genuinely clever — it shows you can spot a fraction hiding in real life, not just on a worksheet. That is the spark this project is for.",
      evidence: "'The Fraction Around You' · 5 real situations collected",
    },
    {
      id: "mw-4",
      title: "Lino block — first carving",
      date: "16 June",
      subject: "PATH · Artist",
      aiInsight:
        "Your carving lines are getting bolder and more deliberate. A real voice is starting to show in your printmaking — keep trusting those bigger marks.",
      evidence: "Printmaking Studio · block ready for its first pull",
    },
  ],
  tutor: {
    topic: "Fraction word problems — the bar model",
    taughtBy: "Ms. Lakshmi Krishnan",
    rail: "Stays on today's topic · gives hints, never the answer · leaves the big calls to your teacher",
    thread: [
      {
        from: "tutor",
        text: "Let's try one together. A jug holds 20 glasses of nimbu paani. Two-fifths are poured out for the class. Before any sums — what is the whole here, and how many equal parts should the bar become?",
      },
      {
        from: "student",
        text: "The whole is 20. Five parts, because of the five on the bottom.",
      },
      {
        from: "tutor",
        text: "Lovely — the bottom number sets the cuts. So if you split 20 into 5 equal parts, how many glasses sit in each part?",
      },
      {
        from: "student",
        text: "4 in each part.",
      },
      {
        from: "tutor",
        text: "Now the top number, 2, tells you how many of those parts to take. You've got everything you need — what answer does that give you, and what does it mean?",
      },
      {
        from: "student",
        text: "Two parts is 8 glasses. So 8 glasses got poured out.",
      },
      {
        from: "tutor",
        text: "That's it — and notice you drew the bar before the numbers, exactly like class. One thing I will not judge: whether your project's problems are clever enough to hand to a friend. That is Ms. Krishnan's call, and I have passed your draft to her.",
      },
    ],
    defersToTeacher:
      "Whether your set of problems is good enough to give a classmate is a teacher's judgment — Ms. Krishnan decides that, not your tutor.",
  },
};

/* ===========================================================================
   ADITYA VARGHESE — Class 10 · Ganga (high). New, defined here. Has the AI
   tutor. His current maths topic is quadratic word problems; the tutor keeps
   to method and reasoning, and hands the "is this the best approach" judgment
   back to the teacher.
   ========================================================================= */
const aditya: StudentProfile = {
  // a new student, defined here — not in the shared roster
  ...identity("stu-aditya-v", {
    name: "Aditya Varghese",
    grade: "Class 10",
    gradeNum: 10,
    house: "Ganga",
    stage: "high",
  }),
  hasTutor: true,
  greeting: "Hi Aditya",
  todayLabel: "Thursday · 18 June 2026",
  todayLine: "Board year, steady pace — today it's quadratic word problems, set up before solved.",
  schedule: [
    {
      day: "Mon",
      date: "15 Jun",
      blocks: [
        { start: "08:00", end: "09:00", kind: "concept", label: "Mathematics", room: "Ganga Room", topic: "Quadratic equations — factorising" },
        { start: "09:05", end: "10:05", kind: "concept", label: "Physics", room: "Science Lab 2", topic: "Light — refraction" },
        { start: "10:20", end: "11:20", kind: "concept", label: "English", room: "Ganga Room", topic: "Unseen passage practice" },
        { start: "13:30", end: "15:00", kind: "path", label: "PATH · Scholar", room: "Research Hub", topic: "RMO problem set" },
      ],
    },
    {
      day: "Tue",
      date: "16 Jun",
      blocks: [
        { start: "08:00", end: "09:00", kind: "concept", label: "Mathematics", room: "Ganga Room", topic: "Completing the square" },
        { start: "09:05", end: "10:05", kind: "concept", label: "Chemistry", room: "Science Lab 3", topic: "Acids, bases and salts" },
        { start: "10:20", end: "11:20", kind: "concept", label: "Social Science", room: "Ganga Room", topic: "Nationalism in India" },
        { start: "13:30", end: "15:00", kind: "path", label: "PATH · Builder", room: "Innovation Lab", topic: "Weather-station build" },
      ],
    },
    {
      day: "Wed",
      date: "17 Jun",
      blocks: [
        { start: "08:00", end: "09:00", kind: "concept", label: "Mathematics", room: "Ganga Room", topic: "The quadratic formula" },
        { start: "09:05", end: "10:05", kind: "concept", label: "Physics", room: "Science Lab 2", topic: "Light — lenses" },
        { start: "10:20", end: "11:20", kind: "concept", label: "Hindi", room: "Ganga Room", topic: "पत्र लेखन" },
        { start: "13:30", end: "15:00", kind: "path", label: "PATH · Scholar", room: "Research Hub", topic: "Number theory reading" },
      ],
    },
    {
      day: "Thu",
      date: "18 Jun",
      blocks: [
        { start: "08:00", end: "09:00", kind: "concept", label: "Mathematics", room: "Ganga Room", topic: "Quadratic word problems" },
        { start: "09:05", end: "10:05", kind: "concept", label: "Chemistry", room: "Science Lab 3", topic: "Metals and non-metals" },
        { start: "10:20", end: "11:20", kind: "concept", label: "English", room: "Ganga Room", topic: "Writing a discursive paragraph" },
        { start: "13:30", end: "14:30", kind: "concept", label: "Practice time", room: "Ganga Room", topic: "Tutor practice — quadratic word problems" },
        { start: "14:35", end: "16:00", kind: "path", label: "PATH · Builder", room: "Innovation Lab", topic: "Calibrating the rain sensor" },
      ],
    },
    {
      day: "Fri",
      date: "19 Jun",
      blocks: [
        { start: "08:00", end: "09:00", kind: "concept", label: "Mathematics", room: "Ganga Room", topic: "Quadratics — mixed problems" },
        { start: "09:05", end: "10:05", kind: "concept", label: "Physics", room: "Science Lab 2", topic: "Light — problem solving" },
        { start: "10:20", end: "11:20", kind: "concept", label: "Social Science", room: "Ganga Room", topic: "Map work" },
        { start: "13:30", end: "15:00", kind: "path", label: "PATH · Scholar", room: "Research Hub", topic: "Timed olympiad practice" },
      ],
    },
  ],
  currentClass: {
    subject: "Mathematics",
    topic: "Quadratic word problems",
    teacherName: "Mr. Anand Subramanian",
    room: "Ganga Room",
    time: "8:00 am",
    plan: [
      {
        title: "Name the unknown",
        minutes: 8,
        detail: "Read the problem and decide what x stands for in one clear sentence. A good 'let x be…' makes the rest fall into place.",
      },
      {
        title: "Build the equation",
        minutes: 14,
        detail: "Translate the relationship in the words into a quadratic equation. Keep the units beside you so the equation stays honest.",
      },
      {
        title: "Solve, then sense-check",
        minutes: 16,
        detail: "Factorise or use the formula. Then ask: does this answer make sense in the story? A speed of minus 40 km/h gets discarded.",
      },
      {
        title: "Write the answer in words",
        minutes: 7,
        detail: "Finish with a sentence that answers the actual question — not just 'x = 6', but what 6 means here.",
      },
    ],
    prepNote:
      "Today we turn worded situations into quadratics — set up before you solve, and always test your answer against the story. Bring your formula sheet and last week's factorising notes. Two clean problems beat six rushed ones.",
  },
  pastWork: [
    {
      id: "aw-1",
      title: "Completing the square — exercise 4.3",
      date: "17 June",
      subject: "Mathematics",
      aiInsight:
        "You showed every step of completing the square, even the ones you can do in your head now. In a board year that discipline protects easy marks — keep it up.",
      evidence: "Wednesday's set · full working shown on all 8 questions",
    },
    {
      id: "aw-2",
      title: "RMO problem set — Q3",
      date: "16 June",
      subject: "PATH · Scholar",
      aiInsight:
        "You tried two approaches before one worked, and you wrote down why the first stalled. That habit of reflecting on a dead end is what olympiad problems reward.",
      evidence: "Research Hub · annotated attempt, two methods",
    },
    {
      id: "aw-3",
      title: "Refraction — lab report",
      date: "16 June",
      subject: "Physics",
      aiInsight:
        "Your error analysis was honest and specific — you named the parallax in your readings instead of hiding it. Examiners notice that kind of integrity.",
      evidence: "Science Lab 2 · ray-diagram practical write-up",
    },
    {
      id: "aw-4",
      title: "Weather-station build — log",
      date: "16 June",
      subject: "PATH · Builder",
      aiInsight:
        "You logged each failed sensor reading with the change you made next. That test-and-fix trail is the difference between a project and a tinker.",
      evidence: "Innovation Lab · build journal, week 3",
    },
  ],
  tutor: {
    topic: "Quadratic word problems",
    taughtBy: "Mr. Anand Subramanian",
    rail: "Stays on today's topic · guides your reasoning, never just hands the answer · leaves the judgment calls to your teacher",
    thread: [
      {
        from: "tutor",
        text: "Here's one from today's set. The product of two consecutive positive integers is 156. Before any algebra — what would you let x stand for, and how would you write the second integer?",
      },
      {
        from: "student",
        text: "Let x be the smaller integer. Then the next one is x + 1.",
      },
      {
        from: "tutor",
        text: "Clean setup. Now turn 'their product is 156' into an equation in x.",
      },
      {
        from: "student",
        text: "x(x + 1) = 156, so x² + x − 156 = 0.",
      },
      {
        from: "tutor",
        text: "Good. You could factorise or use the formula. Whichever you pick, what should you do with any negative root once you solve it?",
      },
      {
        from: "student",
        text: "Drop it — the problem says positive integers. So x = 12, and the numbers are 12 and 13.",
      },
      {
        from: "tutor",
        text: "Exactly, and you sense-checked against the story — that's the habit that saves marks. One thing I won't rule on: whether the formula or factorising is the 'better' method for your board answer. That's a style call your teacher makes, so I've noted the question for Mr. Subramanian.",
      },
    ],
    defersToTeacher:
      "Which method to prefer in a board answer is a teacher's judgment — Mr. Subramanian guides that, not your tutor.",
  },
};

/* ---- the toggle, in stage order (Riya · Mahira · Aditya) ---- */
export const studentProfiles: StudentProfile[] = [riya, mahira, aditya];

/** Default selection: the middle-stage student. */
export const DEFAULT_PROFILE_ID = mahira.id;

export function profileById(id: string) {
  return studentProfiles.find((p) => p.id === id) ?? mahira;
}
