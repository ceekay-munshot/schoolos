import type { CompetencyNode } from "./types";

/* L1 — the competency map (the spine). A directed prerequisite graph per
   subject, mapped to CBSE/NCF. The maths Fractions strand is authored fully so
   the "walk back down the map to the root gap" is a real graph walk:
   ADD.03 fails  →  because  →  EQUIV.01 is broken. */

export const competencyNodes: CompetencyNode[] = [
  // ---- Maths · prerequisites feeding fractions ----
  {
    id: "MATH.NUM.PARTITION.02",
    subjectId: "maths",
    strand: "Number",
    statement: "Partition shapes and sets into equal groups",
    gradeBand: "Class 3",
    prerequisites: [],
    bloom: "Understand",
    boardMap: ["CBSE Cl-3 Math 4.1", "NCF C-3.4"],
    misconceptions: ["Counts parts without checking they are equal"],
    judgmentType: "objective",
    order: 0,
  },
  {
    id: "MATH.MULT.TABLES.03",
    subjectId: "maths",
    strand: "Number",
    statement: "Recall multiplication facts to 10 × 10",
    gradeBand: "Class 4",
    prerequisites: [],
    bloom: "Remember",
    boardMap: ["CBSE Cl-4 Math 2.3"],
    misconceptions: ["Skip-counts under pressure instead of recalling"],
    judgmentType: "objective",
    order: 0,
  },
  // ---- Maths · Fractions strand (the hero chain) ----
  {
    id: "MATH.FRAC.MEANING.01",
    subjectId: "maths",
    strand: "Fractions",
    statement: "Understand a fraction as equal parts of a whole",
    gradeBand: "Class 4 (introduce)",
    prerequisites: ["MATH.NUM.PARTITION.02"],
    bloom: "Understand",
    boardMap: ["CBSE Cl-4 Math 7.1", "NCF C-4.7"],
    misconceptions: ["Reads 3/4 as 'three and four', not three of four equal parts"],
    judgmentType: "objective",
    order: 1,
  },
  {
    id: "MATH.FRAC.MEANING.02",
    subjectId: "maths",
    strand: "Fractions",
    statement: "Represent fractions on a number line and as part of a collection",
    gradeBand: "Class 4–5",
    prerequisites: ["MATH.FRAC.MEANING.01"],
    bloom: "Apply",
    boardMap: ["CBSE Cl-5 Math 7.2"],
    misconceptions: ["Places 1/2 by counting tick marks, ignoring interval size"],
    judgmentType: "objective",
    order: 2,
  },
  {
    id: "MATH.FRAC.EQUIV.01",
    subjectId: "maths",
    strand: "Fractions",
    statement: "Recognise and generate equivalent fractions",
    gradeBand: "Class 5 (apply)",
    prerequisites: ["MATH.FRAC.MEANING.02", "MATH.MULT.TABLES.03"],
    bloom: "Apply",
    boardMap: ["CBSE Cl-5 Math 7.3", "NCF C-5.7.2"],
    misconceptions: [
      "Multiplies only the numerator, not both parts",
      "Adds the same number to top and bottom to 'make' an equivalent fraction",
    ],
    judgmentType: "objective",
    order: 3,
  },
  {
    id: "MATH.FRAC.COMPARE.02",
    subjectId: "maths",
    strand: "Fractions",
    statement: "Compare and order unlike fractions",
    gradeBand: "Class 5",
    prerequisites: ["MATH.FRAC.EQUIV.01"],
    bloom: "Apply",
    boardMap: ["CBSE Cl-5 Math 7.4"],
    misconceptions: ["Thinks 1/8 > 1/4 because 8 > 4"],
    judgmentType: "objective",
    order: 4,
  },
  {
    id: "MATH.FRAC.ADD.03",
    subjectId: "maths",
    strand: "Fractions",
    statement: "Add and subtract unlike fractions",
    gradeBand: "Class 5–6",
    prerequisites: ["MATH.FRAC.EQUIV.01", "MATH.FRAC.COMPARE.02"],
    bloom: "Apply",
    boardMap: ["CBSE Cl-5 Math 7.5", "NCF C-5.7.3"],
    misconceptions: ["Adds numerators and denominators straight across (2/3 + 1/4 = 3/7)"],
    judgmentType: "objective",
    order: 5,
  },
  {
    id: "MATH.FRAC.WORD.04",
    subjectId: "maths",
    strand: "Fractions",
    statement: "Solve word problems involving fractions of a quantity",
    gradeBand: "Class 6",
    prerequisites: ["MATH.FRAC.ADD.03"],
    bloom: "Analyse",
    boardMap: ["CBSE Cl-6 Math 7.6"],
    misconceptions: ["Operates on the numbers given without modelling the situation"],
    judgmentType: "objective",
    order: 6,
  },

  // ---- English · the objective vs judgment split (Aarav's story) ----
  {
    id: "ENG.GRAM.TENSE.02",
    subjectId: "english",
    strand: "Grammar",
    statement: "Maintain a consistent past tense across a narrative",
    gradeBand: "Class 5",
    prerequisites: [],
    bloom: "Apply",
    boardMap: ["CBSE Cl-5 Eng G.4"],
    misconceptions: ["Switches between past and present mid-paragraph"],
    judgmentType: "objective", // the machine CAN catch the tense flip
    order: 1,
  },
  {
    id: "ENG.WRITE.NARR.05",
    subjectId: "english",
    strand: "Writing",
    statement: "Develop a narrative with a clear, well-carried idea",
    gradeBand: "Class 5",
    prerequisites: ["ENG.GRAM.TENSE.02"],
    bloom: "Create",
    boardMap: ["CBSE Cl-5 Eng W.2"],
    misconceptions: [],
    judgmentType: "judgment", // whether the IDEA is good is a teacher call
    order: 2,
  },
];

export const fractionStrand = competencyNodes
  .filter((n) => n.subjectId === "maths" && n.strand === "Fractions")
  .sort((a, b) => a.order - b.order);

export function nodeById(id: string) {
  return competencyNodes.find((n) => n.id === id);
}

export function nodesBySubject(subjectId: string) {
  return competencyNodes.filter((n) => n.subjectId === subjectId);
}

/** Walk back down the prerequisite graph to the deepest broken node. */
export function prerequisiteChain(nodeId: string): CompetencyNode[] {
  const out: CompetencyNode[] = [];
  let current = nodeById(nodeId);
  while (current && current.prerequisites.length) {
    const prev = nodeById(current.prerequisites[0]);
    if (!prev) break;
    out.push(prev);
    current = prev;
  }
  return out;
}
