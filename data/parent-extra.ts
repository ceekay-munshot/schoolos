import type { PathKey } from "./types";
import { artifactsByStudent } from "./paths";
import { coachNotesForStudent } from "./coach";
import { checkInFor } from "./coach";
import { growthFor } from "./metrics";

/* ============================================================================
   Parent App — Riya Iyer (stu-riya, Class 5 · Kaveri)
   The honest, month-on-month layer behind the Parent surface. Every subject is
   shown as mastery + movement + position + gaps, ALWAYS followed by plain
   language about what she can do and what comes next. A named gap is never shown
   without why it matters, what the school is doing, what already improved, and
   when it will be reviewed. PATH is evidence, not a score.

   Re-exports the shared helpers the page also leans on, so the surface has a
   single import for everything Riya-specific.
   ========================================================================== */

export const PARENT_STUDENT_ID = "stu-riya";

/* ---------------------------------------------------------------------------
   The academic bridge — translating the old marks mental model into mastery.
   `change` is this month's movement in percentage points. `position` says where
   she sits on the Class 5 map, in words, never as a rank.
--------------------------------------------------------------------------- */
export interface SubjectBridge {
  subject: string;
  glyph: string;
  /** current mastery of grade-level material, 0–100 */
  mastery: number;
  /** change this month, in points (can be negative — we show it honestly) */
  change: number;
  /** where she sits on the Class 5 map, in plain words */
  position: string;
  gapsClosed: number;
  gapsInProgress: number;
  /** the floor band this subject sits in */
  floor: "on-track" | "building" | "needs-support";
  /** plain language: what she can actually do now */
  canDo: string;
  /** plain language: what comes next */
  next: string;
}

export const subjectBridges: SubjectBridge[] = [
  {
    subject: "Maths",
    glyph: "∑",
    mastery: 76,
    change: 5,
    position: "On the Class 5 map, working at grade level",
    gapsClosed: 3,
    gapsInProgress: 1,
    floor: "building",
    canDo:
      "She reads a fraction as equal parts of a whole and places it confidently on a number line. Her multiplication facts are quick and reliable, which is what lets the fractions work move.",
    next:
      "Equivalent fractions — recognising that 1/2 and 2/4 are the same amount. It's one specific step, and it's the move that unlocks adding fractions cleanly.",
  },
  {
    subject: "English",
    glyph: "✍",
    mastery: 68,
    change: 2,
    position: "On the Class 5 map; reading ahead of writing",
    gapsClosed: 1,
    gapsInProgress: 1,
    floor: "building",
    canDo:
      "She reads above grade level and her ideas are vivid — give her a prompt and the images come easily. Spelling and tense within a sentence are secure.",
    next:
      "Structure across a whole piece: holding one idea from opening to ending so the reader stays with her. This is her clearest area of focus right now, and it's a craft skill that builds steadily.",
  },
  {
    subject: "Science",
    glyph: "✺",
    mastery: 82,
    change: 4,
    position: "On the Class 5 map, among the stronger observers",
    gapsClosed: 2,
    gapsInProgress: 0,
    floor: "on-track",
    canDo:
      "She observes carefully and asks good 'what if' questions — the habits that matter most at this age. Her notes from the materials unit were detailed and accurate.",
    next:
      "Moving from describing what she sees to predicting what will happen and then checking it. Her Explorer work is already pulling her in this direction.",
  },
  {
    subject: "Hindi",
    glyph: "अ",
    mastery: 74,
    change: 3,
    position: "On the Class 5 map, comfortably at grade level",
    gapsClosed: 1,
    gapsInProgress: 0,
    floor: "on-track",
    canDo:
      "Reads aloud fluently and follows a story well. Vocabulary is growing and she's confident speaking in class.",
    next:
      "Writing longer answers in her own words rather than lifting phrases from the passage — the same structure work that helps her English will help here.",
  },
  {
    subject: "Social Studies",
    glyph: "❖",
    mastery: 79,
    change: 3,
    position: "On the Class 5 map, secure across the term's topics",
    gapsClosed: 1,
    gapsInProgress: 0,
    floor: "on-track",
    canDo:
      "Connects ideas across a topic — she linked the rivers unit to where cities grew without being prompted. Maps and timelines are secure.",
    next:
      "Backing an answer with a specific reason or example, rather than a general statement. A small habit that lifts the quality of her written work.",
  },
];

/* ---------------------------------------------------------------------------
   The named gap — never shown without the full picture (Brief §8.4).
   Riya's is the equivalent-fractions step, the same root the coach and teacher
   are already working. Everything here is concrete and time-bound.
--------------------------------------------------------------------------- */
export interface NamedGap {
  subject: string;
  title: string;
  whyItMatters: string;
  whatSchoolIsDoing: string;
  whatImproved: string;
  whenReviewed: string;
}

