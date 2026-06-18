import {
  Sun,
  CalendarDays,
  BookOpen,
  GraduationCap,
  Drama,
  Inbox,
  Users,
  CalendarClock,
  ClipboardList,
  ListChecks,
  HeartPulse,
  LineChart,
  Building2,
  UsersRound,
  MessageSquare,
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
    { label: "Today", href: "/teacher", icon: Sun },
    { label: "Week", href: "/teacher/week", icon: CalendarDays },
    { label: "Classes", href: "/teacher/classes", icon: BookOpen },
    { label: "Students", href: "/teacher/students", icon: GraduationCap },
    { label: "PATH blocks", href: "/teacher/path", icon: Drama },
    { label: "Review queue", href: "/teacher/review", icon: Inbox },
  ],
  coach: [
    { label: "Caseload", href: "/coach", icon: Users },
    { label: "Check-ins", href: "/coach/checkins", icon: CalendarClock },
    { label: "Plans", href: "/coach/plans", icon: ClipboardList },
    { label: "Follow-ups", href: "/coach/follow-ups", icon: ListChecks },
  ],
  principal: [
    { label: "School health", href: "/principal", icon: HeartPulse },
    { label: "Learning", href: "/principal/learning", icon: LineChart },
    { label: "Operations", href: "/principal/operations", icon: Building2 },
    { label: "People", href: "/principal/people", icon: UsersRound },
    { label: "Parents", href: "/principal/parents", icon: MessageSquare },
    { label: "Early warning", href: "/principal/early-warning", icon: TriangleAlert },
  ],
  parent: [],
  student: [],
};
