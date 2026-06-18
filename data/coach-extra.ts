import type { EvidenceItem } from "./types";

/* ============================================================================
   Executive Coach — the synthesis layer.

   Rohan D'Souza reads the whole child across Concept and PATH, adds the human
   context the data can't see, and turns it into a simple plan: no more than
   2–3 commitments, each owned by School, Student or Parent. Follow-ups are
   tracked honestly — Changed, Partial, or Not yet — never a wall of green.

   Everything here references real children from the Class 5 · Kaveri roster
   and reuses the same names, guardians and stories as the rest of the system.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   Caseload reason tags — the gentle, action-oriented "why this round" chips.
   Drawn only from the agreed vocabulary (Design Brief §6): never alarming.
--------------------------------------------------------------------------- */
export type CaseReasonKind =
  | "check-in-due"
  | "new-pattern"
  | "path-dropping"
  | "unresolved-foundation"
  | "parent-input"
  | "plan-review";

export interface CaseReason {
  kind: CaseReasonKind;
  label: string;
}

export const CASE_REASON_LABEL: Record<CaseReasonKind, string> = {
  "check-in-due": "Check-in due",
  "new-pattern": "New learning pattern to discuss",
  "path-dropping": "PATH participation dropping",
  "unresolved-foundation": "Repeated unresolved foundation",
  "parent-input": "Parent input required",
  "plan-review": "Plan review due",
};

function reasons(...kinds: CaseReasonKind[]): CaseReason[] {
  return kinds.map((kind) => ({ kind, label: CASE_REASON_LABEL[kind] }));
}

/** Why each student surfaces in this fortnight's caseload — the human reasons,
 *  not a score. Keyed by studentId. */
export const caseReasons: Record<string, CaseReason[]> = {
  "stu-riya": reasons("check-in-due", "new-pattern", "parent-input"),
  "stu-ishaan": reasons("check-in-due", "unresolved-foundation"),
  "stu-reyansh": reasons("check-in-due", "new-pattern", "plan-review"),
  "stu-aarav": reasons("plan-review", "new-pattern"),
  "stu-kabir": reasons("unresolved-foundation"),
  "stu-ananya": reasons("check-in-due"),
  "stu-diya": reasons("check-in-due", "unresolved-foundation"),
  "stu-saanvi": reasons("new-pattern"),
};

export function caseReasonsFor(studentId: string): CaseReason[] {
  return caseReasons[studentId] ?? [];
}

/* ---------------------------------------------------------------------------
   The simple plan — never more than 2–3 commitments, each with an owner.
--------------------------------------------------------------------------- */
export type Owner = "school" | "student" | "parent";

export const OWNER_LABEL: Record<Owner, string> = {
  school: "School",
  student: "Student",
  parent: "Parent",
};

export interface Commitment {
  owner: Owner;
  text: string;
}

export type PlanStatus = "on-track" | "needs-review" | "new";

export interface CoachPlan {
  id: string;
  studentId: string;
  /** the human framing of this plan in a sentence */
  focus: string;
  agreed: string; // date the plan was set with student + parents
  reviewDate: string;
  status: PlanStatus;
  commitments: Commitment[];
  /** progress 0–1 across the fortnight, for the quiet bar */
  progress: number;
  /** honest one-line read on movement so far */
  note: string;
}

