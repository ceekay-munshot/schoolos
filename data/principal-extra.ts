import type { Confidence, SeriesPoint } from "./types";

/* ============================================================================
   Principal OS — operating data for the campus cockpit.
   Six leading signals, allocation & operations, people support, parents, and
   the enriched early-warning roster. Every number here is a leading indicator
   that moves before the board exam and is read against grade-expected pace.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   1 · The six leading signals (School Health home).
   Each carries: current value, an 8-week trend, a month-on-month delta, the
   grade most needing attention, the recommended responsible action, and the
   confidence in the read.
--------------------------------------------------------------------------- */
export interface HealthMetric {
  key: string;
  label: string;
  /** Numeric value, 0–1 for ratios or an absolute (nodes/week) for pace. */
  value: number;
  /** "ratio" renders as a percent; "pace" renders as nodes/week. */
  unit: "ratio" | "pace";
  /** Month-on-month change in the same unit (signed). */
  momDelta: number;
  /** 8-week sparkline series. */
  trend: SeriesPoint[];
  /** Grade or cohort most needing attention right now. */
  gradeNeedingAttention: string;
  /** The recommended one move and who carries it. */
  action: string;
  owner: string;
  confidence: Confidence;
  /** Whether a rise is the healthy direction. Gap-debt falls when healthy. */
  goodWhenRising: boolean;
}

export const healthMetrics: HealthMetric[] = [
  {
    key: "pace",
    label: "Learning pace",
    value: 2.15,
    unit: "pace",
    momDelta: 0.18,
    trend: [
      { label: "W1", value: 1.86 },
      { label: "W2", value: 1.9 },
      { label: "W3", value: 1.95 },
      { label: "W4", value: 2.0 },
      { label: "W5", value: 2.04 },
      { label: "W6", value: 2.1 },
      { label: "W7", value: 2.13 },
      { label: "W8", value: 2.15 },
    ],
    gradeNeedingAttention: "Class 7",
    action: "Class 7 is keeping up with grade pace but not pulling ahead. Head of Curriculum to look at the order of the Number topics with the two Class 7 teachers.",
    owner: "Dr. Vikram Iyer",
    confidence: "high",
    goodWhenRising: true,
  },
  {
    key: "gap-debt",
    label: "Missing basics",
    value: 3.1,
    unit: "pace",
    momDelta: -0.8,
    trend: [
      { label: "W1", value: 4.8 },
      { label: "W2", value: 4.6 },
      { label: "W3", value: 4.7 },
      { label: "W4", value: 4.2 },
      { label: "W5", value: 3.9 },
      { label: "W6", value: 3.6 },
      { label: "W7", value: 3.3 },
      { label: "W8", value: 3.1 },
    ],
    gradeNeedingAttention: "Class 5",
    action: "Class 5 has the most missing basics (the equivalent-fractions group). Coach to run a small group every two weeks until that basic is sorted.",
    owner: "Rohan D'Souza",
    confidence: "high",
    goodWhenRising: false,
  },
  {
    key: "retention",
    label: "How much is sticking",
    value: 0.87,
    unit: "ratio",
    momDelta: 0.02,
    trend: [
      { label: "W1", value: 0.82 },
      { label: "W2", value: 0.83 },
      { label: "W3", value: 0.84 },
      { label: "W4", value: 0.85 },
      { label: "W5", value: 0.85 },
      { label: "W6", value: 0.86 },
      { label: "W7", value: 0.865 },
      { label: "W8", value: 0.87 },
    ],
    gradeNeedingAttention: "Class 4",
    action: "Class 4 did less review after the term break. Teachers to bring back the weekly recall worksheet for Number and Measurement.",
    owner: "Lakshmi Krishnan",
    confidence: "high",
    goodWhenRising: true,
  },
  {
    key: "path",
    label: "PATH — taking part and progress",
    value: 0.91,
    unit: "ratio",
    momDelta: 0.03,
    trend: [
      { label: "W1", value: 0.84 },
      { label: "W2", value: 0.85 },
      { label: "W3", value: 0.87 },
      { label: "W4", value: 0.88 },
      { label: "W5", value: 0.88 },
      { label: "W6", value: 0.9 },
      { label: "W7", value: 0.9 },
      { label: "W8", value: 0.91 },
    ],
    gradeNeedingAttention: "Class 6",
    action: "The Class 6 Athlete group doesn't have much work to show yet. Coach to make sure each child has a named project for this term.",
    owner: "Rohan D'Souza",
    confidence: "medium",
    goodWhenRising: true,
  },
  {
    key: "usage",
    label: "Using the system and scanning work",
    value: 0.94,
    unit: "ratio",
    momDelta: 0.01,
    trend: [
      { label: "W1", value: 0.9 },
      { label: "W2", value: 0.91 },
      { label: "W3", value: 0.92 },
      { label: "W4", value: 0.92 },
      { label: "W5", value: 0.93 },
      { label: "W6", value: 0.93 },
      { label: "W7", value: 0.935 },
      { label: "W8", value: 0.94 },
    ],
    gradeNeedingAttention: "Class 4 · Narmada",
    action: "Scanning in Class 4 Narmada slips on Fridays. Operations to move the afternoon scan to before the PATH block and check the second station is set up right.",
    owner: "Priya Nair",
    confidence: "high",
    goodWhenRising: true,
  },
  {
    key: "parents",
    label: "Parents — involved and staying",
    value: 0.86,
    unit: "ratio",
    momDelta: 0.02,
    trend: [
      { label: "W1", value: 0.8 },
      { label: "W2", value: 0.81 },
      { label: "W3", value: 0.82 },
      { label: "W4", value: 0.83 },
      { label: "W5", value: 0.84 },
      { label: "W6", value: 0.85 },
      { label: "W7", value: 0.855 },
      { label: "W8", value: 0.86 },
    ],
    gradeNeedingAttention: "Class 8",
    action: "Class 8 parents open the app the least, and two have not booked the term check-in. Coach to call them personally before the window closes.",
    owner: "Rohan D'Souza",
    confidence: "medium",
    goodWhenRising: true,
  },
];

