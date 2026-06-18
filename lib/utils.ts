import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** ₹ with Indian lakh/crore grouping, e.g. 400000 -> "₹4,00,000". */
export function formatINR(n: number, opts: { paise?: boolean } = {}) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: opts.paise ? 2 : 0,
  }).format(n);
}

/** Compact lakh phrasing, e.g. 400000 -> "₹4L", 1000000 -> "₹10L". */
export function lakh(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(n % 10000000 ? 1 : 0)}Cr`;
  return `₹${(n / 100000).toFixed(n % 100000 ? 1 : 0)}L`;
}

/** Two-letter initials from a full name. */
export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Deterministic index into an array from a string (stable avatar tints, etc.). */
export function hashIndex(seed: string, length: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % length;
}

/** "3 days ago" / "in 4 days" relative phrasing against a fixed "today". */
export function relativeDays(target: string, today = "2026-06-18") {
  const ms = new Date(target).getTime() - new Date(today).getTime();
  const d = Math.round(ms / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "tomorrow";
  if (d === -1) return "yesterday";
  if (d < 0) return `${-d} days ago`;
  return `in ${d} days`;
}

/** Clamp a number to [min, max]. */
export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Percent string from a 0–1 ratio. */
export function pct(ratio: number, digits = 0) {
  return `${(ratio * 100).toFixed(digits)}%`;
}
