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
    position: "Working right where a Class 5 child should be",
    gapsClosed: 3,
    gapsInProgress: 1,
    floor: "building",
    canDo:
      "She knows a fraction is equal parts of a whole, and she can place one on a number line without help. Her times tables are quick and sure, and that's what's letting the fractions work move.",
    next:
      "Equal fractions — seeing that 1/2 and 2/4 are the same amount. It's one clear step, and it's the one that makes adding fractions click.",
  },
  {
    subject: "English",
    glyph: "✍",
    mastery: 68,
    change: 2,
    position: "Right where a Class 5 child should be; her reading is ahead of her writing",
    gapsClosed: 1,
    gapsInProgress: 1,
    floor: "building",
    canDo:
      "She reads above her grade and her ideas are full of life — give her a prompt and the pictures come easily. Spelling and getting the tense right in a sentence are solid.",
    next:
      "Holding one idea all the way through a piece, from the start to the end, so the reader stays with her. This is the main thing she's working on right now, and it's a skill that grows a little at a time.",
  },
  {
    subject: "Science",
    glyph: "✺",
    mastery: 82,
    change: 4,
    position: "Right where a Class 5 child should be, and one of the keenest observers",
    gapsClosed: 2,
    gapsInProgress: 0,
    floor: "on-track",
    canDo:
      "She looks closely and asks good 'what if' questions — the habits that matter most at this age. Her notes from the materials unit were full of detail and got things right.",
    next:
      "Going from describing what she sees to guessing what will happen, then checking if she was right. Her Explorer work is already pulling her this way.",
  },
  {
    subject: "Hindi",
    glyph: "अ",
    mastery: 74,
    change: 3,
    position: "Comfortably where a Class 5 child should be",
    gapsClosed: 1,
    gapsInProgress: 0,
    floor: "on-track",
    canDo:
      "Reads aloud smoothly and follows a story well. She's learning more words and speaks up happily in class.",
    next:
      "Writing longer answers in her own words instead of copying lines from the passage — the same work that helps her English will help here too.",
  },
  {
    subject: "Social Studies",
    glyph: "❖",
    mastery: 79,
    change: 3,
    position: "Right where a Class 5 child should be, and solid across this term's topics",
    gapsClosed: 1,
    gapsInProgress: 0,
    floor: "on-track",
    canDo:
      "Links ideas across a topic — she connected the rivers unit to where cities grew, all on her own. Maps and timelines are solid.",
    next:
      "Backing up an answer with a clear reason or example, instead of a general statement. A small habit that makes her written work even better.",
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
  title: "Equal fractions",
  whyItMatters:
    "This is the one step that sits under adding and comparing fractions. Her adding has been a bit shaky — but the trouble isn't adding, it's this. Sort this out and the rest opens up.",
  whatSchoolIsDoing:
    "Ms. Krishnan is running a small group on exactly this, using a fraction wall so Riya can see why 1/2 and 2/4 are the same before any rule is written down. Three sessions just for this are planned over the next two weeks.",
  whatImproved:
    "Two of the building blocks were sorted this month — she now remembers what a fraction is, and she can place one on a number line. Those are the basics this step needs.",
  whenReviewed: "We'll check how she's doing at the coach check-in on 20 June, which happens every two weeks.",
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
      "Riya had a strong month in maths and in her Artist path. She sorted out two of the building blocks for fractions, and her Madhubani art is starting to show a style of her own. Equal fractions is still the one thing we're working on — it's a clear step, she's learning it in a small group, and it's what makes her adding click. Holding one idea all the way through a piece of writing is her main focus, and we've made a gentle start on it.",
    atHome:
      "When you cook together, halve or double a recipe out loud with her — 'half of three-quarters of a cup'. Real, hands-on sharing helps far more than any worksheet.",
    highlights: [
      { label: "Sorted", detail: "She remembers what a fraction is now, and can place one on a number line" },
      { label: "Rising", detail: "Her Artist work is getting better — a style of her own is showing" },
      { label: "Working on", detail: "Equal fractions, in a small group these two weeks" },
    ],
  },
  {
    id: "ms-2026-05",
    month: "May 2026",
    short: "May",
    range: "1–31 May",
    summary:
      "A steady month. Riya kept up her pace across subjects, and her reading stayed ahead of her writing. In maths she got really firm on what a fraction is — the groundwork that made June's progress possible. This is the month we first spotted that the equal-fractions step was the issue, after most of her adding mistakes turned out to be about that one thing. It was a relief to trace it to one clear cause rather than a general slip.",
    atHome:
      "Keep reading together, then ask her to tell you what happened in her own words, in order. That retelling builds exactly the skill her writing needs.",
    highlights: [
      { label: "Steady", detail: "Kept a steady pace across all five subjects" },
      { label: "Spotted", detail: "Traced the maths wobble to one clear step" },
    ],
  },
  {
    id: "ms-2026-04",
    month: "April 2026",
    short: "Apr",
    range: "1–30 April",
    summary:
      "Riya's Science work stood out this month — her notes from the materials unit were among the most careful in the class, and her questions on the nature walks showed she's a real observer. Her maths was solid on what a fraction means. Her writing ideas were lovely; the focus, as before, is on carrying one of them all the way through a piece.",
    atHome:
      "Lean into the curiosity — let her keep a little 'I wonder…' notebook for questions from walks or the kitchen. We can pick the best ones up at school.",
    highlights: [
      { label: "Strong", detail: "Her Science notes were among the best in class" },
      { label: "Solid", detail: "Sure of what a fraction means, and growing" },
    ],
  },
  {
    id: "ms-2026-03",
    month: "March 2026",
    short: "Mar",
    range: "1–31 March",
    summary:
      "A confident month all round. Riya settled into the term well, with quick, reliable times tables that have quietly been powering all her fractions work since. Her love of art grew a lot, and she started trying out the Explorer path with real curiosity. Nothing to worry about this month — a good, steady base to build from.",
    atHome:
      "Times tables are paying off everywhere — keep them fun with quick games in the car. Knowing them well makes the harder maths feel easy.",
    highlights: [
      { label: "Reliable", detail: "Times tables quick and sure" },
      { label: "Growing", detail: "More love of art, and a first taste of Explorer" },
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
    "Ms. Krishnan keeps going with the equal-fractions small group — three short sessions over the next two weeks, using the fraction wall before any rule is written down.",
  parent:
    "Halve and double recipes out loud together over the next two weeks, and keep the bedtime reading going with a quick 'what happened, in order?' afterwards.",
  event: {
    title: "Atelier open afternoon",
    date: "2026-06-27",
    detail: "Come and see the Madhubani pieces the Class 4–5 group has been making.",
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
      "Finished her first whole Madhubani fish in ink — sure, steady lines",
      "Came back to the piece on her own to make the colours neater",
      "Helped two younger children in the atelier with their border patterns",
    ],
    reflection:
      "I like that you can be neat and wild at the same time. The fish took three tries and the third one finally looked like mine.",
    mentorFeedback:
      "A style of her own is really starting to show. She's moving from copying a pattern to making her own choices — that's where real taste begins.",
    mentor: "Atelier · Class 4–5",
    nextChallenge:
      "A small set — three fish that clearly go together — to start building a little body of work that hangs together.",
  },
  explorer: {
    path: "explorer",
    interestSignal: "Early",
    evidence: [
      "Kept careful notes on the school garden over two weeks",
      "Asked a real 'why does it do that?' question about how seeds find the light",
    ],
    reflection:
      "I didn't know you could just watch one thing for two weeks and keep finding new stuff.",
    mentorFeedback:
      "Still trying things out, and that's just right for now. The urge to look closely and ask why is there — we'll see if it grows into a real passion.",
    mentor: "Field · Class 5",
    nextChallenge:
      "Pick one plant in the garden and guess what it'll do over the next two weeks, then check whether she was right.",
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
    "Run the equal-fractions small group with the fraction wall, and check how she's doing at the next check-in two weeks on.",
  student:
    "Use the fraction wall before reaching for the rule, and try two 'find an equal fraction' problems in your own practice each day.",
  parent:
    "Keep the maths light and hands-on at home — halving recipes, sharing things equally — and keep the bedtime reading going.",
};

/** Progress since the last check-in (5 June) — concrete, honest movement. */
export const progressSinceCheckIn: { label: string; detail: string }[] = [
  { label: "Sorted", detail: "Two building blocks for fractions are now solid" },
  { label: "Steadied", detail: "Fewer adding mistakes as the equal-fractions work takes hold" },
  { label: "Going strong", detail: "Her Artist work is flying — the clear win the plan looks after" },
];
