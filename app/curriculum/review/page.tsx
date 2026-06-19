import { AppShell, Section } from "@/components/shell/AppShell";
import { Freshness } from "@/components/patterns/Signals";
import { ReviewQueue } from "@/components/curriculum/ReviewQueue";

export default function CurriculumReview() {
  return (
    <AppShell
      persona="curriculum"
      eyebrow="Dr. Vikram Iyer · Head of Curriculum"
      title="Review"
      actions={<Freshness state="today" />}
    >
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Changes teachers and associates have proposed to the map. Each one carries the reason and,
        where it changes wording, a before-and-after. Accept it, accept it with your own edits, or
        turn it down — nothing reaches a class until you decide.
      </p>

      <Section>
        <ReviewQueue />
      </Section>
    </AppShell>
  );
}
