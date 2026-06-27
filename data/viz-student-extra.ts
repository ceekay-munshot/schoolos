// Skill graph data for each student profile
export type SkillNode = {
  id: string;
  label: string;
  status: "mastered" | "practising" | "gap" | "introduced" | "not-introduced";
  evidence?: string;
};

export type SkillEdge = { from: string; to: string };

export type SkillGraph = {
  nodes: SkillNode[];
  edges: SkillEdge[];
};

export const riyaSkillGraph: SkillGraph = {
  nodes: [
    { id: "MATH.FRAC.MEANING.01", label: "Fraction meaning",   status: "mastered",
      evidence: "Got this right 4 times in a row. It is secure." },
    { id: "MATH.FRAC.MEANING.02", label: "Number line",         status: "mastered",
      evidence: "Placed fractions on a number line correctly in three worksheets." },
    { id: "MATH.FRAC.EQUIV.01",   label: "Equal fractions",     status: "gap",
      evidence: "Working on this now. Two more checks and it will be secure." },
    { id: "MATH.FRAC.COMPARE.02", label: "Compare fractions",   status: "introduced" },
    { id: "MATH.FRAC.ADD.03",     label: "Add fractions",       status: "not-introduced" },
    { id: "MATH.FRAC.WORD.04",    label: "Word problems",       status: "not-introduced" },
  ],
  edges: [
    { from: "MATH.FRAC.MEANING.01", to: "MATH.FRAC.EQUIV.01" },
    { from: "MATH.FRAC.MEANING.02", to: "MATH.FRAC.EQUIV.01" },
    { from: "MATH.FRAC.EQUIV.01",   to: "MATH.FRAC.COMPARE.02" },
    { from: "MATH.FRAC.COMPARE.02", to: "MATH.FRAC.ADD.03" },
    { from: "MATH.FRAC.ADD.03",     to: "MATH.FRAC.WORD.04" },
  ],
};

// Mahira — Class 6, more skills
export const mahiraSkillGraph: SkillGraph = {
  nodes: [
    { id: "ENG.GRAMMAR.TENSE.01", label: "Simple tenses",    status: "mastered",
      evidence: "Used simple past correctly across five essays." },
    { id: "ENG.GRAMMAR.TENSE.02", label: "Perfect tenses",   status: "practising" },
    { id: "ENG.WRITING.PARA.01",  label: "Paragraph craft",  status: "mastered",
      evidence: "Topic sentences and support are consistently clear." },
    { id: "ENG.WRITING.PARA.02",  label: "Cohesion",         status: "introduced" },
    { id: "ENG.READING.INFER.01", label: "Inference",        status: "gap",
      evidence: "Can retrieve facts but struggles to read between the lines. Working on it." },
    { id: "ENG.READING.EVAL.02",  label: "Evaluation",       status: "not-introduced" },
  ],
  edges: [
    { from: "ENG.GRAMMAR.TENSE.01", to: "ENG.GRAMMAR.TENSE.02" },
    { from: "ENG.WRITING.PARA.01",  to: "ENG.WRITING.PARA.02" },
    { from: "ENG.READING.INFER.01", to: "ENG.READING.EVAL.02" },
  ],
};

// Aditya — Class 10, broader social science focus
export const adityaSkillGraph: SkillGraph = {
  nodes: [
    { id: "SOC.HIST.NATIONALISM.01", label: "Nationalism — rise",  status: "mastered",
      evidence: "Explained the causes and key events accurately in the timed essay." },
    { id: "SOC.HIST.NATIONALISM.02", label: "India's independence", status: "mastered" },
    { id: "SOC.CIVICS.DEMOCRACY.01", label: "Democratic institutions", status: "practising" },
    { id: "SOC.CIVICS.RIGHTS.02",    label: "Fundamental rights",  status: "introduced" },
    { id: "SOC.GEO.RESOURCES.01",    label: "Natural resources",   status: "mastered" },
    { id: "SOC.GEO.RESOURCES.02",    label: "Resource planning",   status: "gap",
      evidence: "Confuses scarcity with depletion. Needs one more focused session." },
    { id: "SOC.ECO.DEVELOPMENT.01",  label: "Development",         status: "not-introduced" },
  ],
  edges: [
    { from: "SOC.HIST.NATIONALISM.01", to: "SOC.HIST.NATIONALISM.02" },
    { from: "SOC.CIVICS.DEMOCRACY.01", to: "SOC.CIVICS.RIGHTS.02" },
    { from: "SOC.GEO.RESOURCES.01",    to: "SOC.GEO.RESOURCES.02" },
    { from: "SOC.GEO.RESOURCES.02",    to: "SOC.ECO.DEVELOPMENT.01" },
  ],
};

