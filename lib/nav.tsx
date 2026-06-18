import {
  CalendarDays,
  Activity,
  ScanLine,
  Drama,
  Users,
  CalendarClock,
  Lightbulb,
  HeartPulse,
  TrendingUp,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { Persona } from "@/data/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV: Record<Persona, NavItem[]> = {
  teacher: [
    { label: "This week", href: "/teacher", icon: CalendarDays },
    { label: "Class health", href: "/teacher/health", icon: Activity },
    { label: "Capture", href: "/teacher/capture", icon: ScanLine },
    { label: "PATH blocks", href: "/teacher/path", icon: Drama },
  ],
  coach: [
    { label: "Caseload", href: "/coach", icon: Users },
    { label: "Check-ins", href: "/coach/checkins", icon: CalendarClock },
    { label: "Insights", href: "/coach/insights", icon: Lightbulb },
  ],
  principal: [
    { label: "School health", href: "/principal", icon: HeartPulse },
    { label: "Scalability", href: "/principal/scalability", icon: TrendingUp },
    { label: "Compliance", href: "/principal/compliance", icon: ScanLine },
    { label: "Early-warning", href: "/principal/early-warning", icon: TriangleAlert },
  ],
  parent: [],
  student: [],
};