export const coachPlans: CoachPlan[] = [
  {
    id: "plan-riya",
    studentId: "stu-riya",
    focus: "Hold the art win; treat the maths dip as one small fix, not a slide.",
    agreed: "2026-06-05",
    reviewDate: "2026-06-20",
    status: "on-track",
    progress: 0.6,
    commitments: [
      { owner: "school", text: "Ms. Krishnan pulls the equivalent-fractions group twice this fortnight; re-check accuracy on addition items after." },
      { owner: "student", text: "Riya keeps her fraction wall going and brings one piece she's proud of to the next check-in." },
      { owner: "parent", text: "Frame maths at home as 'one specific thing being worked on' — no extra drilling while the rotation is on." },
    ],
    note: "Accuracy on equivalence items is recovering; addition errors are following it down. The framing has visibly eased the anxiety at home.",
  },
  {
    id: "plan-reyansh",
    studentId: "stu-reyansh",
    focus: "Steady the retention slip after the move — upkeep, not alarm.",
    agreed: "2026-06-06",
    reviewDate: "2026-06-21",
    status: "needs-review",
    progress: 0.35,
    commitments: [
      { owner: "school", text: "Weave three spaced-refresh items into Reyansh's self-work each week on the fading Number nodes." },
      { owner: "parent", text: "Keep weekday evenings steadier while the new house settles; protect a consistent wind-down." },
    ],
    note: "Refresh items are landing in self-work, but two of the three faded nodes haven't been revisited yet. Worth firming up at review.",
  },
  {
    id: "plan-aarav",
    studentId: "stu-aarav",
    focus: "Give the pace somewhere real to go — depth, not more reps.",
    agreed: "2026-06-03",
    reviewDate: "2026-06-23",
    status: "on-track",
    progress: 0.7,
    commitments: [
      { owner: "school", text: "Move Aarav into the maths stretch band; pair the Scholar 'but why is it true?' habit with a small proof task." },
      { owner: "student", text: "Pick one Communicator piece to take from 'told well' to 'written well' over the quarter." },
    ],
    note: "Stretch band is holding his attention without rushing the others. The writing-mechanics work is a longer arc — early days.",
  },
  {
    id: "plan-ishaan",
    studentId: "stu-ishaan",
    focus: "Catch the foundation gap the illness week widened, gently.",
    agreed: "2026-06-04",
    reviewDate: "2026-06-19",
    status: "needs-review",
    progress: 0.4,
    commitments: [
      { owner: "school", text: "Include Ishaan in the equivalent-fractions group; rebuild MEANING.02 before pushing forward." },
      { owner: "parent", text: "No catch-up pressure for the missed week — the school is folding it back in deliberately." },
      { owner: "student", text: "Use the support worksheet, and flag the moment something stops making sense rather than pushing past it." },
    ],
    note: "Back in the room and engaged in discussion. Gap-debt has stopped rising but hasn't come down yet — the small-group pull is the lever.",
  },
];

export function plansForStudent(studentId: string) {
  return coachPlans.filter((p) => p.studentId === studentId);
}

export function planFor(studentId: string) {
  return coachPlans.find((p) => p.studentId === studentId);
}

/* ---------------------------------------------------------------------------
   Follow-ups — the honest tracker. Some change things; some don't yet.
--------------------------------------------------------------------------- */
export type Impact = "changed" | "partial" | "not-yet";

export const IMPACT_LABEL: Record<Impact, string> = {
  changed: "Changed",
  partial: "Partial",
  "not-yet": "Not yet",
};

export interface FollowUp {
  id: string;
  studentId: string;
  action: string;
  owner: Owner;
  due: string;
  impact: Impact;
  /** the honest read: did it change learning or participation? */
  read: string;
}

export const followUps: FollowUp[] = [
  {
    id: "fu-riya-1",
    studentId: "stu-riya",
    action: "Equivalence small-group pulled twice; re-check addition accuracy after",
    owner: "school",
    due: "2026-06-19",
    impact: "changed",
    read: "Addition errors dropped from 9-in-11 to 3-in-11 once equivalence was repaired — the root fix held downstream.",
  },
  {
    id: "fu-riya-2",
    studentId: "stu-riya",
    action: "Reframe maths at home as 'one small fix' during the night rotation",
    owner: "parent",
    due: "2026-06-12",
    impact: "changed",
    read: "Shobha reports the household anxiety has eased; Riya is no longer calling herself 'bad at maths'.",
  },
  {
    id: "fu-reyansh-1",
    studentId: "stu-reyansh",
    action: "Weave spaced-refresh items into self-work on the faded Number nodes",
    owner: "school",
    due: "2026-06-21",
    impact: "partial",
    read: "One of three faded nodes is back to passing recall; the other two need a second pass woven in.",
  },
  {
    id: "fu-reyansh-2",
    studentId: "stu-reyansh",
    action: "Steadier weekday evenings while the new house settles",
    owner: "parent",
    due: "2026-06-21",
    impact: "not-yet",
    read: "Routine is still unsettled — the family is mid-move. Worth revisiting gently rather than treating as decline.",
  },
  {
    id: "fu-aarav-1",
    studentId: "stu-aarav",
    action: "Move into the maths stretch band with a small proof task",
    owner: "school",
    due: "2026-06-16",
    impact: "changed",
    read: "Independent-work ratio held at 0.90 and he's now finishing depth tasks, not racing empty reps.",
  },
  {
    id: "fu-aarav-2",
    studentId: "stu-aarav",
    action: "Take one Communicator piece from 'told well' to 'written well'",
    owner: "student",
    due: "2026-06-23",
    impact: "not-yet",
    read: "Not started — narrative-mechanics work is a quarter-long arc, flagged at the last check-in, not overdue.",
  },
  {
    id: "fu-ishaan-1",
    studentId: "stu-ishaan",
    action: "Rebuild MEANING.02 before pushing forward; include in equivalence group",
    owner: "school",
    due: "2026-06-19",
    impact: "partial",
    read: "Gap-debt has stopped rising. MEANING.02 is firming up; equivalence itself is still the open piece.",
  },
  {
    id: "fu-diya-1",
    studentId: "stu-diya",
    action: "Keep the pace gentle; same equivalence group, no time pressure",
    owner: "school",
    due: "2026-06-25",
    impact: "partial",
    read: "Working more confidently in the group; still slow under new numbers, which is fine for now.",
  },
];