export const namedGap: NamedGap = {
  subject: "Maths",
  title: "Equivalent fractions",
  whyItMatters:
    "It's the one step that sits underneath adding and comparing fractions. Her adding has been wobbling — but the cause isn't addition, it's this. Fix it here and the rest opens up.",
  whatSchoolIsDoing:
    "Ms. Krishnan is running a small group on exactly this, using a fraction wall so Riya can see why 1/2 and 2/4 are the same before any rule is written down. Three targeted sessions are planned over the next two weeks.",
  whatImproved:
    "Two prerequisite steps closed this month — fraction meaning is now retained and number-line placement is secure. Those were the foundations this step needs.",
  whenReviewed: "Accuracy will be re-checked at the fortnightly coach check-in on 20 June.",
};

/* ---------------------------------------------------------------------------
   Monthly summaries — the calm, human report archive (last four months).
   Each is honest: a real win, the named focus, and one specific thing to do at
   home. "This month" on Home reads from the most recent entry.
--------------------------------------------------------------------------- */
export interface MonthlySummary {
  id: string;
  month: string; // "June 2026"
  short: string; // "Jun"
  range: string; // human date range
  /** the one-paragraph human summary of the month */
  summary: string;
  /** the single most useful thing to do at home this month */
  atHome: string;
  /** small, honest highlights — capability movement, not marks */
  highlights: { label: string; detail: string }[];
}

export const monthlySummaries: MonthlySummary[] = [
  {
    id: "ms-2026-06",
    month: "June 2026",
    short: "Jun",
    range: "1–18 June",
    summary:
      "Riya had a strong month in maths and in her Artist path. She closed two prerequisite steps in fractions and her Madhubani work is starting to show a recognisable hand. Equivalent fractions remains the one named thing we're working — it's specific, it's being taught in a small group, and it's the step that unlocks her adding. Writing structure is her clearest area of focus, and we've begun gentle work on holding one idea across a whole piece.",
    atHome:
      "When you cook together, halve or double a recipe out loud with her — 'half of three-quarters of a cup'. Real, hands-on equivalence does more than any worksheet.",
    highlights: [
      { label: "Closed", detail: "Fraction meaning now retained; number-line placement secure" },
      { label: "Rising", detail: "Artist standard of work climbing — a recognisable hand emerging" },
      { label: "Working", detail: "Equivalent fractions, in a small group this fortnight" },
    ],
  },
  {
    id: "ms-2026-05",
    month: "May 2026",
    short: "May",
    range: "1–31 May",
    summary:
      "A steady month. Riya held her pace across subjects and her reading continued to run ahead of her writing. In maths she consolidated fraction meaning — the groundwork that made June's progress possible. We first named the equivalent-fractions step this month after her addition errors clustered there; it was reassuring to trace the wobble to one specific cause rather than a general slip.",
    atHome:
      "Keep reading together, then ask her to tell you what happened in her own words, in order. That retelling is exactly the structure muscle her writing needs.",
    highlights: [
      { label: "Held", detail: "Steady pace across all five subjects" },
      { label: "Named", detail: "Located the maths wobble to one specific step" },
    ],
  },
  {
    id: "ms-2026-04",
    month: "April 2026",
    short: "Apr",
    range: "1–30 April",
    summary:
      "Riya's Science work stood out this month — her notes from the materials unit were among the most careful in the class, and her questions on the nature walks showed a genuine observer's instinct. Maths was solid on the meaning of fractions. Writing ideas were lovely; the focus, as it has been, is on carrying one of them all the way through a piece.",
    atHome:
      "Lean into the curiosity — let her keep a small 'I wonder…' notebook for questions from walks or the kitchen. We can pick the best ones up at school.",
    highlights: [
      { label: "Strong", detail: "Science observation notes among the best in class" },
      { label: "Solid", detail: "Fraction meaning secure and growing" },
    ],
  },
  {
    id: "ms-2026-03",
    month: "March 2026",
    short: "Mar",
    range: "1–31 March",
    summary:
      "A confident month all round. Riya settled into the term well, with reliable multiplication recall that's quietly powering everything in fractions since. Her enthusiasm for art grew noticeably, and she began sampling the Explorer path with real curiosity. No gaps of concern this month — a good, steady base to build from.",
    atHome:
      "Times tables are paying off everywhere — keep them playful with quick games in the car. A strong recall here makes the harder maths feel easy.",
    highlights: [
      { label: "Reliable", detail: "Multiplication facts quick and secure" },
      { label: "Growing", detail: "Art enthusiasm and a first taste of Explorer" },
    ],
  },
];

/* ---------------------------------------------------------------------------
   What happens next — the school's action, the parent's action, the coming
   check-in, and the next school event. Answers "what is the school doing about
   it?" and "what should we do at home?".
--------------------------------------------------------------------------- */
export interface NextEvent {
  title: string;
  date: string; // ISO
  detail: string;
}

