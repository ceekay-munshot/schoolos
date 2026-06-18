import type { Block } from "./types";

/* Ms. Lakshmi Krishnan's teaching week (Maths). The week view surfaces only the
   shape of the week with light, non-alarming flags. "Today" is Thursday; the
   09:00 Class 5 Kaveri Fractions block is the hero block-prep screen. */

export const HERO_BLOCK_ID = "blk-thu-0900";

export const timetable: Block[] = [
  // ---- Monday ----
  { id: "blk-mon-0900", day: "Mon", start: "09:00", end: "10:00", kind: "concept", label: "Maths · Fractions", subjectId: "maths", klass: "Class 5 · Kaveri", room: "Numbers Room 2", educatorId: "edu-lakshmi" },
  { id: "blk-mon-1015", day: "Mon", start: "10:15", end: "11:15", kind: "concept", label: "Maths · Fractions", subjectId: "maths", klass: "Class 5 · Ganga", room: "Numbers Room 2", educatorId: "edu-lakshmi" },
  { id: "blk-mon-1300", day: "Mon", start: "13:00", end: "14:30", kind: "path", label: "PATH · Builder", klass: "Class 4–5 · Mixed", room: "Workshop", educatorId: "edu-lakshmi" },

  // ---- Tuesday ----
  { id: "blk-tue-0900", day: "Tue", start: "09:00", end: "10:00", kind: "concept", label: "Maths · Fractions", subjectId: "maths", klass: "Class 5 · Kaveri", room: "Numbers Room 2", educatorId: "edu-lakshmi" },
  { id: "blk-tue-1115", day: "Tue", start: "11:15", end: "12:15", kind: "concept", label: "Maths · Number", subjectId: "maths", klass: "Class 4 · Kaveri", room: "Numbers Room 2", educatorId: "edu-lakshmi" },
  { id: "blk-tue-1300", day: "Tue", start: "13:00", end: "14:30", kind: "path", label: "PATH · Scholar", klass: "Class 5 · Seminar", room: "Seminar 1", educatorId: "edu-lakshmi" },

  // ---- Wednesday ----
  { id: "blk-wed-0900", day: "Wed", start: "09:00", end: "10:00", kind: "concept", label: "Maths · Fractions", subjectId: "maths", klass: "Class 5 · Kaveri", room: "Numbers Room 2", educatorId: "edu-lakshmi", flag: "Two small-groups queued" },
  { id: "blk-wed-1015", day: "Wed", start: "10:15", end: "11:15", kind: "concept", label: "Maths · Fractions", subjectId: "maths", klass: "Class 5 · Ganga", room: "Numbers Room 2", educatorId: "edu-lakshmi" },
  { id: "blk-wed-1300", day: "Wed", start: "13:00", end: "14:30", kind: "path", label: "PATH · Explorer", klass: "Class 5 · Field", room: "Courtyard", educatorId: "edu-lakshmi" },

  // ---- Thursday (today) ----
  { id: HERO_BLOCK_ID, day: "Thu", start: "09:00", end: "10:00", kind: "concept", label: "Maths · Fractions", subjectId: "maths", klass: "Class 5 · Kaveri", room: "Numbers Room 2", educatorId: "edu-lakshmi", flag: "Your one group today" },
  { id: "blk-thu-1015", day: "Thu", start: "10:15", end: "11:15", kind: "concept", label: "Maths · Fractions", subjectId: "maths", klass: "Class 5 · Ganga", room: "Numbers Room 2", educatorId: "edu-lakshmi" },
  { id: "blk-thu-1300", day: "Thu", start: "13:00", end: "14:30", kind: "path", label: "PATH · Builder", klass: "Class 4–5 · Mixed", room: "Workshop", educatorId: "edu-lakshmi" },

  // ---- Friday ----
  { id: "blk-fri-0900", day: "Fri", start: "09:00", end: "10:00", kind: "concept", label: "Maths · Fractions", subjectId: "maths", klass: "Class 5 · Kaveri", room: "Numbers Room 2", educatorId: "edu-lakshmi" },
  { id: "blk-fri-1115", day: "Fri", start: "11:15", end: "12:15", kind: "concept", label: "Maths · Number", subjectId: "maths", klass: "Class 4 · Kaveri", room: "Numbers Room 2", educatorId: "edu-lakshmi" },
  { id: "blk-fri-1300", day: "Fri", start: "13:00", end: "14:30", kind: "path", label: "PATH · Artist", klass: "Class 4–5 · Atelier", room: "Atelier", educatorId: "edu-lakshmi" },
];

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
export const TODAY_DAY = "Thu" as const;

export function blockById(id: string) {
  return timetable.find((b) => b.id === id);
}

export function blocksByDay(day: string) {
  return timetable.filter((b) => b.day === day);
}