/* ---------------------------------------------------------------------------
   2 · Learning — board-readiness alongside mastery for Classes 9–12.
   Board-readiness is the leading read on exam preparedness; mastery is the
   underlying competency coverage. The two move together when the engine works.
--------------------------------------------------------------------------- */
export interface BoardReadiness {
  grade: string;
  students: number;
  mastery: number; // 0–1, competency coverage
  readiness: number; // 0–1, leading board-readiness
  stream: string;
  confidence: Confidence;
}

export const boardReadiness: BoardReadiness[] = [
  { grade: "Class 9", students: 118, mastery: 0.83, readiness: 0.79, stream: "Foundation · CBSE", confidence: "high" },
  { grade: "Class 10", students: 112, mastery: 0.86, readiness: 0.84, stream: "Board year · CBSE", confidence: "high" },
  { grade: "Class 11", students: 104, mastery: 0.81, readiness: 0.76, stream: "Science & Commerce", confidence: "medium" },
  { grade: "Class 12", students: 98, mastery: 0.85, readiness: 0.82, stream: "Board year · CBSE", confidence: "high" },
];

/** Students on / ahead of / behind the grade map, school-wide (leading read). */
export const gradeMapStanding = {
  ahead: 0.34,
  onTrack: 0.51,
  behind: 0.15,
};

/** Unresolved foundational gaps by grade & subject — count of open root gaps. */
export interface GapCell {
  grade: string;
  maths: number;
  english: number;
  science: number;
  social: number;
}

export const gapsByGradeSubject: GapCell[] = [
  { grade: "Class 4", maths: 9, english: 4, science: 3, social: 2 },
  { grade: "Class 5", maths: 14, english: 5, science: 4, social: 2 },
  { grade: "Class 6", maths: 8, english: 6, science: 5, social: 3 },
  { grade: "Class 7", maths: 7, english: 5, science: 6, social: 4 },
  { grade: "Class 8", maths: 6, english: 4, science: 5, social: 3 },
];

/* ---------------------------------------------------------------------------
   3 · Operations — allocation, utilisation, attendance, capture, tutor, sync.
--------------------------------------------------------------------------- */
export interface RoomAllocation {
  room: string;
  group: string;
  teacher: string;
  assistant: string;
  capacity: number;
  enrolled: number;
}

export const rooms: RoomAllocation[] = [
  { room: "Numbers Room 2", group: "Class 5 · Kaveri", teacher: "Lakshmi Krishnan", assistant: "Priya Nair", capacity: 26, enrolled: 22 },
  { room: "Numbers Room 1", group: "Class 5 · Ganga", teacher: "Suresh Rao", assistant: "Meghna Pillai", capacity: 26, enrolled: 24 },
  { room: "Language Studio", group: "Class 6 · Yamuna", teacher: "Anindita Bose", assistant: "Farah Sheikh", capacity: 28, enrolled: 25 },
  { room: "Discovery Room", group: "Class 4 · Narmada", teacher: "Pawan Singh", assistant: "Reshma Nair", capacity: 24, enrolled: 23 },
  { room: "Numbers Room 3", group: "Class 6 · Kaveri", teacher: "Ramesh Iyer", assistant: "Divya Menon", capacity: 28, enrolled: 26 },
  { room: "Maker Workshop", group: "PATH · Builder (mixed-age)", teacher: "Joseph Mathew", assistant: "Kabir Ahuja", capacity: 20, enrolled: 18 },
  { room: "Studio East", group: "PATH · Artist (mixed-age)", teacher: "Sunita Deshmukh", assistant: "—", capacity: 20, enrolled: 16 },
  { room: "Black Box", group: "PATH · Communicator (mixed-age)", teacher: "Anjali Verma", assistant: "—", capacity: 22, enrolled: 19 },
];