export function followUpsForStudent(studentId: string) {
  return followUps.filter((f) => f.studentId === studentId);
}

/* ---------------------------------------------------------------------------
   Logged coach context (Design Brief §6.6) — the human truth the data can't
   see, recorded so the system stops mis-reading a signal. AIStatus on these is
   "coach-contextualized": the coach has told the model how to interpret it.
--------------------------------------------------------------------------- */
export interface ContextAnnotation {
  id: string;
  studentId: string;
  date: string;
  /** what the data showed */
  signal: string;
  /** the coach's context that reframes it */
  context: string;
  /** the explicit instruction to the system */
  directive: string;
}

export const contextAnnotations: ContextAnnotation[] = [
  {
    id: "ctx-reyansh-1",
    studentId: "stu-reyansh",
    date: "2026-06-06",
    signal: "Independent-work ratio and retention both dipped over the same three weeks.",
    context: "The drop in independent work coincided with a family relocation.",
    directive: "Do not treat this as a stable academic decline yet. Re-evaluate after the routine settles.",
  },
  {
    id: "ctx-riya-1",
    studentId: "stu-riya",
    date: "2026-06-05",
    signal: "Worksheet accuracy fell 18% and engagement shifted toward the Artist path.",
    context: "Her mother is a cardiologist on long night rotations this month; home is quieter and Riya is leaning on art for confidence, not avoiding maths.",
    directive: "Read the maths dip as a confidence wobble on one topic, not disengagement. Keep the Artist momentum visible as a strength.",
  },
  {
    id: "ctx-ishaan-1",
    studentId: "stu-ishaan",
    date: "2026-06-04",
    signal: "Flagged for low capture compliance early this week.",
    context: "Ishaan was absent Monday–Tuesday with a viral fever.",
    directive: "Discount the compliance flag for that week. The rising gap-debt is real and is being addressed through the small-group pull.",
  },
];

export function contextAnnotationsFor(studentId: string) {
  return contextAnnotations.filter((c) => c.studentId === studentId);
}

/* ---------------------------------------------------------------------------
   Source evidence behind the synthesis, for the featured children. Renders in
   the EvidenceDrawer — the action sits up top, the reasoning one tap below.
--------------------------------------------------------------------------- */
export const coachEvidence: Record<string, EvidenceItem[]> = {
  "stu-riya": [
    {
      kind: "assessment",
      label: "Fractions check — equivalence items",
      detail: "9 of the last 11 errors trace to MATH.FRAC.EQUIV.01, not to addition itself.",
      date: "2026-06-11",
    },
    {
      kind: "worksheet",
      label: "Addition of unlike fractions — self-work",
      detail: "Adds across (2/3 + 1/4 = 3/7). The slip is downstream of the equivalence gap.",
      date: "2026-06-10",
    },
    {
      kind: "path-artifact",
      label: "Madhubani fish — first ink pass",
      detail: "Confident linework, improving colour discipline. Artist standard rising 48 → 62.",
      date: "2026-06-09",
    },
    {
      kind: "coach-note",
      label: "Fortnightly check-in with Shobha Iyer",
      detail: "Mother on night rotations this month; the data couldn't see the home context — she told me.",
      date: "2026-06-05",
    },
    {
      kind: "teacher-note",
      label: "Ms. Krishnan — small-group plan",
      detail: "Equivalence group pulled this week; Riya placed with Kabir, Diya and Ishaan.",
      date: "2026-06-08",
    },
  ],
  "stu-reyansh": [
    {
      kind: "assessment",
      label: "Spaced-recall check — Number",
      detail: "3 previously-mastered Number nodes failed their last recall check; integrity 0.82 → 0.66.",
      date: "2026-06-14",
    },
    {
      kind: "coach-note",
      label: "Check-in — the house move",
      detail: "Capable child; this reads as a retention pattern, not comprehension. Family moved in April.",
      date: "2026-06-06",
    },
    {
      kind: "worksheet",
      label: "Self-work with refresh items woven in",
      detail: "Light spaced-refresh added as upkeep; one faded node already back to passing.",
      date: "2026-06-13",
    },
  ],
  "stu-ishaan": [
    {
      kind: "assessment",
      label: "Equivalence diagnostic",
      detail: "Shares the MATH.FRAC.EQUIV.01 gap with three classmates; MEANING.02 still wobbling.",
      date: "2026-06-10",
    },
    {
      kind: "coach-note",
      label: "Context logged — illness week",
      detail: "Absent Mon–Tue with viral fever. Low-capture flag discounted for that week.",
      date: "2026-06-04",
    },
    {
      kind: "teacher-note",
      label: "Ms. Krishnan — discussion strength",
      detail: "Bright and verbal in discussion; the gap is mechanical, not conceptual reach.",
      date: "2026-06-09",
    },
  ],
  "stu-aarav": [
    {
      kind: "assessment",
      label: "Maths pace across blocks",
      detail: "Mastery velocity 2.7 vs 2.0 expected; finishes self-work in roughly half the time.",
      date: "2026-06-17",
    },
    {
      kind: "worksheet",
      label: "Narrative writing — tense flips",
      detail: "ENG.GRAM.TENSE.02 machine-caught; whether the idea lands routed to teacher review.",
      date: "2026-06-16",
    },
    {
      kind: "path-artifact",
      label: "Storytelling circle — 'The Stubborn Banyan'",
      detail: "Held the room for four minutes. A natural performer finding his audience.",
      date: "2026-06-10",
    },
  ],
};

