import { ArrowRight } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { heroClassStudents } from "@/data/students";
import { masteryAt, FRACTION_PATH } from "@/data/mastery";
import { nodeById } from "@/data/competency";
import { StudentInspector } from "@/components/patterns/StudentInspector";
import { Delta } from "@/components/patterns/atoms";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/primitives";
import { statusColor } from "@/lib/status";

export default function TeacherStudents() {
  return (
    <AppShell persona="teacher" eyebrow="Class 5 · Kaveri" title="Students">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Every child&apos;s position on the current map at a glance. Open anyone for their full
        360 — learning, foundations, PATH and the coach&apos;s picture in one place.
      </p>

      <Section>
        <Card>
          <div className="divide-y divide-line">
            {heroClassStudents.map((s) => (
              <StudentInspector
                key={s.id}
                studentId={s.id}
                className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-sand"
              >
                <Avatar name={s.name} size={36} />
                <span className="w-44 shrink-0 truncate text-[14px] font-medium text-ink">{s.name}</span>
                <span className="hidden flex-1 items-center gap-1.5 sm:flex">
                  {FRACTION_PATH.map((nid) => {
                    const st = masteryAt(s.id, nid);
                    return (
                      <span
                        key={nid}
                        className="size-3 rounded-full ring-1 ring-black/5"
                        style={{ backgroundColor: statusColor(st?.status ?? "not-introduced") }}
                        title={`${nodeById(nid)?.statement}: ${st?.status}`}
                      />
                    );
                  })}
                </span>
                <span className="hidden w-24 shrink-0 sm:block">
                  <Delta value={s.masteryVelocity} expected={s.expectedVelocity} />
                </span>
                <ArrowRight size={15} className="shrink-0 text-faint" />
              </StudentInspector>
            ))}
          </div>
        </Card>
      </Section>
    </AppShell>
  );
}
