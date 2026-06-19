import type { CompetencyNode } from "./types";
import { competencyNodes } from "./competency";

/* ============================================================================
   Curriculum OS — the authoring source of truth.
   Dr. Vikram Iyer (Head of Curriculum) authors and versions the skill map for
   every grade: what each child should master, in what order, mapped to CBSE /
   NCF. Change the map once here and every class, worksheet and report follows.

   This file owns the *authoring* layer: the grade-by-grade skill map, the
   pending change requests waiting on a human decision, and the version history
   of the map. It reuses the real competency nodes from data/competency.ts for
   Class 5 Maths · Fractions and Class 5 English so the map stays one truth.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   Authoring status — where a node sits in its review cycle.
   "published" is live for every class; "draft" is being written; "in-review"
   has a change waiting on Dr. Iyer's decision.
--------------------------------------------------------------------------- */
export type AuthoringStatus = "published" | "draft" | "in-review";

/** A competency node plus the authoring state the map editor needs. */
export interface AuthoredNode extends CompetencyNode {
  status: AuthoringStatus;
}

export interface GradeStrand {
  name: string;
  nodes: AuthoredNode[];
}

export interface GradeSubject {
  subjectId: string;
  subjectName: string;
  glyph: string;
  strands: GradeStrand[];
}

export interface GradeCurriculum {
  grade: string; // "Class 5"
  gradeNum: number; // 5
  stage: "Foundational" | "Preparatory" | "Middle" | "Secondary";
  subjects: GradeSubject[];
}

/* Small helper so reused nodes pick up an authoring status without repeating
   every field. Most live nodes are published. */
function published(n: CompetencyNode): AuthoredNode {
  return { ...n, status: "published" };
}

/* The real Fractions strand + the two English nodes, pulled straight from the
   shared map so Class 5 stays a single source of truth. */
const class5MathsFractions = competencyNodes
  .filter((n) => n.subjectId === "maths" && n.strand === "Fractions")
  .sort((a, b) => a.order - b.order)
  .map(published);

const class5English = competencyNodes
  .filter((n) => n.subjectId === "english")
  .sort((a, b) => a.order - b.order)
  .map(published);