export const whatHappensNext: {
  school: string;
  parent: string;
  event: NextEvent;
} = {
  school:
    "Ms. Krishnan continues the equivalent-fractions small group — three short sessions over the next two weeks, using the fraction wall before any rule is written down.",
  parent:
    "Halve and double recipes out loud together this fortnight, and keep the bedtime reading going with a quick 'what happened, in order?' afterwards.",
  event: {
    title: "Atelier open afternoon",
    date: "2026-06-27",
    detail: "Come and see the Madhubani pieces the Class 4–5 group has been working on.",
  },
};

/* ---------------------------------------------------------------------------
   PATH evidence — Mojo as evidence, never a score (Brief §8.5).
   Built from Riya's real enrolments (artist primary, explorer sampling) and her
   artifacts. Each path shows stage, interest signal, concrete evidence, and the
   next challenge she could take on.
--------------------------------------------------------------------------- */
export interface PathEvidence {
  path: PathKey;
  /** rising / steady / early — an honest read of her pull toward it */
  interestSignal: "Rising" | "Steady" | "Early";
  /** concrete things she actually did */
  evidence: string[];
  /** her own reflection, in her words */
  reflection: string;
  /** the mentor's feedback */
  mentorFeedback: string;
  mentor: string;
  /** what she could try next */
  nextChallenge: string;
}

export const pathEvidence: Record<string, PathEvidence> = {
  artist: {
    path: "artist",
    interestSignal: "Rising",
    evidence: [
      "Completed her first full Madhubani fish in ink — confident, controlled linework",
      "Came back to the piece voluntarily to tighten the colour discipline",
      "Helped two younger children in the atelier with their border patterns",
    ],
    reflection:
      "I like that you can be neat and wild at the same time. The fish took three tries and the third one finally looked like mine.",
    mentorFeedback:
      "A recognisable hand is genuinely starting to show. She's moving from copying a pattern to making choices — that's the real beginning of taste.",
    mentor: "Atelier · Class 4–5",
    nextChallenge:
      "A small series — three fish that clearly belong together — to start building a body of work with a through-line.",
  },
  explorer: {
    path: "explorer",
    interestSignal: "Early",
    evidence: [
      "Kept careful notes on the school garden over a fortnight",
      "Asked a genuine 'why does it do that?' question about how seeds find the light",
    ],
    reflection:
      "I didn't know you could just watch one thing for two weeks and keep finding new stuff.",
    mentorFeedback:
      "Still sampling, and that's exactly right for now. The instinct to look closely and ask why is there — we'll see whether it deepens into an obsession.",
    mentor: "Field · Class 5",
    nextChallenge:
      "Pick one plant in the garden and predict what it'll do over the next two weeks, then check whether she was right.",
  },
};

/* ---------------------------------------------------------------------------
   PATH stage arc — the Sample → Specialise → Master journey, for the small
   indicator on the PATHS screen. Elementary children are at Sample, sampling
   broadly before anything narrows.
--------------------------------------------------------------------------- */
export const PATH_ARC: { stage: string; label: string }[] = [
  { stage: "sample", label: "Sample" },
  { stage: "specialise", label: "Specialise" },
  { stage: "master", label: "Master" },
];

/* ---------------------------------------------------------------------------
   Convenience re-exports so the page imports Riya's world from one place.
--------------------------------------------------------------------------- */
export const riyaCheckIn = () => checkInFor(PARENT_STUDENT_ID);
export const riyaCoachNote = () => coachNotesForStudent(PARENT_STUDENT_ID)[0];
export const riyaGrowth = () => growthFor(PARENT_STUDENT_ID);
export const riyaArtifacts = () => artifactsByStudent(PARENT_STUDENT_ID);

/** The shared coach plan, split into who-owns-what (Brief §8.4 / §8 Coach).
 *  This is the SHARED plan only — never the coach's private context notes. */
export const sharedPlan: {
  school: string;
  student: string;
  parent: string;
} = {
  school:
    "Run the equivalent-fractions small group with the fraction wall; re-check accuracy at the next fortnightly check-in.",
  student:
    "Use the fraction wall before reaching for the rule, and try two 'find an equal fraction' problems in self-work each day.",
  parent:
    "Keep the maths light and hands-on at home — halving recipes, sharing things equally — and protect the bedtime reading.",
};

/** Progress since the last check-in (5 June) — concrete, honest movement. */
export const progressSinceCheckIn: { label: string; detail: string }[] = [
  { label: "Closed", detail: "Two prerequisite steps in fractions now secure" },
  { label: "Steadied", detail: "Addition errors are narrowing as equivalence work takes hold" },
  { label: "Held", detail: "Artist momentum strong — the visible win the plan protects" },
];
