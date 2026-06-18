import Link from "next/link";
import { ArrowRight, Users2, Activity } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { teacherClasses } from "@/data/teacher-extra";
import { Card, Badge } from "@/components/ui/primitives";

export default function TeacherClasses() {
  return (
    <AppShell persona="teacher" eyebrow="Ms. Lakshmi Krishnan · Maths" title="Classes">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Your classes this term, with the one shared gap worth a small group and the overall pace.
        Open a class for its full learning health.
      </p>

      <Section>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {teacherClasses.map((c) => (
            <Link key={c.klass} href="/teacher/health">
              <Card hover className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <Badge tone="indigo">{c.subject}</Badge>
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-faint">
                    <Users2 size={13} /> {c.students}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-xl text-ink">{c.klass}</h2>
                <div className="mt-4 space-y-2 border-t border-line pt-4">
                  <p className="text-[13px] text-muted">
                    <span className="text-faint">Shared gap · </span>
                    {c.sharedGap}
                  </p>
                  <p className="inline-flex items-center gap-1.5 text-[13px] text-muted">
                    <Activity size={13} className="text-faint" /> {c.pace}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-indigo">
                  Class health <ArrowRight size={14} />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </AppShell>
  );
}
