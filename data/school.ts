import type { School, Subject } from "./types";

export const school: School = {
  name: "Tomo School",
  campus: "Whitefield Campus",
  city: "Bengaluru",
  board: "CBSE · aligned to NCF",
  benchmark: "ACER",
  annualFee: 400000,
  ibComparableFee: 1000000,
  students: 1480,
  educators: 96,
  houses: ["Ganga", "Kaveri", "Narmada", "Yamuna"],
  foundedYear: 2024,
};

export const subjects: Subject[] = [
  {
    id: "maths",
    name: "Mathematics",
    strands: ["Number", "Fractions", "Geometry", "Measurement", "Data"],
    glyph: "∑",
  },
  {
    id: "science",
    name: "Science / EVS",
    strands: ["Living World", "Matter", "Forces", "Earth & Space"],
    glyph: "✦",
  },
  {
    id: "english",
    name: "English",
    strands: ["Reading", "Writing", "Grammar", "Speaking"],
    glyph: "Aa",
  },
  {
    id: "hindi",
    name: "Hindi",
    strands: ["पठन", "लेखन", "व्याकरण"],
    glyph: "अ",
  },
  {
    id: "social",
    name: "Social Science",
    strands: ["History", "Geography", "Civics"],
    glyph: "◷",
  },
];

/** The current "today" the whole mock is anchored to. */
export const TODAY = "2026-06-18";
