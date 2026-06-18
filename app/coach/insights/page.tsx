import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { insights } from "@/data/insights";
import { studentById } from "@/data/students";
import { InsightCard } from "@/components/patterns/InsightCard";
import { Avatar } from "@/components/ui/avatar";

export default function CoachInsights() {
  // group all insights by student
  const byStudent = new Map<string, typeof insights>();
  for (const i of insights) {
    const arr = byStudent.get(i.studentId) ?? [];
    arr.push(i);
    byStudent.set(i.studentId, arr);
  }

  return (
    <AppShell persona="coach" eyebrow="Drafted by the system · curated by you" title="Insights">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        The system flags what it noticed. You never receive raw model output as truth — you
        curate it, and your context becomes a first-class signal that adjusts interpretation
        downstream.
      </p>

      <div className="space-y-9">
        {[...byStudent.entries()].map(([sid, items]) => {
          const s = studentById(sid)!;
          return (
            <div key={sid}>
              <Link href={`/coach/${sid}`} className="group mb-3 inline-flex items-center gap-2.5">
                <Avatar name={s.name} size={32} />
                <span className="text-[15px] font-medium text-ink">{s.name}</span>
                <span className="text-[12px] text-faint">{s.grade}</span>
                <ArrowUpRight size={14} className="text-faint transition-colors group-hover:text-indigo" />
              </Link>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {items.map((i) => (
                  <InsightCard key={i.id} insight={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
