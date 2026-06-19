import type { CompetencyNode } from "@/data/types";

/* Shared, tiny lookups for the curriculum surfaces — kept here so the page and
   the sheet read the same way. */

/** Bloom levels in order, low to high — used for the level picker. */
export const BLOOM_LEVELS: CompetencyNode["bloom"][] = [
  "Remember",
  "Understand",
  "Apply",
  "Analyse",
  "Evaluate",
  "Create",
];

/** A quiet, plain gloss for each Bloom level. */
export const BLOOM_GLOSS: Record<CompetencyNode["bloom"], string> = {
  Remember: "recall a fact",
  Understand: "explain an idea",
  Apply: "use it in a new case",
  Analyse: "take it apart",
  Evaluate: "weigh and judge",
  Create: "make something new",
};