export interface AttendanceRow {
  group: string;
  present: number;
  total: number;
}

export const attendance: AttendanceRow[] = [
  { group: "Class 4 · Narmada", present: 22, total: 23 },
  { group: "Class 5 · Kaveri", present: 21, total: 22 },
  { group: "Class 5 · Ganga", present: 23, total: 24 },
  { group: "Class 6 · Kaveri", present: 25, total: 26 },
  { group: "Class 6 · Yamuna", present: 24, total: 25 },
];

export const physicalAttendanceToday = 0.965;

export interface CaptureStation {
  location: string;
  scans: number;
  missed: number;
  lastSync: string; // human phrase
  status: "healthy" | "watch";
}

export const captureStations: CaptureStation[] = [
  { location: "Numbers Room 2 · station A", scans: 214, missed: 3, lastSync: "12 minutes ago", status: "healthy" },
  { location: "Numbers Room 1 · station A", scans: 198, missed: 6, lastSync: "20 minutes ago", status: "healthy" },
  { location: "Language Studio · station A", scans: 176, missed: 4, lastSync: "8 minutes ago", status: "healthy" },
  { location: "Discovery Room · station A", scans: 142, missed: 17, lastSync: "1 hour ago", status: "watch" },
  { location: "Front office · walk-up", scans: 88, missed: 2, lastSync: "5 minutes ago", status: "healthy" },
];

export const tutorAvailability = {
  uptime: 0.998,
  activeStudentsThisWeek: 0.78, // of MS/HS
  sessionsThisWeek: 412,
  medianTurns: 11,
  flaggedForTeacher: 14, // deferred to a human decision
};

export interface SyncRow {
  surface: string;
  pending: number;
  oldestPending: string; // human phrase
  state: "synced" | "pending";
}

export const syncHealth: SyncRow[] = [
  { surface: "Worksheet scanning", pending: 0, oldestPending: "—", state: "synced" },
  { surface: "Teacher marking", pending: 2, oldestPending: "Discovery Room · 1 hour ago", state: "pending" },
  { surface: "Tutor sessions", pending: 0, oldestPending: "—", state: "synced" },
  { surface: "PATH work", pending: 1, oldestPending: "Maker Workshop · 35 minutes ago", state: "pending" },
];

export const offlineHealth = {
  devicesOnline: 41,
  devicesTotal: 43,
  lastFullSync: "today, 1:10 pm",
};

/* ---------------------------------------------------------------------------
   4 · People — SAFE LANGUAGE ONLY. System adoption, Classroom independence,
   Recommended-action follow-through, Support required. Support is framed as
   a training opportunity, never as blame.
--------------------------------------------------------------------------- */
export interface PeopleSection {
  section: string;
  teacher: string;
  assistant: string;
  adoption: number; // System adoption, 0–1
  independence: number; // Classroom independence, 0–1
  followThrough: number; // Recommended-action follow-through, 0–1
  /** When present, this section has a named training opportunity. */
  support?: string;
}

export const peopleSections: PeopleSection[] = [
  { section: "Class 5 · Kaveri", teacher: "Lakshmi Krishnan", assistant: "Priya Nair", adoption: 0.96, independence: 0.84, followThrough: 0.92 },
  { section: "Class 5 · Ganga", teacher: "Suresh Rao", assistant: "Meghna Pillai", adoption: 0.93, independence: 0.81, followThrough: 0.88 },
  { section: "Class 6 · Yamuna", teacher: "Anindita Bose", assistant: "Farah Sheikh", adoption: 0.95, independence: 0.88, followThrough: 0.9 },
  {
    section: "Class 4 · Narmada",
    teacher: "Pawan Singh",
    assistant: "Reshma Nair",
    adoption: 0.82,
    independence: 0.73,
    followThrough: 0.81,
    support: "New to the campus this term. Paired with Lakshmi Krishnan for two planning sessions on running the self-work block — early signs are already improving.",
  },
  { section: "Class 6 · Kaveri", teacher: "Ramesh Iyer", assistant: "Divya Menon", adoption: 0.94, independence: 0.85, followThrough: 0.87 },
];

