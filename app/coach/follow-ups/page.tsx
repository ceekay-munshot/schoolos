import Link from "next/link";
import { Check, CircleDot, Clock3, ArrowUpRight, type LucideIcon } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { studentById } from "@/data/students";
import { followUps, OWNER_LABEL, IMPACT_LABEL, type Owner, type Impact } from "@/data/coach-extra";
import { MetricTile } from "@/components/patterns/atoms";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge } from "@/components/ui/primitives";
import { relativeDays } from "@/lib/utils";

const OWNER_TONE: Record<Owner, "indigo" | "saffron" | "mastered"> = {
  school: "indigo",
  student: "saffron",
  parent: "mastered",
};

const IMPACT_META: Record<
  Impact,
  { icon: LucideIcon; tone: "mastered" | "saffron" | "neutral"; dot: string; blurb: string }
> = {
  changed: {
    icon: Check,
    tone: "mastered",
    dot: "#5E7C6A",
    blurb: "Learning or participation actually moved.",
  },
  partial: {
    icon: CircleDot,
    tone: "saffron",
    dot: "#C8802E",
    blurb: "Some movement; the action isn't finished landing.",
  },
  "not-yet": {
    icon: Clock3,
    tone: "neutral",
    dot: "#9C988E",
    blurb: "No change yet — named honestly, not buried.",
  },
};

const ORDER: Impact[] = ["changed", "partial", "not-yet"];

function FollowUpRow({ f }: { f: (typeof followUps)[number] }) {
  const s = studentById(f.studentId)!;
  const meta = IMPACT_META[f.impact];
  return (
    <div className="flex items-start gap-3 px-5 py-3.5">
      <Link href={`/coach/${f.studentId}`} className="group flex shrink-0 items-center gap-2.5">
        <Avatar name={s.name} size={34} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/coach/${f.studentId}`}
            className="group inline-flex items-center gap-1 text-[13px] font-medium text-ink hover:text-indigo"
          >
            {s.name.split(" ")[0]}
            <ArrowUpRight size={12} className="text-faint transition-colors group-hover:text-indigo" />
          </Link>
          <Badge tone={OWNER_TONE[f.owner]}>{OWNER_LABEL[f.owner]}</Badge>
        </div>
        <p className="mt-0.5 text-[13px] text-ink">{f.action}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted">{f.read}</p>
        <p className="mt-1 text-[11px] text-faint">due {relativeDays(f.due)}</p>
      </div>
      <Badge tone={meta.tone} className="mt-0.5 shrink-0">
        <meta.icon size={11} /> {IMPACT_LABEL[f.impact]}
      </Badge>
    </div>
  );
}

export default function CoachFollowUps() {
  const counts: Record<Impact, number> = { changed: 0, partial: 0, "not-yet": 0 };
  for (const f of followUps) counts[f.impact]++;

  return (
    <AppShell persona="coach" eyebrow="Honest tracking · not a wall of green" title="Follow-ups">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Every commitment from a check-in, tracked to a plain answer: did it change learning or
        participation? Some did. Some are partway. Some haven’t yet — and that’s recorded as
        clearly as the wins. Honesty is the whole point.
      </p>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <MetricTile label="Changed" value={counts.changed} accent="#5E7C6A" foot="moved the needle" />
        <MetricTile label="Partial" value={counts.partial} accent="#C8802E" foot="still landing" />
        <MetricTile label="Not yet" value={counts["not-yet"]} accent="#9C988E" foot="named, not hidden" />
      </div>

      <div className="space-y-8">
        {ORDER.map((impact) => {
          const rows = followUps.filter((f) => f.impact === impact);
          if (!rows.length) return null;
          const meta = IMPACT_META[impact];
          return (
            <Section
              key={impact}
              title={
                <span className="inline-flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: meta.dot }} />
                  {IMPACT_LABEL[impact]}
                </span>
              }
              description={meta.blurb}
            >
              <Card>
                <div className="divide-y divide-line">
                  {rows.map((f) => (
                    <FollowUpRow key={f.id} f={f} />
                  ))}
                </div>
              </Card>
            </Section>
          );
        })}
      </div>
    </AppShell>
  );
}
