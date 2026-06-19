import * as React from "react";
import { Sun, BookOpen, MapPin } from "lucide-react";
import type { StudentProfile } from "@/data/student-profiles";
import { Card, Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/* The opening of the day for the selected child: a warm greeting, the one-line
   intention, and the class happening right now. Calm and uncluttered. */

const HOUSE_TONE: Record<string, "indigo" | "saffron" | "mastered" | "practising"> = {
  Kaveri: "indigo",
  Yamuna: "saffron",
  Ganga: "mastered",
  Narmada: "practising",
};

export function TodayHero({ profile }: { profile: StudentProfile }) {
  const c = profile.currentClass;
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr,1fr]">
      <div>
        <p className="text-[12px] uppercase tracking-[0.14em] text-faint">{profile.todayLabel}</p>
        <h2 className="mt-1.5 font-display text-[30px] leading-tight text-ink">
          {profile.greeting}
        </h2>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted">{profile.todayLine}</p>
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <Badge tone={HOUSE_TONE[profile.house] ?? "neutral"}>{profile.house} House</Badge>
          <Badge tone="neutral">{profile.grade}</Badge>
        </div>
      </div>

      <Card className={cn("border-indigo/15 p-5")}>
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-soft text-indigo">
            <Sun size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.12em] text-faint">Happening now</p>
            <p className="text-[15px] font-medium leading-snug text-ink">{c.topic}</p>
          </div>
        </div>
        <div className="mt-3.5 space-y-1.5 text-[12.5px] text-muted">
          <p className="flex items-center gap-1.5">
            <BookOpen size={13} className="shrink-0 text-faint" />
            {c.subject} · with {c.teacherName}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin size={13} className="shrink-0 text-faint" />
            {c.room} · {c.time}
          </p>
        </div>
      </Card>
    </div>
  );
}