/* ---------------------------------------------------------------------------
   5 · Parents — engagement & retention signals by cohort.
--------------------------------------------------------------------------- */
export interface ParentCohort {
  cohort: string;
  appEngagement: number; // 0–1, active on the app
  checkInAttendance: number; // 0–1, booked & attended the term check-in
  sentiment: number; // 0–1, positive sentiment from check-ins & messages
  retentionSignal: "strong" | "steady" | "watch";
}

export const parentEngagement: ParentCohort[] = [
  { cohort: "Class 4", appEngagement: 0.89, checkInAttendance: 0.94, sentiment: 0.91, retentionSignal: "strong" },
  { cohort: "Class 5", appEngagement: 0.9, checkInAttendance: 0.96, sentiment: 0.92, retentionSignal: "strong" },
  { cohort: "Class 6", appEngagement: 0.86, checkInAttendance: 0.91, sentiment: 0.88, retentionSignal: "steady" },
  { cohort: "Class 7", appEngagement: 0.83, checkInAttendance: 0.88, sentiment: 0.85, retentionSignal: "steady" },
  { cohort: "Class 8", appEngagement: 0.79, checkInAttendance: 0.82, sentiment: 0.8, retentionSignal: "watch" },
];

export const parentSummary = {
  active: 0.86,
  checkInsBooked: 0.9,
  positiveSentiment: 0.88,
  /** Re-enrolment intent gathered at the term check-in — the attrition early signal. */
  reEnrolmentIntent: 0.94,
};

export const parentSentimentTrend: SeriesPoint[] = [
  { label: "Jan", value: 0.84 },
  { label: "Feb", value: 0.85 },
  { label: "Mar", value: 0.86 },
  { label: "Apr", value: 0.87 },
  { label: "May", value: 0.875 },
  { label: "Jun", value: 0.88 },
];

/* ---------------------------------------------------------------------------
   6 · Early-warning — every row carries evidence, confidence, a suggested
   next step, a responsible person, and a follow-up date. Keyed to students.
--------------------------------------------------------------------------- */
export interface EarlyWarningRow {
  studentId: string;
  evidence: string;
  confidence: Confidence;
  nextStep: string;
  owner: string;
  followUpDate: string; // ISO
}

export const earlyWarningRows: EarlyWarningRow[] = [
  {
    studentId: "stu-riya",
    evidence: "Equivalent fractions has been a gap for three weeks, and it is now breaking her column addition in the worksheets we scan.",
    confidence: "high",
    nextStep: "Bring her into the equivalent-fractions small group. Fix this basic first, before starting addition of unlike fractions.",
    owner: "Lakshmi Krishnan",
    followUpDate: "2026-06-25",
  },
  {
    studentId: "stu-ishaan",
    evidence: "Missing basics in Number have grown three weeks in a row, and how much he does on his own is slipping with it.",
    confidence: "high",
    nextStep: "Add him to the same small group. Coach to check in every two weeks on his confidence, not just whether he gets answers right.",
    owner: "Rohan D'Souza",
    followUpDate: "2026-06-24",
  },
  {
    studentId: "stu-reyansh",
    evidence: "How much is sticking has dropped to 0.66 — three Number skills he had learned slipped away over the last two weeks.",
    confidence: "high",
    nextStep: "Bring back a review worksheet twice a week. Check the three faded skills again in ten days.",
    owner: "Lakshmi Krishnan",
    followUpDate: "2026-06-28",
  },
  {
    studentId: "stu-kabir",
    evidence: "Has the same equivalent-fractions gap as the rest of the Class 5 group, and his pace has slipped below grade level this month.",
    confidence: "medium",
    nextStep: "Same small group as Riya. One focused worksheet should sort it, since he reasons well as a builder.",
    owner: "Lakshmi Krishnan",
    followUpDate: "2026-06-26",
  },
  {
    studentId: "stu-diya",
    evidence: "Works carefully but slowly. The equivalent-fractions gap is what's holding her up, and how much is sticking has eased to 0.74.",
    confidence: "medium",
    nextStep: "Add her to the small group and give extra time on the check. Hold off on timed practice until this basic is sorted.",
    owner: "Lakshmi Krishnan",
    followUpDate: "2026-06-27",
  },
  {
    studentId: "stu-shaurya",
    evidence: "The tutor has flagged the same 'adds the bottom numbers straight across' mistake over two weeks. Missing basics now at 2.",
    confidence: "medium",
    nextStep: "Teacher to check this mix-up in person, then give a worksheet on finding a common denominator.",
    owner: "Anindita Bose",
    followUpDate: "2026-06-29",
  },
];
