import type { Persona } from "./types";

export * from "./types";
export * from "./school";
export * from "./educators";
export * from "./students";
export * from "./paths";
export * from "./competency";
export * from "./mastery";
export * from "./timetable";
export * from "./lessonplans";
export * from "./tutorSessions";
export * from "./insights";
export * from "./coach";
export * from "./metrics";

export interface PersonaMeta {
  id: Persona;
  label: string; // "Teacher OS"
  person: string; // who is "logged in"
  role: string;
  tagline: string;
  blurb: string;
  href: string;
  device: "desktop" | "mobile";
  icon: string; // lucide-react icon name
  designRule: string; // the rule that governs this surface
}

export const personas: PersonaMeta[] = [
  {
    id: "teacher",
    label: "Teacher OS",
    person: "Lakshmi Krishnan",
    role: "Maths · Class 5 Kaveri",
    tagline: "The daily driver",
    blurb: "Run a calm room where thirty children work at thirty levels — and spend scarce attention on the one thing only a human can do.",
    href: "/teacher",
    device: "desktop",
    icon: "Compass",
    designRule: "One move, not a to-do list. Calm surface, depth one tap away.",
  },
  {
    id: "coach",
    label: "Executive Coach",
    person: "Rohan D'Souza",
    role: "40 students · fortnightly check-ins",
    tagline: "The sense-maker",
    blurb: "Read the whole child across Concept and PATH, add the human context the data can't see, and turn it into a simple plan.",
    href: "/coach",
    device: "desktop",
    icon: "HeartHandshake",
    designRule: "The coach's time goes to judgment and relationship; the system does the assembling.",
  },
  {
    id: "principal",
    label: "Principal OS",
    person: "Dr. Meera Nambiar",
    role: "Whitefield Campus",
    tagline: "School health & scale",
    blurb: "Run a healthy school as a business and a brand — with proof the model works independently of any one teacher's brilliance.",
    href: "/principal",
    device: "desktop",
    icon: "Building2",
    designRule: "An operator's cockpit — a few decisive numbers, not vanity metrics.",
  },
  {
    id: "parent",
    label: "Parent App",
    person: "Shobha Iyer",
    role: "Riya's mother · Class 5",
    tagline: "Honest, month on month",
    blurb: "See real value and real honesty — the gap being worked, not a wall of green.",
    href: "/parent",
    device: "mobile",
    icon: "Sprout",
    designRule: "Trust through transparency — the explicit anti-BYJU's choice.",
  },
  {
    id: "student",
    label: "Student OS",
    person: "Mahira Qureshi",
    role: "Class 6 · AI Tutor",
    tagline: "A tireless self-work partner",
    blurb: "Adaptive practice on the topic just taught — guard-railed to the competency, deferring to the teacher on anything that needs judgment.",
    href: "/student",
    device: "mobile",
    icon: "Sparkles",
    designRule: "The tutor assists the child's practice; it never replaces the teacher or the coach.",
  },
];

export function personaById(id: Persona) {
  return personas.find((p) => p.id === id)!;
}

/** The six non-negotiable design rules (Tech Architecture PRD §0). */
export const DESIGN_RULES: { n: number; title: string; body: string }[] = [
  { n: 1, title: "One move, not a to-do list", body: "Narrow the teacher to a single clear action per block; spread needs across the week." },
  { n: 2, title: "The human decides; the machine assists", body: "Every AI output that touches a child is acceptable, editable, or rejectable — and we record who decided." },
  { n: 3, title: "Paper-first in elementary", body: "No screens for young children. The student-facing tutor exists only from middle school." },
  { n: 4, title: "Leading, not lagging", body: "Every metric surfaced moves before the exam does and predicts it. The report card is an output, never the instrument." },
  { n: 5, title: "Offline-first", body: "Capture, marking and the day's plan work with no internet and sync when a connection returns." },
  { n: 6, title: "Show the gaps honestly", body: "Parents and principals see real gaps being worked, not a wall of green. Transparency is the moat." },
];