export const skillGraphByProfile: Record<string, SkillGraph> = {
  riya:   riyaSkillGraph,
  mahira: mahiraSkillGraph,
  aditya: adityaSkillGraph,
};

// Momentum ring data per profile
export type MomentumData = {
  streak: number; maxStreak: number;      // consecutive self-work days
  velocityThis: number; velocityLast: number;  // nodes mastered this week vs last
  masteredCount: number; totalCount: number;   // fraction of skills mastered
};

export const momentumByProfile: Record<string, MomentumData> = {
  riya:   { streak: 9,  maxStreak: 21, velocityThis: 2.3, velocityLast: 1.9, masteredCount: 2, totalCount: 6 },
  mahira: { streak: 14, maxStreak: 21, velocityThis: 3.1, velocityLast: 2.8, masteredCount: 2, totalCount: 6 },
  aditya: { streak: 6,  maxStreak: 14, velocityThis: 1.8, velocityLast: 2.1, masteredCount: 3, totalCount: 7 },
};

// Curriculum force graph — representative ~30 nodes spanning maths, english, science
export type CurriculumNode = {
  id: string; label: string; subject: "maths" | "english" | "science" | "social";
  status: "live" | "review" | "draft";
  grade: string;
};
export type CurriculumEdge = { from: string; to: string };

export const curriculumGraphNodes: CurriculumNode[] = [
  // Maths chain
  { id: "M.NUM.COUNT.01",    label: "Counting",           subject: "maths",   status: "live",   grade: "Class 1" },
  { id: "M.NUM.PLACE.02",    label: "Place value",        subject: "maths",   status: "live",   grade: "Class 2" },
  { id: "M.NUM.ADD.03",      label: "Addition",           subject: "maths",   status: "live",   grade: "Class 3" },
  { id: "M.NUM.MULT.04",     label: "Multiplication",     subject: "maths",   status: "live",   grade: "Class 4" },
  { id: "M.FRAC.MEANING.01", label: "Fraction meaning",   subject: "maths",   status: "live",   grade: "Class 5" },
  { id: "M.FRAC.EQUIV.01",   label: "Equal fractions",    subject: "maths",   status: "live",   grade: "Class 5" },
  { id: "M.FRAC.ADD.03",     label: "Add fractions",      subject: "maths",   status: "live",   grade: "Class 5" },
  { id: "M.RATIO.01",        label: "Ratio",              subject: "maths",   status: "live",   grade: "Class 6" },
  { id: "M.ALGEBRA.01",      label: "Algebra basics",     subject: "maths",   status: "review", grade: "Class 7" },
  { id: "M.ALGEBRA.02",      label: "Linear equations",   subject: "maths",   status: "draft",  grade: "Class 8" },
  // English chain
  { id: "E.READING.PHON.01", label: "Phonics",            subject: "english", status: "live",   grade: "Class 1" },
  { id: "E.READING.WORD.02", label: "Word recognition",   subject: "english", status: "live",   grade: "Class 2" },
  { id: "E.READING.COMP.03", label: "Comprehension",      subject: "english", status: "live",   grade: "Class 3" },
  { id: "E.READING.INFER.04",label: "Inference",          subject: "english", status: "live",   grade: "Class 5" },
  { id: "E.WRITING.SENT.01", label: "Sentence craft",     subject: "english", status: "live",   grade: "Class 2" },
  { id: "E.WRITING.PARA.02", label: "Paragraphs",         subject: "english", status: "live",   grade: "Class 4" },
  { id: "E.WRITING.ESSAY.03",label: "Essay structure",    subject: "english", status: "review", grade: "Class 7" },
  { id: "E.GRAMMAR.TENSE.01",label: "Tenses",             subject: "english", status: "live",   grade: "Class 4" },
  // Science chain
  { id: "S.LIVING.PLANTS.01",label: "Plants",             subject: "science", status: "live",   grade: "Class 2" },
  { id: "S.LIVING.ANIMALS.02",label: "Animals",           subject: "science", status: "live",   grade: "Class 3" },
  { id: "S.LIVING.CELLS.03", label: "Cells",              subject: "science", status: "live",   grade: "Class 6" },
  { id: "S.MATTER.STATES.01",label: "States of matter",   subject: "science", status: "live",   grade: "Class 4" },
  { id: "S.MATTER.CHEM.02",  label: "Chemical changes",   subject: "science", status: "draft",  grade: "Class 8" },
  { id: "S.FORCES.GRAV.01",  label: "Gravity",            subject: "science", status: "live",   grade: "Class 5" },
  { id: "S.FORCES.MOTION.02",label: "Motion & laws",      subject: "science", status: "review", grade: "Class 9" },
  // Social Science
  { id: "SS.HIST.ANCIENT.01",label: "Ancient India",      subject: "social",  status: "live",   grade: "Class 6" },
  { id: "SS.HIST.MUGHAL.02", label: "Mughal era",         subject: "social",  status: "live",   grade: "Class 7" },
  { id: "SS.HIST.NATIONAL.03",label: "Nationalism",       subject: "social",  status: "live",   grade: "Class 10" },
  { id: "SS.GEO.INDIA.01",   label: "India — land",       subject: "social",  status: "live",   grade: "Class 6" },
  { id: "SS.CIVICS.CONST.01",label: "Constitution",       subject: "social",  status: "draft",  grade: "Class 9" },
];

