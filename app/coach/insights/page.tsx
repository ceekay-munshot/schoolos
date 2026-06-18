import Link from "next/link";
import { ArrowUpRight, EyeOff } from "lucide-react";
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
    <AppShell persona="coach" eyebrow="Drafted by the system · chosen by you" title="Insights">
      <p className="mb-4 max-w-2xl text-[14px] leading-relaxed text-muted">
        The system points out what it noticed. You never get the system's words as the final truth —
        you pick what's right, and what you add becomes a real signal that changes how things are
        read later on.
      </p>
      <p className="mb-7 flex max-w-2xl items-start gap-2 rounded-xl border border-line bg-sand/60 p-3 text-[12.5px] leading-relaxed text-muted">
        <EyeOff size={14} className="mt-0.5 shrink-0 text-faint" />
        Not every true thing is one a family should hear word for word. On each student’s page you
        decide, item by item, what is okay to share with parents and what stays as your private note.
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
