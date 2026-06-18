import type { MasteryStatus } from "@/data/types";

type Meta = { label: string; color: string; tone: "mastered" | "practising" | "gap" | "dormant" | "neutral" };

export const STATUS_META: Record<MasteryStatus, Meta> = {
  retained: { label: "Retained", color: "#4F6B5B", tone: "mastered" },
  mastered: { label: "Mastered", color: "#5E7C6A", tone: "mastered" },
  practising: { label: "Practising", color: "#C0913A", tone: "practising" },
  introduced: { label: "Introduced", color: "#C7C2B6", tone: "dormant" },
  "not-introduced": { label: "Not introduced", color: "#E4E0D7", tone: "dormant" },
  gap: { label: "Gap", color: "#B25B43", tone: "gap" },
  faded: { label: "Fading", color: "#D8C089", tone: "practising" },
};

export const STATUS_ORDER: MasteryStatus[] = [
  "retained",
  "mastered",
  "practising",
  "faded",
  "gap",
  "introduced",
  "not-introduced",
];

export function statusColor(s: MasteryStatus) {
  return STATUS_META[s].color;
}
export function statusLabel(s: MasteryStatus) {
  return STATUS_META[s].label;
}
export function statusTone(s: MasteryStatus) {
  return STATUS_META[s].tone;
}
