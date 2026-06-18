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
  "new-pattern": "New learning pattern to talk about",
  "path-dropping": "Taking part in PATH less",
  "unresolved-foundation": "A missing basic that keeps coming up",
  "parent-input": "Need to hear from a parent",
  "plan-review": "Time to review the plan",
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
    focus: "Keep the art win going; treat the maths dip as one small fix, not a slide.",
    agreed: "2026-06-05",
    reviewDate: "2026-06-20",
    status: "on-track",
    progress: 0.6,
    commitments: [
      { owner: "school", text: "Ms. Krishnan works with the equivalent-fractions group twice in the next two weeks, then checks if addition gets more accurate." },
      { owner: "student", text: "Riya keeps her fraction wall going and brings one piece she's proud of to the next check-in." },
      { owner: "parent", text: "At home, talk about maths as 'one thing we're working on' — no extra drills while mum is on night shifts." },
    ],
    note: "Riya is getting equivalent fractions right more often, and her addition mistakes are dropping too. Talking about it this way has clearly eased the worry at home.",
  },
  {
    id: "plan-reyansh",
    studentId: "stu-reyansh",
    focus: "Help what he's forgetting stick again after the move — gentle upkeep, no alarm.",
    agreed: "2026-06-06",
    reviewDate: "2026-06-21",
    status: "needs-review",
    progress: 0.35,
    commitments: [
      { owner: "school", text: "Add three quick review questions to Reyansh's own work each week on the Number topics he's forgetting." },
      { owner: "parent", text: "Keep weekday evenings steadier while the new house settles; keep a calm, regular wind-down." },
    ],
    note: "The review questions are showing up in his own work, but two of the three forgotten topics haven't come back round yet. Worth firming up at the review.",
  },
  {
    id: "plan-aarav",
    studentId: "stu-aarav",
    focus: "Give his fast pace somewhere real to go — harder problems, not more of the same.",
    agreed: "2026-06-03",
    reviewDate: "2026-06-23",
    status: "on-track",
    progress: 0.7,
    commitments: [
      { owner: "school", text: "Move Aarav into the harder maths group; build on his 'but why is it true?' habit with a small task where he shows why." },
      { owner: "student", text: "Pick one Communicator piece and take it from 'told well' to 'written well' over the term." },
    ],
    note: "The harder group is holding his attention without rushing the others. The writing work is a longer journey — still early days.",
  },
  {
    id: "plan-ishaan",
    studentId: "stu-ishaan",
    focus: "Gently close the gap that grew during the week he was ill.",
    agreed: "2026-06-04",
    reviewDate: "2026-06-19",
    status: "needs-review",
    progress: 0.4,
    commitments: [
      { owner: "school", text: "Put Ishaan in the equivalent-fractions group; rebuild MEANING.02 before moving on." },
      { owner: "parent", text: "No pressure to catch up the missed week — the school is folding it back in on purpose." },
      { owner: "student", text: "Use the support worksheet, and say the moment something stops making sense instead of pushing past it." },
    ],
    note: "Back in class and joining in. His gaps have stopped growing but haven't shrunk yet — the small group is the way to fix that.",
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
    action: "Met the equivalent-fractions group twice; then checked if addition got more accurate",
    owner: "school",
    due: "2026-06-19",
    impact: "changed",
    read: "Once equivalent fractions were fixed, addition mistakes dropped from 9-in-11 to 3-in-11 — fixing the root helped the rest.",
  },
  {
    id: "fu-riya-2",
    studentId: "stu-riya",
    action: "Talk about maths at home as 'one small fix' while mum is on night shifts",
    owner: "parent",
    due: "2026-06-12",
    impact: "changed",
    read: "Shobha says the worry at home has eased; Riya no longer calls herself 'bad at maths'.",
  },
  {
    id: "fu-reyansh-1",
    studentId: "stu-reyansh",
    action: "Add quick review questions to his own work on the Number topics he's forgetting",
    owner: "school",
    due: "2026-06-21",
    impact: "partial",
    read: "One of the three forgotten topics is back to passing; the other two need a second pass.",
  },
  {
    id: "fu-reyansh-2",
    studentId: "stu-reyansh",
    action: "Steadier weekday evenings while the new house settles",
    owner: "parent",
    due: "2026-06-21",
    impact: "not-yet",
    read: "The routine is still unsettled — the family is in the middle of moving. Worth coming back to gently, not treating as him slipping.",
  },
  {
    id: "fu-aarav-1",
    studentId: "stu-aarav",
    action: "Move into the harder maths group with a small task where he shows why",
    owner: "school",
    due: "2026-06-16",
    impact: "changed",
    read: "He's still working on his own about 90% of the time, and now he's finishing harder tasks instead of rushing through easy ones.",
  },
  {
    id: "fu-aarav-2",
    studentId: "stu-aarav",
    action: "Take one Communicator piece from 'told well' to 'written well'",
    owner: "student",
    due: "2026-06-23",
    impact: "not-yet",
    read: "Not started yet — getting his writing right is a term-long job we agreed at the last check-in, so it's not late.",
  },
  {
    id: "fu-ishaan-1",
    studentId: "stu-ishaan",
    action: "Rebuild MEANING.02 before moving on; put him in the equivalent-fractions group",
    owner: "school",
    due: "2026-06-19",
    impact: "partial",
    read: "His gaps have stopped growing. MEANING.02 is getting solid; equivalent fractions is still the part left to do.",
  },
  {
    id: "fu-diya-1",
    studentId: "stu-diya",
    action: "Keep the pace gentle; same equivalent-fractions group, no time pressure",
    owner: "school",
    due: "2026-06-25",
    impact: "partial",
    read: "Working more confidently in the group; still slow with new numbers, which is fine for now.",
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
    signal: "How much he works on his own, and how much he remembers, both dipped over the same three weeks.",
    context: "The dip in working on his own lined up with the family moving house.",
    directive: "Don't treat this as a real, lasting drop yet. Look again once his routine settles.",
  },
  {
    id: "ctx-riya-1",
    studentId: "stu-riya",
    date: "2026-06-05",
    signal: "Worksheet accuracy fell 18% and she's spending more time on the Artist path.",
    context: "Her mother is a heart doctor working long night shifts this month; home is quieter and Riya is leaning on art for confidence, not avoiding maths.",
    directive: "Read the maths dip as her confidence wobbling on one topic, not as her giving up. Keep showing her art as a real strength.",
  },
  {
    id: "ctx-ishaan-1",
    studentId: "stu-ishaan",
    date: "2026-06-04",
    signal: "Flagged early this week for not handing in much work.",
    context: "Ishaan was off school Monday and Tuesday with a fever.",
    directive: "Ignore that flag for this week. The growing gap is real and is being worked on through the small group.",
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
      label: "Fractions check — equivalent fractions",
      detail: "9 of the last 11 mistakes come back to MATH.FRAC.EQUIV.01, not to addition itself.",
      date: "2026-06-11",
    },
    {
      kind: "worksheet",
      label: "Adding fractions with different bottoms — her own work",
      detail: "Adds straight across (2/3 + 1/4 = 3/7). The slip comes from the equivalent-fractions gap.",
      date: "2026-06-10",
    },
    {
      kind: "path-artifact",
      label: "Madhubani fish — first ink try",
      detail: "Sure, steady lines and neater colour. Artist score going up 48 → 62.",
      date: "2026-06-09",
    },
    {
      kind: "coach-note",
      label: "Two-week check-in with Shobha Iyer",
      detail: "Mum on night shifts this month; the data couldn't see what's happening at home — she told me.",
      date: "2026-06-05",
    },
    {
      kind: "teacher-note",
      label: "Ms. Krishnan — small-group plan",
      detail: "Started the equivalent-fractions group this week; Riya is with Kabir, Diya and Ishaan.",
      date: "2026-06-08",
    },
  ],
  "stu-reyansh": [
    {
      kind: "assessment",
      label: "Memory check — Number",
      detail: "3 Number topics he'd learned before failed their last check; how much is sticking went 82% → 66%.",
      date: "2026-06-14",
    },
    {
      kind: "coach-note",
      label: "Check-in — the house move",
      detail: "Able child; this looks like he's forgetting things, not failing to understand them. Family moved in April.",
      date: "2026-06-06",
    },
    {
      kind: "worksheet",
      label: "His own work with review questions added in",
      detail: "A few light review questions added to keep things fresh; one forgotten topic already back to passing.",
      date: "2026-06-13",
    },
  ],
  "stu-ishaan": [
    {
      kind: "assessment",
      label: "Equivalent-fractions check",
      detail: "Has the same MATH.FRAC.EQUIV.01 gap as three classmates; MEANING.02 still shaky.",
      date: "2026-06-10",
    },
    {
      kind: "coach-note",
      label: "Note added — week off ill",
      detail: "Off Mon–Tue with a fever. Ignored the 'not handing in work' flag for that week.",
      date: "2026-06-04",
    },
    {
      kind: "teacher-note",
      label: "Ms. Krishnan — strong in discussion",
      detail: "Bright and talks well in class; the gap is in the steps, not in how far he can think.",
      date: "2026-06-09",
    },
  ],
  "stu-aarav": [
    {
      kind: "assessment",
      label: "Maths pace across lessons",
      detail: "Learning pace 2.7 against 2.0 expected; finishes his own work in about half the time.",
      date: "2026-06-17",
    },
    {
      kind: "worksheet",
      label: "Story writing — mixing up tenses",
      detail: "The computer caught ENG.GRAM.TENSE.02; whether the idea works was sent to the teacher to judge.",
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
    studentGoal: "“I want my fraction wall to look right and not feel like a trick I keep forgetting.”",
    parentConcern: "Shobha worried Riya had fallen behind in maths; reassured that it's one clear, named thing.",
    confidence: "Steady but a little shaky on maths; really proud of her art. Does well when told she's 'not behind, just fixing one thing'.",
    homeContext: "Mum is a heart doctor on long night shifts this month, so home is quieter and routines are looser than usual.",
    priorPlan: "Last two weeks: keep the art win, start the equivalent-fractions group, talk about the dip calmly at home — and it has worked.",
  },
  "stu-reyansh": {
    studentGoal: "“I knew it before — it just slips out. I want it to stick this time.”",
    parentConcern: "Pooja noticed the move was harder on him than they expected; keen not to make it a 'problem'.",
    confidence: "Able and aware of himself; a little annoyed that things he'd learned are slipping. Reassured this is keeping it fresh, not going backwards.",
    homeContext: "Family moved house in April; the routine, especially weekday evenings, is still settling in the new place.",
    priorPlan: "First plan this round: a few light review questions to keep things fresh, no alarm to parents — partly worked, needs a firmer second go.",
  },
  "stu-ishaan": {
    studentGoal: "“I want to catch up the bit I missed without it piling on top of me.”",
    parentConcern: "Sromona, an economics professor, wants the honest truth, not comfort; she wants the gap named and worked on, not smoothed over.",
    confidence: "Bright in discussion, quietly worried about the week he missed. Settles when catching up is framed as planned, not as falling behind.",
    homeContext: "Lost Monday and Tuesday to a fever; otherwise a steady, caring home.",
    priorPlan: "Plan going now: rebuild MEANING.02, fold the missed week back in, no pressure to catch up — his gaps have stopped growing.",
  },
  "stu-aarav": {
    studentGoal: "“Maths is easy — I want harder problems and to tell better stories.”",
    parentConcern: "Nikhil, a software architect, asks whether Aarav is being pushed enough rather than just kept busy.",
    confidence: "High and well-earned; loves a challenge. The risk is boredom, not struggling.",
    homeContext: "Steady, very supportive home; lots of books and talking.",
    priorPlan: "Plan going now: the harder group plus a small task where he shows why, and a term-long push on his writing — his pace is holding well.",
  },
};

export function humanPictureFor(studentId: string): HumanPicture | undefined {
  return humanPictures[studentId];
}
