import type { PathDef, PathArtifact, PathKey } from "./types";

/** The six PATHs (Broad Concept). Elementary samples all six; Middle picks 3; High picks 2. */
export const pathDefs: Record<PathKey, PathDef> = {
  builder: {
    key: "builder",
    name: "Builder",
    verb: "Build things",
    blurb: "Every quarter, a new artefact to prove it. Small makes build a test-and-fix reflex.",
    glyph: "⚒",
  },
  explorer: {
    key: "explorer",
    name: "Explorer",
    verb: "Go deep, led by curiosity",
    blurb: "Pick an obsession for 2–4 weeks and go deep. Notice, guess, check, revise.",
    glyph: "✺",
  },
  scholar: {
    key: "scholar",
    name: "Scholar",
    verb: "Ask why it's true",
    blurb: "Genuine depth in core subjects — reasoning, proof, the start of the olympiad track.",
    glyph: "❖",
  },
  athlete: {
    key: "athlete",
    name: "Athlete",
    verb: "Move with mastery",
    blurb: "Broad physical literacy, then serious training in a chosen sport.",
    glyph: "➤",
  },
  artist: {
    key: "artist",
    name: "Artist",
    verb: "Make, with taste",
    blurb: "Explore forms, then hone craft and voice into a real body of work.",
    glyph: "✣",
  },
  communicator: {
    key: "communicator",
    name: "Communicator",
    verb: "Move people",
    blurb: "From listening and speaking up to debate, storytelling and theatre.",
    glyph: "❝",
  },
};

export const pathList = Object.values(pathDefs);

export const pathArtifacts: PathArtifact[] = [
  {
    id: "art-001",
    studentId: "stu-riya",
    path: "artist",
    title: "Madhubani fish — first ink pass",
    date: "2026-06-09",
    standardRating: 4,
    note: "Confident linework; colour discipline improving. Beginning to develop a recognisable hand.",
    group: "Class 4–5 · Atelier",
  },
  {
    id: "art-002",
    studentId: "stu-kabir",
    path: "builder",
    title: "Cardboard marble-run v3 (gravity gate)",
    date: "2026-06-12",
    standardRating: 4,
    note: "Third iteration — added a working gate after two failures. Strong test-and-fix reflex.",
    group: "Class 4–5 · Workshop",
  },
  {
    id: "art-003",
    studentId: "stu-ananya",
    path: "explorer",
    title: "Why does the lake smell after rain? — field notes",
    date: "2026-06-11",
    standardRating: 5,
    note: "Two weeks of observation, a real hypothesis about petrichor, and a revision when the first guess failed.",
    group: "Class 5 · Field",
  },
  {
    id: "art-004",
    studentId: "stu-vihaan",
    path: "athlete",
    title: "Badminton — footwork ladder, week 6",
    date: "2026-06-14",
    standardRating: 3,
    note: "Daily fitness habit holding; chosen sport is badminton. Court movement noticeably sharper.",
    group: "Class 5 · Court",
  },
  {
    id: "art-005",
    studentId: "stu-aarav",
    path: "communicator",
    title: "Storytelling circle — 'The Stubborn Banyan'",
    date: "2026-06-10",
    standardRating: 4,
    note: "Held the room for four minutes. Voice and timing strong; a natural performer finding his audience.",
    group: "Class 4–5 · Stage",
  },
  {
    id: "art-006",
    studentId: "stu-saanvi",
    path: "scholar",
    title: "Patterns in the 9× table — a small proof",
    date: "2026-06-13",
    standardRating: 5,
    note: "Noticed the digit-sum pattern unprompted and tried to explain why. The academic spark, emergent.",
    group: "Class 5 · Seminar",
  },
];

export function artifactsByStudent(studentId: string) {
  return pathArtifacts.filter((a) => a.studentId === studentId);
}

export function artifactsByPath(path: PathKey) {
  return pathArtifacts.filter((a) => a.path === path);
}
