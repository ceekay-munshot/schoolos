import { AppShell, Section } from "@/components/shell/AppShell";
import { Freshness } from "@/components/patterns/Signals";
import { VersionTimeline } from "@/components/curriculum/VersionTimeline";

export default function CurriculumVersions() {
  return (
    <AppShell
      persona="curriculum"
      eyebrow="Dr. Vikram Iyer · Head of Curriculum"
      title="Versions"
      actions={<Freshness state="today" />}
    >
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        The map is a living source of truth. Every release is kept — what changed, when, and who
        signed it off. The version marked live is the one every class, worksheet and report follows
        today.
      </p>

      <Section>
        <VersionTimeline />
      </Section>
    </AppShell>
  );
}
