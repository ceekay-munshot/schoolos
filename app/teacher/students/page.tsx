import { ArrowRight } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { students } from "@/data/students";
import { masteryAt, FRACTION_PATH } from "@/data/mastery";
import { nodeById } from "@/data/competency";
import { StudentInspector } from "@/components/patterns/StudentInspector";
import { Delta } from "@/components/patterns/atoms";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge } from "@/components/ui/primitives";
import { statusColor } from "@/lib/status";

const GRADE_ORDER = ["Class 4", "Class 5", "Class 6"];

export default function TeacherStudents() {
  const byGrade = GRADE_ORDER.map((grade) => ({
    grade,
    list: students.filter((s) => s.grade === grade),
  })).filter((g) => g.list.length);

  return (
    <AppShell persona="teacher" eyebrow="Across every class you teach" title="Students">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Every child you teach, across all your classes and grades. Open anyone for their full
        picture — learning, the basics, PATH, and the coach&apos;s view in one place.
      </p>

      {byGrade.map(({ grade, list }) => (
        <Section
          key={grade}
          title={grade}
          actions={<Badge tone="neutral">{list.length} students</Badge>}
        >
          <Card>
            <div className="divide-y divide-line">
              {list.map((s) => (
                <StudentInspector
                  key={s.id}
                  studentId={s.id}
                  className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-sand"
                >
                  <Avatar name={s.name} size={34} />
                  <span className="w-40 shrink-0 truncate text-[14px] font-medium text-ink">{s.name}</span>
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
                  <span className="w-20 shrink-0 truncate text-right text-[12px] text-faint">{s.house}</span>
                  <ArrowRight size={15} className="shrink-0 text-faint" />
                </StudentInspector>
              ))}
            </div>
          </Card>
        </Section>
      ))}
    </AppShell>
  );
}