/* ---------------------------------------------------------------------------
   The grade map. Class 3–10. A few grades are authored richly (Class 3, 5, 6,
   8); the rest carry a real, lighter spine. IDs follow the house pattern
   SUBJECT.STRAND.SKILL.NN; board codes map to CBSE chapters and NCF outcomes.
--------------------------------------------------------------------------- */
export const gradeCurricula: GradeCurriculum[] = [
  /* ===================== CLASS 3 ===================== */
  {
    grade: "Class 3",
    gradeNum: 3,
    stage: "Foundational",
    subjects: [
      {
        subjectId: "maths",
        subjectName: "Mathematics",
        glyph: "∑",
        strands: [
          {
            name: "Number",
            nodes: [
              {
                id: "MATH.NUM.PLACE.01",
                subjectId: "maths",
                strand: "Number",
                statement: "Read, write and compare numbers up to 999",
                gradeBand: "Class 3",
                prerequisites: [],
                bloom: "Understand",
                boardMap: ["CBSE Cl-3 Math 1.2", "NCF C-3.1"],
                misconceptions: ["Reads 305 as 'thirty-five', dropping the zero"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
              {
                id: "MATH.NUM.ADD.02",
                subjectId: "maths",
                strand: "Number",
                statement: "Add two-digit numbers with carrying",
                gradeBand: "Class 3",
                prerequisites: ["MATH.NUM.PLACE.01"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-3 Math 3.1"],
                misconceptions: ["Writes the carry below the line instead of adding it on"],
                judgmentType: "objective",
                order: 1,
                status: "published",
              },
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
                order: 2,
                status: "published",
              },
            ],
          },
          {
            name: "Measurement",
            nodes: [
              {
                id: "MATH.MEAS.LENGTH.01",
                subjectId: "maths",
                strand: "Measurement",
                statement: "Measure length in centimetres and metres",
                gradeBand: "Class 3",
                prerequisites: ["MATH.NUM.PLACE.01"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-3 Math 6.1", "NCF C-3.6"],
                misconceptions: ["Starts measuring from 1 on the ruler, not 0"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "english",
        subjectName: "English",
        glyph: "Aa",
        strands: [
          {
            name: "Reading",
            nodes: [
              {
                id: "ENG.READ.DECODE.01",
                subjectId: "english",
                strand: "Reading",
                statement: "Read aloud simple sentences with blends and digraphs",
                gradeBand: "Class 3",
                prerequisites: [],
                bloom: "Apply",
                boardMap: ["CBSE Cl-3 Eng R.1", "NCF C-3.L1"],
                misconceptions: ["Guesses the word from the first letter alone"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
              {
                id: "ENG.READ.RETELL.02",
                subjectId: "english",
                strand: "Reading",
                statement: "Retell a short story in the right order",
                gradeBand: "Class 3",
                prerequisites: ["ENG.READ.DECODE.01"],
                bloom: "Understand",
                boardMap: ["CBSE Cl-3 Eng R.3"],
                misconceptions: ["Recalls a favourite part, not the whole sequence"],
                judgmentType: "judgment",
                order: 1,
                status: "published",
              },
            ],
          },
          {
            name: "Writing",
            nodes: [
              {
                id: "ENG.WRITE.SENT.01",
                subjectId: "english",
                strand: "Writing",
                statement: "Write simple sentences with capital letters and full stops",
                gradeBand: "Class 3",
                prerequisites: [],
                bloom: "Apply",
                boardMap: ["CBSE Cl-3 Eng W.1"],
                misconceptions: ["Runs two ideas together with no full stop"],
                judgmentType: "objective",
                order: 0,
                status: "draft",
              },
            ],
          },
        ],
      },
      {
        subjectId: "science",
        subjectName: "Science / EVS",
        glyph: "✦",
        strands: [
          {
            name: "Living World",
            nodes: [
              {
                id: "EVS.LIFE.PLANTS.01",
                subjectId: "science",
                strand: "Living World",
                statement: "Name the parts of a plant and what each part does",
                gradeBand: "Class 3",
                prerequisites: [],
                bloom: "Remember",
                boardMap: ["CBSE Cl-3 EVS 4", "NCF C-3.E2"],
                misconceptions: ["Thinks roots only hold the plant, not take in water"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
    ],
  },

  /* ===================== CLASS 4 ===================== */
  {
    grade: "Class 4",
    gradeNum: 4,
    stage: "Foundational",
    subjects: [
      {
        subjectId: "maths",
        subjectName: "Mathematics",
        glyph: "∑",
        strands: [
          {
            name: "Number",
            nodes: [
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
                status: "published",
              },
              {
                id: "MATH.NUM.DIVIDE.04",
                subjectId: "maths",
                strand: "Number",
                statement: "Divide a two-digit number by a one-digit number",
                gradeBand: "Class 4",
                prerequisites: ["MATH.MULT.TABLES.03"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-4 Math 5.2", "NCF C-4.2"],
                misconceptions: ["Ignores the remainder rather than naming it"],
                judgmentType: "objective",
                order: 1,
                status: "published",
              },
            ],
          },
          {
            name: "Fractions",
            nodes: [
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
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "english",
        subjectName: "English",
        glyph: "Aa",
        strands: [
          {
            name: "Grammar",
            nodes: [
              {
                id: "ENG.GRAM.NOUN.01",
                subjectId: "english",
                strand: "Grammar",
                statement: "Tell common, proper and collective nouns apart",
                gradeBand: "Class 4",
                prerequisites: [],
                bloom: "Understand",
                boardMap: ["CBSE Cl-4 Eng G.2"],
                misconceptions: ["Capitalises every noun, not only proper ones"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
          {
            name: "Reading",
            nodes: [
              {
                id: "ENG.READ.INFER.03",
                subjectId: "english",
                strand: "Reading",
                statement: "Answer simple inference questions about a passage",
                gradeBand: "Class 4",
                prerequisites: ["ENG.READ.RETELL.02"],
                bloom: "Analyse",
                boardMap: ["CBSE Cl-4 Eng R.4"],
                misconceptions: ["Looks only for words copied straight from the text"],
                judgmentType: "judgment",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
    ],
  },

  /* ===================== CLASS 5 (rich — reuses the real map) ===================== */
  {
    grade: "Class 5",
    gradeNum: 5,
    stage: "Preparatory",
    subjects: [
      {
        subjectId: "maths",
        subjectName: "Mathematics",
        glyph: "∑",
        strands: [
          {
            name: "Number",
            nodes: [
              {
                id: "MATH.NUM.LARGE.05",
                subjectId: "maths",
                strand: "Number",
                statement: "Read, write and round numbers up to ten lakh",
                gradeBand: "Class 5",
                prerequisites: ["MATH.NUM.PLACE.01"],
                bloom: "Understand",
                boardMap: ["CBSE Cl-5 Math 1.1", "NCF C-5.1"],
                misconceptions: ["Drops a place when writing across the lakh boundary"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
              {
                id: "MATH.DEC.MEANING.06",
                subjectId: "maths",
                strand: "Number",
                statement: "Understand tenths and hundredths as decimals",
                gradeBand: "Class 5",
                prerequisites: ["MATH.FRAC.MEANING.02"],
                bloom: "Understand",
                boardMap: ["CBSE Cl-5 Math 8.1", "NCF C-5.8"],
                misconceptions: ["Reads 0.7 as smaller than 0.07 by counting digits"],
                judgmentType: "objective",
                order: 1,
                status: "published",
              },
            ],
          },
          { name: "Fractions", nodes: class5MathsFractions },
          {
            name: "Geometry",
            nodes: [
              {
                id: "MATH.GEO.ANGLE.01",
                subjectId: "maths",
                strand: "Geometry",
                statement: "Name and compare angles as right, acute and obtuse",
                gradeBand: "Class 5",
                prerequisites: [],
                bloom: "Understand",
                boardMap: ["CBSE Cl-5 Math 9.1", "NCF C-5.9"],
                misconceptions: ["Judges an angle by the length of its arms"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "english",
        subjectName: "English",
        glyph: "Aa",
        strands: [
          {
            name: "Grammar",
            nodes: class5English.filter((n) => n.strand === "Grammar"),
          },
          {
            name: "Writing",
            nodes: class5English.filter((n) => n.strand === "Writing"),
          },
          {
            name: "Reading",
            nodes: [
              {
                id: "ENG.READ.MAIN.04",
                subjectId: "english",
                strand: "Reading",
                statement: "Find the main idea of a paragraph and support it",
                gradeBand: "Class 5",
                prerequisites: ["ENG.READ.INFER.03"],
                bloom: "Analyse",
                boardMap: ["CBSE Cl-5 Eng R.5"],
                misconceptions: ["Picks the first sentence as the main idea every time"],
                judgmentType: "judgment",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "science",
        subjectName: "Science / EVS",
        glyph: "✦",
        strands: [
          {
            name: "Matter",
            nodes: [
              {
                id: "EVS.MATTER.STATES.01",
                subjectId: "science",
                strand: "Matter",
                statement: "Sort everyday things as solids, liquids and gases",
                gradeBand: "Class 5",
                prerequisites: [],
                bloom: "Understand",
                boardMap: ["CBSE Cl-5 EVS 6", "NCF C-5.E1"],
                misconceptions: ["Thinks anything that flows must be a liquid, including sand"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
          {
            name: "Living World",
            nodes: [
              {
                id: "EVS.LIFE.FOOD.02",
                subjectId: "science",
                strand: "Living World",
                statement: "Group foods by where they come from and what they give us",
                gradeBand: "Class 5",
                prerequisites: ["EVS.LIFE.PLANTS.01"],
                bloom: "Understand",
                boardMap: ["CBSE Cl-5 EVS 2"],
                misconceptions: ["Sorts food by taste rather than by its source"],
                judgmentType: "objective",
                order: 0,
                status: "in-review",
              },
            ],
          },
        ],
      },
      {
        subjectId: "social",
        subjectName: "Social Science",
        glyph: "◷",
        strands: [
          {
            name: "Geography",
            nodes: [
              {
                id: "SST.GEO.MAPS.01",
                subjectId: "social",
                strand: "Geography",
                statement: "Read directions and simple symbols on a map",
                gradeBand: "Class 5",
                prerequisites: [],
                bloom: "Apply",
                boardMap: ["CBSE Cl-5 EVS 11", "NCF C-5.S2"],
                misconceptions: ["Reads the map as a picture, ignoring the key"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
    ],
  },

  /* ===================== CLASS 6 (rich) ===================== */
  {
    grade: "Class 6",
    gradeNum: 6,
    stage: "Middle",
    subjects: [
      {
        subjectId: "maths",
        subjectName: "Mathematics",
        glyph: "∑",
        strands: [
          {
            name: "Fractions",
            nodes: [
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
                order: 0,
                status: "published",
              },
            ],
          },
          {
            name: "Number",
            nodes: [
              {
                id: "MATH.INT.LINE.01",
                subjectId: "maths",
                strand: "Number",
                statement: "Place and order integers on a number line",
                gradeBand: "Class 6",
                prerequisites: [],
                bloom: "Understand",
                boardMap: ["CBSE Cl-6 Math 6.1", "NCF C-6.1"],
                misconceptions: ["Thinks -5 is greater than -2 because 5 is greater than 2"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
              {
                id: "MATH.RATIO.MEANING.02",
                subjectId: "maths",
                strand: "Number",
                statement: "Understand ratio as a comparison of two quantities",
                gradeBand: "Class 6",
                prerequisites: ["MATH.FRAC.EQUIV.01"],
                bloom: "Understand",
                boardMap: ["CBSE Cl-6 Math 12.1", "NCF C-6.12"],
                misconceptions: ["Reads the ratio 2:3 as the fraction 2/3 of the whole"],
                judgmentType: "objective",
                order: 1,
                status: "draft",
              },
            ],
          },
          {
            name: "Geometry",
            nodes: [
              {
                id: "MATH.GEO.PERIM.03",
                subjectId: "maths",
                strand: "Geometry",
                statement: "Find the perimeter of squares and rectangles",
                gradeBand: "Class 6",
                prerequisites: ["MATH.GEO.ANGLE.01"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-6 Math 10.1"],
                misconceptions: ["Adds only two sides instead of all four"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "english",
        subjectName: "English",
        glyph: "Aa",
        strands: [
          {
            name: "Writing",
            nodes: [
              {
                id: "ENG.WRITE.PARA.06",
                subjectId: "english",
                strand: "Writing",
                statement: "Write a paragraph with a topic sentence and supporting detail",
                gradeBand: "Class 6",
                prerequisites: ["ENG.WRITE.NARR.05"],
                bloom: "Create",
                boardMap: ["CBSE Cl-6 Eng W.3"],
                misconceptions: ["Lists facts with no sentence that holds them together"],
                judgmentType: "judgment",
                order: 0,
                status: "published",
              },
            ],
          },
          {
            name: "Grammar",
            nodes: [
              {
                id: "ENG.GRAM.SUBVERB.03",
                subjectId: "english",
                strand: "Grammar",
                statement: "Keep the subject and verb in agreement",
                gradeBand: "Class 6",
                prerequisites: ["ENG.GRAM.TENSE.02"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-6 Eng G.3"],
                misconceptions: ["Matches the verb to the nearest noun, not the subject"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "science",
        subjectName: "Science",
        glyph: "✦",
        strands: [
          {
            name: "Living World",
            nodes: [
              {
                id: "SCI.LIFE.CLASS.01",
                subjectId: "science",
                strand: "Living World",
                statement: "Group living things by simple, observable features",
                gradeBand: "Class 6",
                prerequisites: ["EVS.LIFE.FOOD.02"],
                bloom: "Understand",
                boardMap: ["CBSE Cl-6 Sci 9", "NCF C-6.B1"],
                misconceptions: ["Groups by where an animal lives, not what it is"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
          {
            name: "Matter",
            nodes: [
              {
                id: "SCI.MATTER.SEP.02",
                subjectId: "science",
                strand: "Matter",
                statement: "Choose a method to separate a simple mixture",
                gradeBand: "Class 6",
                prerequisites: ["EVS.MATTER.STATES.01"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-6 Sci 5"],
                misconceptions: ["Picks a method by the tool, not by the mixture"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "social",
        subjectName: "Social Science",
        glyph: "◷",
        strands: [
          {
            name: "History",
            nodes: [
              {
                id: "SST.HIST.SOURCES.01",
                subjectId: "social",
                strand: "History",
                statement: "Tell how we learn about the past from different sources",
                gradeBand: "Class 6",
                prerequisites: [],
                bloom: "Understand",
                boardMap: ["CBSE Cl-6 SST H.1", "NCF C-6.S1"],
                misconceptions: ["Treats every old object as a written record"],
                judgmentType: "judgment",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
    ],
  },

  /* ===================== CLASS 7 (lighter) ===================== */
  {
    grade: "Class 7",
    gradeNum: 7,
    stage: "Middle",
    subjects: [
      {
        subjectId: "maths",
        subjectName: "Mathematics",
        glyph: "∑",
        strands: [
          {
            name: "Number",
            nodes: [
              {
                id: "MATH.RATIO.PROP.04",
                subjectId: "maths",
                strand: "Number",
                statement: "Use proportion to solve unitary-method problems",
                gradeBand: "Class 7",
                prerequisites: ["MATH.RATIO.MEANING.02"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-7 Math 8.2", "NCF C-7.8"],
                misconceptions: ["Adds across the proportion instead of scaling"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
          {
            name: "Algebra",
            nodes: [
              {
                id: "MATH.ALG.EXPR.01",
                subjectId: "maths",
                strand: "Algebra",
                statement: "Form and read simple algebraic expressions",
                gradeBand: "Class 7",
                prerequisites: ["MATH.INT.LINE.01"],
                bloom: "Understand",
                boardMap: ["CBSE Cl-7 Math 12.1", "NCF C-7.12"],
                misconceptions: ["Reads 3a as 3 followed by a, not 3 times a"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "english",
        subjectName: "English",
        glyph: "Aa",
        strands: [
          {
            name: "Writing",
            nodes: [
              {
                id: "ENG.WRITE.PERSUADE.07",
                subjectId: "english",
                strand: "Writing",
                statement: "Write a short persuasive piece with reasons",
                gradeBand: "Class 7",
                prerequisites: ["ENG.WRITE.PARA.06"],
                bloom: "Create",
                boardMap: ["CBSE Cl-7 Eng W.4"],
                misconceptions: ["States an opinion but gives no reason for it"],
                judgmentType: "judgment",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "science",
        subjectName: "Science",
        glyph: "✦",
        strands: [
          {
            name: "Forces",
            nodes: [
              {
                id: "SCI.FORCE.MOTION.01",
                subjectId: "science",
                strand: "Forces",
                statement: "Describe how a force can change motion or shape",
                gradeBand: "Class 7",
                prerequisites: [],
                bloom: "Understand",
                boardMap: ["CBSE Cl-7 Sci 8", "NCF C-7.P1"],
                misconceptions: ["Thinks a moving object always has a force pushing it on"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
    ],
  },

  /* ===================== CLASS 8 (rich) ===================== */
  {
    grade: "Class 8",
    gradeNum: 8,
    stage: "Middle",
    subjects: [
      {
        subjectId: "maths",
        subjectName: "Mathematics",
        glyph: "∑",
        strands: [
          {
            name: "Algebra",
            nodes: [
              {
                id: "MATH.ALG.LINEAR.02",
                subjectId: "maths",
                strand: "Algebra",
                statement: "Solve a linear equation in one variable",
                gradeBand: "Class 8",
                prerequisites: ["MATH.ALG.EXPR.01"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-8 Math 2.1", "NCF C-8.2"],
                misconceptions: ["Moves a term across the equals sign without changing its sign"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
              {
                id: "MATH.ALG.IDENT.03",
                subjectId: "maths",
                strand: "Algebra",
                statement: "Use standard identities to expand expressions",
                gradeBand: "Class 8",
                prerequisites: ["MATH.ALG.LINEAR.02"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-8 Math 9.2"],
                misconceptions: ["Writes (a+b)² as a² + b², dropping the middle term"],
                judgmentType: "objective",
                order: 1,
                status: "in-review",
              },
            ],
          },
          {
            name: "Number",
            nodes: [
              {
                id: "MATH.PCT.APPL.05",
                subjectId: "maths",
                strand: "Number",
                statement: "Solve problems on percentage, profit and loss",
                gradeBand: "Class 8",
                prerequisites: ["MATH.RATIO.PROP.04"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-8 Math 8.1", "NCF C-8.8"],
                misconceptions: ["Takes the percentage of the wrong base amount"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
          {
            name: "Geometry",
            nodes: [
              {
                id: "MATH.GEO.QUAD.04",
                subjectId: "maths",
                strand: "Geometry",
                statement: "Use angle properties of quadrilaterals to find unknowns",
                gradeBand: "Class 8",
                prerequisites: ["MATH.GEO.PERIM.03"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-8 Math 3.2"],
                misconceptions: ["Assumes every four-sided shape has equal angles"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "science",
        subjectName: "Science",
        glyph: "✦",
        strands: [
          {
            name: "Matter",
            nodes: [
              {
                id: "SCI.CHEM.REACT.01",
                subjectId: "science",
                strand: "Matter",
                statement: "Tell physical changes from chemical changes",
                gradeBand: "Class 8",
                prerequisites: ["SCI.MATTER.SEP.02"],
                bloom: "Analyse",
                boardMap: ["CBSE Cl-8 Sci 6", "NCF C-8.C1"],
                misconceptions: ["Calls every colour change a chemical change"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
          {
            name: "Forces",
            nodes: [
              {
                id: "SCI.FORCE.PRESS.02",
                subjectId: "science",
                strand: "Forces",
                statement: "Relate pressure to force and the area it acts on",
                gradeBand: "Class 8",
                prerequisites: ["SCI.FORCE.MOTION.01"],
                bloom: "Understand",
                boardMap: ["CBSE Cl-8 Sci 11"],
                misconceptions: ["Thinks more force always means more pressure, whatever the area"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "english",
        subjectName: "English",
        glyph: "Aa",
        strands: [
          {
            name: "Reading",
            nodes: [
              {
                id: "ENG.READ.TONE.05",
                subjectId: "english",
                strand: "Reading",
                statement: "Read for the writer's tone and point of view",
                gradeBand: "Class 8",
                prerequisites: ["ENG.READ.MAIN.04"],
                bloom: "Evaluate",
                boardMap: ["CBSE Cl-8 Eng R.6"],
                misconceptions: ["Takes every first-person line as the writer's own view"],
                judgmentType: "judgment",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "social",
        subjectName: "Social Science",
        glyph: "◷",
        strands: [
          {
            name: "Civics",
            nodes: [
              {
                id: "SST.CIV.CONST.02",
                subjectId: "social",
                strand: "Civics",
                statement: "Explain why a country needs a constitution",
                gradeBand: "Class 8",
                prerequisites: [],
                bloom: "Understand",
                boardMap: ["CBSE Cl-8 SST C.1", "NCF C-8.S3"],
                misconceptions: ["Confuses the constitution with the day's government"],
                judgmentType: "judgment",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
    ],
  },

  /* ===================== CLASS 9 (lighter) ===================== */
  {
    grade: "Class 9",
    gradeNum: 9,
    stage: "Secondary",
    subjects: [
      {
        subjectId: "maths",
        subjectName: "Mathematics",
        glyph: "∑",
        strands: [
          {
            name: "Algebra",
            nodes: [
              {
                id: "MATH.ALG.POLY.05",
                subjectId: "maths",
                strand: "Algebra",
                statement: "Factorise quadratic polynomials",
                gradeBand: "Class 9",
                prerequisites: ["MATH.ALG.IDENT.03"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-9 Math 2.4", "NCF C-9.2"],
                misconceptions: ["Splits the middle term without checking the product"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
          {
            name: "Geometry",
            nodes: [
              {
                id: "MATH.GEO.PROOF.05",
                subjectId: "maths",
                strand: "Geometry",
                statement: "Write a simple geometric proof using known theorems",
                gradeBand: "Class 9",
                prerequisites: ["MATH.GEO.QUAD.04"],
                bloom: "Evaluate",
                boardMap: ["CBSE Cl-9 Math 6.1"],
                misconceptions: ["States the result as the reason, arguing in a circle"],
                judgmentType: "judgment",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "science",
        subjectName: "Science",
        glyph: "✦",
        strands: [
          {
            name: "Matter",
            nodes: [
              {
                id: "SCI.CHEM.ATOM.03",
                subjectId: "science",
                strand: "Matter",
                statement: "Relate atoms, molecules and the mole to mass",
                gradeBand: "Class 9",
                prerequisites: ["SCI.CHEM.REACT.01"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-9 Sci 3", "NCF C-9.C2"],
                misconceptions: ["Treats the mole as a unit of mass, not of count"],
                judgmentType: "objective",
                order: 0,
                status: "draft",
              },
            ],
          },
        ],
      },
      {
        subjectId: "english",
        subjectName: "English",
        glyph: "Aa",
        strands: [
          {
            name: "Writing",
            nodes: [
              {
                id: "ENG.WRITE.DISCUR.08",
                subjectId: "english",
                strand: "Writing",
                statement: "Write a balanced discursive essay on an issue",
                gradeBand: "Class 9",
                prerequisites: ["ENG.WRITE.PERSUADE.07"],
                bloom: "Create",
                boardMap: ["CBSE Cl-9 Eng W.5"],
                misconceptions: ["Argues only one side and calls it balanced"],
                judgmentType: "judgment",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
    ],
  },

  /* ===================== CLASS 10 (lighter) ===================== */
  {
    grade: "Class 10",
    gradeNum: 10,
    stage: "Secondary",
    subjects: [
      {
        subjectId: "maths",
        subjectName: "Mathematics",
        glyph: "∑",
        strands: [
          {
            name: "Algebra",
            nodes: [
              {
                id: "MATH.ALG.QUAD.06",
                subjectId: "maths",
                strand: "Algebra",
                statement: "Solve quadratic equations by factorisation and formula",
                gradeBand: "Class 10",
                prerequisites: ["MATH.ALG.POLY.05"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-10 Math 4.3", "NCF C-10.4"],
                misconceptions: ["Drops one root, keeping only the positive value"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
          {
            name: "Trigonometry",
            nodes: [
              {
                id: "MATH.TRIG.RATIO.01",
                subjectId: "maths",
                strand: "Trigonometry",
                statement: "Use trigonometric ratios of acute angles",
                gradeBand: "Class 10",
                prerequisites: ["MATH.GEO.PROOF.05"],
                bloom: "Apply",
                boardMap: ["CBSE Cl-10 Math 8.1", "NCF C-10.8"],
                misconceptions: ["Mixes up the opposite and adjacent sides"],
                judgmentType: "objective",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "science",
        subjectName: "Science",
        glyph: "✦",
        strands: [
          {
            name: "Living World",
            nodes: [
              {
                id: "SCI.BIO.GENETIC.04",
                subjectId: "science",
                strand: "Living World",
                statement: "Explain how traits pass from parents to offspring",
                gradeBand: "Class 10",
                prerequisites: ["SCI.LIFE.CLASS.01"],
                bloom: "Understand",
                boardMap: ["CBSE Cl-10 Sci 9", "NCF C-10.B2"],
                misconceptions: ["Thinks acquired habits are inherited"],
                judgmentType: "judgment",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
      {
        subjectId: "social",
        subjectName: "Social Science",
        glyph: "◷",
        strands: [
          {
            name: "Geography",
            nodes: [
              {
                id: "SST.GEO.RESOURCE.03",
                subjectId: "social",
                strand: "Geography",
                statement: "Explain why resources must be used in a planned way",
                gradeBand: "Class 10",
                prerequisites: ["SST.GEO.MAPS.01"],
                bloom: "Evaluate",
                boardMap: ["CBSE Cl-10 SST G.1", "NCF C-10.S4"],
                misconceptions: ["Treats every resource as never running out"],
                judgmentType: "judgment",
                order: 0,
                status: "published",
              },
            ],
          },
        ],
      },
    ],
  },
];

/* ---------------------------------------------------------------------------
   Change requests — proposed edits waiting on a human decision.
   Each one is evidence + a suggestion; Dr. Iyer accepts, edits or turns it
   down. This is the "people decide, the system helps" rule for the map.
--------------------------------------------------------------------------- */
export type ChangeKind = "add" | "edit" | "remap" | "reorder" | "retire";
export type ChangeDecision = "suggested" | "accepted" | "edited" | "rejected";

export interface ChangeRequest {
  id: string;
  nodeId: string;
  grade: string;
  subjectId: string;
  kind: ChangeKind;
  title: string;
  proposer: string;
  proposerRole: string;
  date: string;
  rationale: string;
  before?: string;
  after?: string;
  decision: ChangeDecision;
}

export const changeRequests: ChangeRequest[] = [
  {
    id: "cr-01",
    nodeId: "MATH.FRAC.ADD.03",
    grade: "Class 5",
    subjectId: "maths",
    kind: "edit",
    title: "Add a misconception to “Add and subtract unlike fractions”",
    proposer: "Lakshmi Krishnan",
    proposerRole: "Maths · Class 5 Kaveri",
    date: "2026-06-16",
    rationale:
      "Six children this fortnight found a common denominator, then forgot to scale the numerators. It is a distinct slip from adding straight across, and worth naming so worksheets can catch it.",
    before: "Adds numerators and denominators straight across (2/3 + 1/4 = 3/7)",
    after:
      "Adds numerators and denominators straight across (2/3 + 1/4 = 3/7) · Finds a common denominator but forgets to scale the numerators",
    decision: "suggested",
  },
  {
    id: "cr-02",
    nodeId: "MATH.FRAC.COMPARE.02",
    grade: "Class 5",
    subjectId: "maths",
    kind: "remap",
    title: "Re-map “Compare and order unlike fractions” to the 2023 NCF code",
    proposer: "Anjali Desai",
    proposerRole: "Curriculum Associate",
    date: "2026-06-15",
    rationale:
      "The NCF position paper moved this outcome under C-5.7. Aligning the code keeps our board mapping clean for the next audit; the skill itself does not change.",
    before: "CBSE Cl-5 Math 7.4",
    after: "CBSE Cl-5 Math 7.4 · NCF C-5.7.4",
    decision: "suggested",
  },
  {
    id: "cr-03",
    nodeId: "ENG.WRITE.NARR.05",
    grade: "Class 5",
    subjectId: "english",
    kind: "edit",
    title: "Soften the wording of “Develop a narrative with a clear idea”",
    proposer: "Fatima Sheikh",
    proposerRole: "English · Class 5 Ganga",
    date: "2026-06-14",
    rationale:
      "Teachers read “well-carried” differently when marking. Plainer wording would help us grade the idea the same way across sections. This stays a teacher-judged skill.",
    before: "Develop a narrative with a clear, well-carried idea",
    after: "Develop a narrative with one clear idea, carried from start to finish",
    decision: "suggested",
  },
  {
    id: "cr-04",
    nodeId: "MATH.RATIO.MEANING.02",
    grade: "Class 6",
    subjectId: "maths",
    kind: "add",
    title: "Add “Understand ratio as a comparison” to Class 6 Number",
    proposer: "Sanjay Rao",
    proposerRole: "Maths · Class 6 Narmada",
    date: "2026-06-13",
    rationale:
      "Children meet ratio in Science (mixtures) before we teach it in Maths. Introducing the idea earlier in the map closes that gap and gives the unitary-method skill a clean prerequisite.",
    after: "Understand ratio as a comparison of two quantities — prerequisite: equivalent fractions",
    decision: "suggested",
  },
  {
    id: "cr-05",
    nodeId: "ENG.READ.MAIN.04",
    grade: "Class 5",
    subjectId: "english",
    kind: "reorder",
    title: "Move “Find the main idea” before the inference skill",
    proposer: "Fatima Sheikh",
    proposerRole: "English · Class 5 Ganga",
    date: "2026-06-12",
    rationale:
      "In class, children find the main idea more easily than they infer. Teaching it first gives a gentler climb and a firmer base for inference.",
    before: "Order: after “Answer simple inference questions”",
    after: "Order: before “Answer simple inference questions”",
    decision: "suggested",
  },
  {
    id: "cr-06",
    nodeId: "MATH.ALG.IDENT.03",
    grade: "Class 8",
    subjectId: "maths",
    kind: "edit",
    title: "Tighten the identity worked into “Use standard identities”",
    proposer: "Sanjay Rao",
    proposerRole: "Maths · Class 8 Yamuna",
    date: "2026-06-11",
    rationale:
      "The most common slip is dropping the middle term in (a+b)². Naming it on the node would let the tutor flag it the moment it shows up in practice.",
    before: "Writes (a+b)² as a² + b², dropping the middle term",
    after: "Writes (a+b)² as a² + b², dropping the 2ab middle term",
    decision: "suggested",
  },
  {
    id: "cr-07",
    nodeId: "EVS.LIFE.FOOD.02",
    grade: "Class 5",
    subjectId: "science",
    kind: "retire",
    title: "Retire the duplicate “Group foods by source” node",
    proposer: "Anjali Desai",
    proposerRole: "Curriculum Associate",
    date: "2026-06-10",
    rationale:
      "This outcome is now fully covered by the Class 6 classification skill. Retiring it here removes an overlap that confuses the Class 5 to 6 handover.",
    before: "Group foods by where they come from and what they give us (Class 5)",
    after: "Covered by “Group living things by features” (Class 6) — retire from Class 5",
    decision: "suggested",
  },
  {
    id: "cr-08",
    nodeId: "MATH.NUM.DIVIDE.04",
    grade: "Class 4",
    subjectId: "maths",
    kind: "edit",
    title: "Add a worked misconception to “Divide a two-digit number”",
    proposer: "Lakshmi Krishnan",
    proposerRole: "Maths · Class 4 Kaveri",
    date: "2026-06-09",
    rationale:
      "Children drop the remainder rather than write “r2”. Naming it helps the marker spot a near-correct answer instead of marking the whole thing wrong.",
    before: "Ignores the remainder rather than naming it",
    after: "Ignores the remainder rather than naming it · Writes 17 ÷ 5 as 3, not 3 r2",
    decision: "suggested",
  },
];

/* ---------------------------------------------------------------------------
   Version history — the map is a living, versioned source of truth.
   Newest first. The published version is what every class follows today.
--------------------------------------------------------------------------- */
export type VersionStatus = "published" | "superseded" | "draft";

export interface MapVersion {
  id: string;
  label: string; // "v2026.2"
  date: string;
  author: string;
  summary: string;
  changes: string[];
  status: VersionStatus;
  nodeCount: number;
}

export const mapVersions: MapVersion[] = [
  {
    id: "v-2026-3",
    label: "v2026.3",
    date: "2026-06-18",
    author: "Dr. Vikram Iyer",
    summary: "Working draft for the new term — gathering teacher proposals before the July release.",
    changes: [
      "8 change requests under review from the Maths and English teams",
      "Class 6 ratio prerequisite proposed, pending decision",
      "No live changes yet — this draft has not gone out to classes",
    ],
    status: "draft",
    nodeCount: 47,
  },
  {
    id: "v-2026-2",
    label: "v2026.2",
    date: "2026-04-02",
    author: "Dr. Vikram Iyer",
    summary: "Mid-year alignment — sharpened the Fractions chain and tidied board codes after the NCF update.",
    changes: [
      "Added the “number line” step between meaning and equivalent fractions",
      "Re-mapped 6 Class 5 Maths nodes to refreshed NCF codes",
      "Named two new misconceptions on the addition of unlike fractions",
      "Retired one duplicate EVS node ahead of the Class 6 handover",
    ],
    status: "published",
    nodeCount: 47,
  },
  {
    id: "v-2026-1",
    label: "v2026.1",
    date: "2026-01-08",
    author: "Dr. Vikram Iyer",
    summary: "First map of the academic year — full Class 3–10 spine published to every class.",
    changes: [
      "Published the Class 3–10 skill map across Maths, English, Science and Social Science",
      "Set every node's Bloom level and judgment-vs-objective tag",
      "Linked all prerequisites end to end, root skills to board outcomes",
    ],
    status: "superseded",
    nodeCount: 45,
  },
  {
    id: "v-2025-4",
    label: "v2025.4",
    date: "2025-11-20",
    author: "Anjali Desai",
    summary: "End-of-year clean-up before the AY 2026–27 rebuild.",
    changes: [
      "Merged two overlapping Geometry nodes in Class 6",
      "Corrected three CBSE chapter references in Class 8 Maths",
    ],
    status: "superseded",
    nodeCount: 44,
  },
];

/* ---------------------------------------------------------------------------
   Helpers
--------------------------------------------------------------------------- */
export function gradeByNum(n: number): GradeCurriculum | undefined {
  return gradeCurricula.find((g) => g.gradeNum === n);
}

export function subjectsForGrade(n: number): GradeSubject[] {
  return gradeByNum(n)?.subjects ?? [];
}

export function nodesFor(n: number, subjectId: string, strand?: string): AuthoredNode[] {
  const subj = subjectsForGrade(n).find((s) => s.subjectId === subjectId);
  if (!subj) return [];
  const strands = strand ? subj.strands.filter((s) => s.name === strand) : subj.strands;
  return strands.flatMap((s) => s.nodes);
}

/** Every authored node across the whole map — used for counts and lookups. */
export const allAuthoredNodes: AuthoredNode[] = gradeCurricula.flatMap((g) =>
  g.subjects.flatMap((s) => s.strands.flatMap((st) => st.nodes)),
);

export function authoredNodeById(id: string): AuthoredNode | undefined {
  return allAuthoredNodes.find((n) => n.id === id);
}

/** Count of nodes by authoring status across a grade+subject (for the header). */
export function statusCounts(nodes: AuthoredNode[]): Record<AuthoringStatus, number> {
  return nodes.reduce(
    (acc, n) => {
      acc[n.status] += 1;
      return acc;
    },
    { published: 0, draft: 0, "in-review": 0 } as Record<AuthoringStatus, number>,
  );
}

export const CHANGE_KIND_LABEL: Record<ChangeKind, string> = {
  add: "Add",
  edit: "Edit",
  remap: "Re-map",
  reorder: "Reorder",
  retire: "Retire",
};
