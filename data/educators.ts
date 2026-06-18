import type { Educator } from "./types";

export const educators: Educator[] = [
  {
    id: "edu-lakshmi",
    name: "Lakshmi Krishnan",
    role: "teacher",
    subject: "Mathematics",
    title: "Maths · Class 5 Kaveri",
  },
  {
    id: "edu-priya",
    name: "Priya Nair",
    role: "assistant",
    subject: "Mathematics",
    title: "Assistant Teacher · Class 5 Kaveri",
  },
  {
    id: "edu-rohan",
    name: "Rohan D'Souza",
    role: "coach",
    title: "Executive Coach",
    caseload: 40,
  },
  {
    id: "edu-meera",
    name: "Dr. Meera Nambiar",
    role: "principal",
    title: "Principal · Whitefield Campus",
  },
  {
    id: "edu-vikram",
    name: "Dr. Vikram Iyer",
    role: "curriculum",
    title: "Head of Curriculum",
  },
];

export const teacher = educators[0];
export const coach = educators[2];
export const principal = educators[3];

export function educatorById(id: string) {
  return educators.find((e) => e.id === id);
}
