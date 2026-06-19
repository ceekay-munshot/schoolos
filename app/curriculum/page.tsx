import { Layers, GitBranch, BookMarked } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { Freshness } from "@/components/patterns/Signals";
import { Card } from "@/components/ui/primitives";
import { CountUp } from "@/components/motion";
import { gradeCurricula, allAuthoredNodes, mapVersions } from "@/data/curriculum-extra";
import { SkillMaps } from "@/components/curriculum/SkillMaps";

export default function CurriculumSkillMaps() {
  const published = mapVersions.find((v) => v.status === "published");
  const judgmentCount = allAuthoredNodes.filter((n) => n.judgmentType === "judgment").length;
  const linkedCount = allAuthoredNodes.filter((n) => n.prerequisites.length > 0).length;

  const overview = [
    {
      icon: BookMarked,
      label: "Skills on the map",
      value: <CountUp value={allAuthoredNodes.length} />,
      foot: `across ${gradeCurricula.length} grades, four subjects`,
    },
    {
      icon: GitBranch,
      label: "Linked to a prerequisite",
      value: <CountUp value={linkedCount} />,
      foot: "each skill knows what comes first",
    },
    {
      icon: Layers,
      label: "Teacher-judged skills",
      value: <CountUp value={judgmentCount} />,
      foot: "the rest are machine-checkable",
    },
  ];

  return (
    <AppShell
      persona="curriculum"
      eyebrow="Dr. Vikram Iyer · Head of Curriculum"
      title="Skill maps"
      actions={<Freshness state="today" label={published ? `Live · ${published.label}` : "Live"} />}
    >
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        The map every class follows — what each child should master, in what order, mapped to the
        board. Pick a grade and subject to see its skills. Open any skill to edit its wording,
        prerequisites, board codes and the slips to watch for.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {overview.map((o) => (
          <Card key={o.label} className="flex items-start gap-3.5 p-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-soft text-indigo">
              <o.icon size={17} />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">{o.label}</p>
              <p className="mt-1 font-display text-2xl leading-none tnum text-ink">{o.value}</p>
              <p className="mt-1.5 text-[12px] text-faint">{o.foot}</p>
            </div>
          </Card>
        ))}
      </div>

      <Section>
        <SkillMaps />
      </Section>
    </AppShell>
  );
}
