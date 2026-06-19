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
    label: "Teacher",
    person: "Lakshmi Krishnan",
    role: "Maths · Class 5 Kaveri",
    tagline: "Your day, sorted",
    blurb: "Keep a calm class where every child is at a different level. We point you to the one thing worth doing right now.",
    href: "/teacher",
    device: "desktop",
    icon: "Compass",
    designRule: "One clear step, not a long list. The details are one tap away.",
  },
  {
    id: "coach",
    label: "Coach",
    person: "Rohan D'Souza",
    role: "40 students · check-ins every 2 weeks",
    tagline: "Sees the whole child",
    blurb: "See the whole child — school work and interests. Add what you know that the numbers can't, and turn it into a simple plan.",
    href: "/coach",
    device: "desktop",
    icon: "HeartHandshake",
    designRule: "You spend your time with people. The system does the gathering.",
  },
  {
    id: "principal",
    label: "Principal",
    person: "Dr. Meera Nambiar",
    role: "Whitefield Campus",
    tagline: "How the school is doing",
    blurb: "Run a healthy school, with proof it works — not because of one star teacher, but because the whole system does.",
    href: "/principal",
    device: "desktop",
    icon: "Building2",
    designRule: "A simple control room — a few numbers that matter, nothing for show.",
  },
  {
    id: "parent",
    label: "Parent",
    person: "Shobha Iyer",
    role: "Riya's mother · Class 5",
    tagline: "Honest, every month",
    blurb: "See how your child is really doing — including what they're working on next, not just the good news.",
    href: "/parent",
    device: "mobile",
    icon: "Sprout",
    designRule: "We build trust by being open. You see the real picture.",
  },
  {
    id: "student",
    label: "Student",
    person: "Mahira Qureshi",
    role: "Class 6 · AI Tutor",
    tagline: "Your practice partner",
    blurb: "Practise today's topic at your own pace. Your tutor stays on topic and leaves the big calls to your teacher.",
    href: "/student",
    device: "desktop",
    icon: "Sparkles",
    designRule: "The tutor helps you practise. It never replaces your teacher or coach.",
  },
  {
    id: "curriculum",
    label: "Curriculum",
    person: "Dr. Vikram Iyer",
    role: "Head of Curriculum",
    tagline: "The map every class follows",
    blurb: "Author and version the skill map for every grade — what each child should master, in what order, mapped to the board.",
    href: "/curriculum",
    device: "desktop",
    icon: "Library",
    designRule: "Change the map once; every class, worksheet and report follows.",
  },
];

export function personaById(id: Persona) {
  return personas.find((p) => p.id === id)!;
}

/** The six rules every screen follows. */
export const DESIGN_RULES: { n: number; title: string; body: string }[] = [
  { n: 1, title: "One step, not a long list", body: "Show the teacher one clear thing to do now, and spread the rest across the week." },
  { n: 2, title: "People decide, the system helps", body: "Anything the AI suggests about a child can be accepted, edited, or turned down — and we note who decided." },
  { n: 3, title: "Paper first for young children", body: "No screens for little ones. The student tutor only starts in middle school." },
  { n: 4, title: "Catch things early", body: "We watch the signs that show up before a test does, so problems get caught in time. The report card is the result, not the tool." },
  { n: 5, title: "Works without internet", body: "Scanning, marking and the day's plan all work offline, then catch up once you're back online." },
  { n: 6, title: "Be honest about gaps", body: "Parents and the principal see the real gaps being worked on — not a screen full of green." },
];