export function coachEvidenceFor(studentId: string): EvidenceItem[] {
  return coachEvidence[studentId] ?? [];
}

/* ---------------------------------------------------------------------------
   The Human picture — goals, home context, confidence, prior plans. The part
   of the child no metric reaches; the coach is its custodian.
--------------------------------------------------------------------------- */
export interface HumanPicture {
  studentGoal: string; // in the child's own framing
  parentConcern: string;
  confidence: string; // the coach's read on how the child feels
  homeContext: string;
  priorPlan: string; // what the last plan tried, in one line
}

export const humanPictures: Record<string, HumanPicture> = {
  "stu-riya": {
    studentGoal: "“I want my fraction wall to look right and not feel like a trick I forget.”",
    parentConcern: "Shobha worried Riya had fallen behind in maths; reassured it is one specific, named thing.",
    confidence: "Steady and a little fragile on maths; genuinely proud of her art. Responds to being told she's 'not behind, just fixing one thing'.",
    homeContext: "Mother is a cardiologist on long night rotations this month, so home is quieter and routines are looser than usual.",
    priorPlan: "Last fortnight: hold the Artist win, pull the equivalence group, reframe the dip at home — and it has held.",
  },
  "stu-reyansh": {
    studentGoal: "“I knew it before — it just slips out. I want it to stick this time.”",
    parentConcern: "Pooja noticed the move was harder on him than expected; keen not to make it a 'problem'.",
    confidence: "Capable and self-aware; mildly frustrated that things he'd learned are slipping. Reassured this is upkeep, not regression.",
    homeContext: "Family moved house in April; routine, especially weekday evenings, is still settling in the new place.",
    priorPlan: "First plan this cycle: light spaced-refresh as upkeep, no alarm to parents — partially landed, needs a firmer second pass.",
  },
  "stu-ishaan": {
    studentGoal: "“I want to catch up the bit I missed without it piling on top of me.”",
    parentConcern: "Sromona, an economics professor, values honesty over reassurance; wants the gap named and worked, not smoothed over.",
    confidence: "Bright in discussion, quietly anxious about the missed week. Eases when catch-up is framed as deliberate, not remedial.",
    homeContext: "Lost Monday–Tuesday to a viral fever; otherwise a stable, supportive home.",
    priorPlan: "Plan in motion: rebuild MEANING.02, fold the missed week back in, no catch-up pressure — gap-debt has stopped rising.",
  },
  "stu-aarav": {
    studentGoal: "“Maths is easy — I want harder problems and to tell better stories.”",
    parentConcern: "Nikhil, a software architect, asks whether Aarav is being stretched enough rather than kept busy.",
    confidence: "High and well-founded; thrives on challenge. The risk is boredom, not struggle.",
    homeContext: "Stable, high-support home; plenty of books and conversation.",
    priorPlan: "Plan in motion: stretch band plus a small proof task, and a quarter-long writing-mechanics arc — pace is holding well.",
  },
};

export function humanPictureFor(studentId: string): HumanPicture | undefined {
  return humanPictures[studentId];
}
