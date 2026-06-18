import { AppShell, Section } from "@/components/shell/AppShell";
import { pathArtifacts, pathDefs } from "@/data/paths";
import { students, studentById } from "@/data/students";
import { StudentInspector } from "@/components/patterns/StudentInspector";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge } from "@/components/ui/primitives";
import { relativeDays } from "@/lib/utils";

const ARC = [
  { stage: "Sample", body: "Try the form. Notice what pulls you." },
  { stage: "Specialise", body: "Hone into a few; build craft and a body of work." },
  { stage: "Master", body: "A recognisable voice; a rising standard with no ceiling." },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="size-2 rounded-full"
          style={{ backgroundColor: i <= n ? "#C8802E" : "#ECEAE3" }}
        />
      ))}
    </span>
  );
}

export default function PathBlocks() {
  const builderGroup = students.filter((s) => s.paths.some((p) => p.path === "builder"));

  return (
    <AppShell persona="teacher" eyebrow="Today · 13:00 · Workshop" title="PATH · Builder">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        A different shape from a Concept block — mixed-age groups, and the sensor is the
        artifact and its rising standard, never a worksheet. The human rates the work; the
        system tracks the trajectory.
      </p>

      {/* the arc */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ARC.map((a, i) => (
          <Card key={a.stage} className="p-5">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-saffron-soft text-[12px] font-semibold text-saffron-deep tnum">
                {i + 1}
              </span>
              <p className="font-display text-lg text-ink">{a.stage}</p>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{a.body}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* today's mixed-age builder group */}
        <div className="lg:col-span-2">
          <Section title="Today's group" description="Class 4–5, mixed by level not age.">
            <Card className="p-4">
              <div className="space-y-1">
                {builderGroup.map((s) => {
                  const e = s.paths.find((p) => p.path === "builder")!;
                  return (
                    <StudentInspector
                      key={s.id}
                      studentId={s.id}
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-sand"
                    >
                      <Avatar name={s.name} size={34} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-ink">{s.name}</span>
                        <span className="block truncate text-[11px] text-faint">{s.grade} · {e.stage}</span>
                      </span>
                      <span className="tnum text-[12px] text-saffron-deep">{e.standard}</span>
                    </StudentInspector>
                  );
                })}
              </div>
            </Card>
          </Section>
        </div>

        {/* recent artifacts across paths */}
        <div className="lg:col-span-3">
          <Section title="Recent work & rising standard" description="Artifacts this fortnight across all six paths.">
            <div className="space-y-3">
              {pathArtifacts.map((a) => {
                const s = studentById(a.studentId)!;
                const def = pathDefs[a.path];
                return (
                  <Card key={a.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <Badge tone="saffron">
                        <span>{def.glyph}</span> {def.name}
                      </Badge>
                      <span className="text-[11px] text-faint">{relativeDays(a.date)}</span>
                    </div>
                    <p className="mt-3 font-display text-lg leading-snug text-ink">{a.title}</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{a.note}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                      <StudentInspector studentId={s.id} className="flex items-center gap-2 text-[12px] text-muted hover:text-ink">
                        <Avatar name={s.name} size={22} /> {s.name} · {a.group}
                      </StudentInspector>
                      <span className="inline-flex items-center gap-2 text-[11px] text-faint">
                        standard <Stars n={a.standardRating} />
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