export const curriculumGraphEdges: CurriculumEdge[] = [
  // Maths prerequisites
  { from: "M.NUM.COUNT.01",    to: "M.NUM.PLACE.02" },
  { from: "M.NUM.PLACE.02",    to: "M.NUM.ADD.03" },
  { from: "M.NUM.ADD.03",      to: "M.NUM.MULT.04" },
  { from: "M.NUM.MULT.04",     to: "M.FRAC.MEANING.01" },
  { from: "M.FRAC.MEANING.01", to: "M.FRAC.EQUIV.01" },
  { from: "M.FRAC.EQUIV.01",   to: "M.FRAC.ADD.03" },
  { from: "M.FRAC.ADD.03",     to: "M.RATIO.01" },
  { from: "M.RATIO.01",        to: "M.ALGEBRA.01" },
  { from: "M.ALGEBRA.01",      to: "M.ALGEBRA.02" },
  // English prerequisites
  { from: "E.READING.PHON.01", to: "E.READING.WORD.02" },
  { from: "E.READING.WORD.02", to: "E.READING.COMP.03" },
  { from: "E.READING.COMP.03", to: "E.READING.INFER.04" },
  { from: "E.WRITING.SENT.01", to: "E.WRITING.PARA.02" },
  { from: "E.WRITING.PARA.02", to: "E.WRITING.ESSAY.03" },
  { from: "E.GRAMMAR.TENSE.01",to: "E.WRITING.PARA.02" },
  // Science prerequisites
  { from: "S.LIVING.PLANTS.01",to: "S.LIVING.ANIMALS.02" },
  { from: "S.LIVING.ANIMALS.02",to: "S.LIVING.CELLS.03" },
  { from: "S.MATTER.STATES.01",to: "S.MATTER.CHEM.02" },
  { from: "S.FORCES.GRAV.01",  to: "S.FORCES.MOTION.02" },
  // Social Science
  { from: "SS.HIST.ANCIENT.01",to: "SS.HIST.MUGHAL.02" },
  { from: "SS.HIST.MUGHAL.02", to: "SS.HIST.NATIONAL.03" },
];
