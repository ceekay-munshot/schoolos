import Link from "next/link";
import { Clock, MapPin, ArrowRight, Inbox, Check, CircleAlert } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { blockById } from "@/data/timetable";
import { heroLessonPlan } from "@/data/lessonplans";
import { todayPrep, type PrepStatus } from "@/data/teacher-extra";
import { reviewQueue } from "@/data/coach";
import { OneMoveCard } from "@/components/patterns/OneMoveCard";
import { Card, Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const PREP: Record<PrepStatus, { label: string; tone: "mastered" | "practising" | "gap"; Icon: typeof Check }> = {
  ready: { label: "Ready", tone: "mastered", Icon: Check },
  review: { label: "Needs review", tone: "practising", Icon: CircleAlert },
  "not-ready": { label: "Not ready", tone: "gap", Icon: CircleAlert },
};

export default function TeacherToday() {
  const blocks = todayPrep.map((p) => ({ prep: p, block: blockById(p.blockId)! }));
  const reviewCount = reviewQueue.length;

  return (
    <AppShell persona="teacher" eyebrow="Thursday, 18 June · Ms. Lakshmi Krishnan" title="Today">
      {/* the single most valuable action of the day */}
      <div className="mb-8">
        <OneMoveCard oneMove={heroLessonPlan.oneMove} />
        <div className="mt-3 flex items-center justify-between">
          <Link
            href={`/teacher/block/${heroLessonPlan.blockId}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-indigo hover:text-indigo-ink"
          >
            Open the 09:00 block prep <ArrowRight size={15} />
          </Link>
          {reviewCount > 0 && (
            <Link href="/teacher/review" className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink">
              <Inbox size={14} /> {reviewCount} items in your review queue
            </Link>
          )}
        </div>
      </div>

      <Section title="Today's blocks" description="Times, rooms and whether each block is prepared.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {blocks.map(({ prep, block }) => {
            const p = PREP[prep.status];
            const concept = block.kind === "concept";
            const href = concept ? `/teacher/block/${block.id}` : "/teacher/path";
            return (
              <Link key={block.id} href={href}>
                <Card hover className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="h-1 w-9 rounded-full"
                      style={{ backgroundColor: concept ? "#37357A" : "#C8802E" }}
                    />
                    <Badge tone={p.tone}>
                      <p.Icon size={11} /> {p.label}
                    </Badge>
                  </div>
                  <p className="mt-3 font-display text-lg text-ink">{block.label}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-faint">
                    <Clock size={11} /> {block.start}–{block.end} · {block.klass.replace("Class ", "Cl ")}
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-[12px] text-faint">
                    <MapPin size={11} /> {block.room}
                  </p>
                  <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-muted">{prep.note}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </Section>

      <p className={cn("flex items-center gap-2 text-[12px] text-faint")}>
        <Check size={13} className="text-mastered" /> Working offline-ready · everything synced 6 minutes ago. Nothing today depends on the network.
      </p>
    </AppShell>
  );
}
