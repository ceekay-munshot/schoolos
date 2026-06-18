/* ============================================================================
   Tomo School OS — domain types
   Mirrors the Tech Architecture PRD §8 data model. Every screen renders from
   these shapes; nothing is hard-coded in components, so the data can be
   "filled in" or swapped for a real backend later.
   ========================================================================== */

export type Persona = "teacher" | "coach" | "principal" | "parent" | "student";

export type Stage = "elementary" | "middle" | "high";

/** MasteryState machine (PRD §4: Placement). */
export type MasteryStatus =
  | "not-introduced"
  | "introduced"
  | "practising"
  | "mastered"
  | "retained"
  | "gap" // a prerequisite is broken
  | "faded"; // was mastered, recall slipping

export type JudgmentType = "objective" | "judgment";

export type PathKey =
  | "builder"
  | "explorer"
  | "scholar"
  | "athlete"
  | "artist"
  | "communicator";

/** The Sample → Specialise → Master arc (Broad Concept). */
export type PathStage = "sample" | "specialise" | "master";

export type EducatorRole =
  | "teacher"
  | "assistant"
  | "coach"
  | "principal"
  | "curriculum";

export interface School {
  name: string;
  campus: string;
  city: string;
  board: string;
  benchmark: string; // external validation, e.g. ACER
  annualFee: number;
  ibComparableFee: number;
  students: number;
  educators: number;
  houses: string[];
  foundedYear: number;
}

export interface Guardian {
  name: string;
  relation: string;
  occupation: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string; // "Class 5"
  gradeNum: number;
  house: string;
  stage: Stage;
  guardian: Guardian;
  joinedYear: number;
  /** leading metrics (PRD §5, per-child) */
  masteryVelocity: number; // nodes moved to Mastered / week
  expectedVelocity: number;
  gapDebt: number; // count × depth of unresolved prerequisite gaps
  retentionIntegrity: number; // 0–1
  independentWorkRatio: number; // 0–1
  attendance: number; // 0–1
  /** the chosen paths and where they are on the arc */
  paths: PathEnrolment[];
  /** short, human one-liner used across coach/parent surfaces */
  headline: string;
  /** optional coach flag for caseload priority */
  flag?: { tone: "watch" | "celebrate"; reason: string };
}

export interface Educator {
  id: string;
  name: string;
  role: EducatorRole;
  subject?: string;
  title: string;
  caseload?: number; // for coaches
}

export interface Subject {
  id: string;
  name: string;
  strands: string[];
  glyph: string; // single character / emoji used decoratively
}

export interface CompetencyNode {
  id: string; // MATH.FRAC.EQUIV.01
  subjectId: string;
  strand: string;
  statement: string;
  gradeBand: string;
  prerequisites: string[];
  bloom: "Remember" | "Understand" | "Apply" | "Analyse" | "Evaluate" | "Create";
  boardMap: string[]; // CBSE / NCF codes
  misconceptions: string[];
  judgmentType: JudgmentType;
  /** display order within a strand for the map */
  order: number;
}

export interface MasteryState {
  studentId: string;
  nodeId: string;
  status: MasteryStatus;
  confidence: number; // 0–1
  lastEvidence: string; // human phrase
}

export interface Worksheet {
  id: string;
  title: string;
  targetNodeIds: string[];
  difficulty: "support" | "core" | "stretch";
  forStudentIds: string[];
  includesSpacedReview: boolean;
  includesStretch: boolean;
  reviewStatus: "approved" | "needs-review";
}

export type BlockKind = "concept" | "path";

export interface Block {
  id: string;
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
  start: string; // "09:00"
  end: string; // "10:00"
  kind: BlockKind;
  label: string; // "Maths · Fractions" or "PATH · Builder"
  subjectId?: string;
  klass: string; // "Class 5 · Kaveri"
  room: string;
  educatorId: string;
  /** light flag surfaced on the week view (never alarming) */
  flag?: string;
}

export type LessonSectionKind =
  | "Instruction"
  | "1:1 Talk-buddy"
  | "Self-work"
  | "Activity";

export interface LessonSection {
  kind: LessonSectionKind;
  minutes: number;
  title: string;
  detail: string;
  aiNote: string;
  /** the override surface — the human is the decider of record (rule #2) */
  decision: "accepted" | "edited" | "pending";
}

export interface OneMove {
  headline: string; // "Riya + 3 — equivalent-fractions gap"
  studentIds: string[];
  nodeId: string;
  why: string;
  everyoneElse: string; // "Everyone else is set."
}

export interface LessonPlan {
  blockId: string;
  generatedBy: string;
  sections: LessonSection[];
  oneMove: OneMove;
  worksheetIds: string[];
}

/** PATH (Builder · Explorer · Scholar · Athlete · Artist · Communicator). */
export interface PathDef {
  key: PathKey;
  name: string;
  verb: string; // "Build things"
  blurb: string;
  glyph: string;
}

export interface PathEnrolment {
  path: PathKey;
  stage: PathStage;
  focus: "primary" | "secondary" | "sampling";
  standard: number; // rising standard of work, 0–100
  headline: string;
}

export interface PathArtifact {
  id: string;
  studentId: string;
  path: PathKey;
  title: string;
  date: string;
  standardRating: number; // 1–5
  note: string;
  group?: string; // mixed-age group label
}

export interface TutorSession {
  id: string;
  studentId: string;
  subjectId: string;
  topic: string;
  nodeId: string;
  date: string;
  turns: number;
  stuckPoint: string;
  unlockedBy: string;
  flaggedForTeacher?: string;
  minutes: number;
}

export type InsightScope = "teacher" | "coach" | "parent";
export type InsightStatus = "raw" | "confirmed" | "dismissed";

export interface Insight {
  id: string;
  scope: InsightScope;
  studentId: string;
  text: string;
  status: InsightStatus;
  date: string;
  evidence: string;
}

export interface CoachNote {
  id: string;
  studentId: string;
  coachId: string;
  date: string;
  context: string; // human truth the data can't see
  plan: string;
  studentVoice: string;
  parentVoice: string;
}

export interface ReviewQueueItem {
  id: string;
  kind: "low-confidence" | "judgment" | "content";
  studentId?: string;
  nodeId?: string;
  summary: string;
  detail: string;
}

export interface BenchmarkResult {
  cohort: string;
  term: string;
  predicted: number; // leading-metric prediction (percentile)
  actual: number; // ACER / board actual
}

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface GapCluster {
  nodeId: string;
  label: string;
  studentIds: string[];
}
