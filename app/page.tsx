import Link from "next/link";
import { personas, DESIGN_RULES, school } from "@/data";
import { Spark } from "@/components/shell/Brand";
import { PersonaCard } from "@/components/shell/PersonaCard";
import { AnimatedTomo, Reveal, CountUp } from "@/components/motion";
import { lakh } from "@/lib/utils";

const ACCENT: Record<string, { fg: string; soft: string }> = {
  teacher: { fg: "#37357A", soft: "bg-indigo-soft" },
  coach: { fg: "#5E7C6A", soft: "bg-mastered-soft" },
  principal: { fg: "#1C1B19", soft: "bg-sand" },
  parent: { fg: "#C8802E", soft: "bg-saffron-soft" },
  student: { fg: "#37357A", soft: "bg-indigo-soft" },
  curriculum: { fg: "#37357A", soft: "bg-indigo-soft" },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* top bar */}
      <header className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" aria-label="Tomo School OS" className="inline-flex items-center gap-2.5">
          <AnimatedTomo className="h-[26px] text-saffron-deep" />
          <span className="border-l border-line pl-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-faint">
            School OS
          </span>
        </Link>
        <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-medium text-muted">
          {school.campus} · {school.city} · AY 2026–27
        </span>
      </header>

      {/* hero */}
      <section className="hero-aura mx-auto max-w-[1180px] px-6 pb-10 pt-10 lg:px-10 lg:pt-16">
        <Spark size={40} color="var(--color-saffron)" className="animate-float pointer-events-none absolute right-10 top-0 hidden opacity-50 lg:block" />
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[12px] font-medium text-indigo">
            <Spark size={14} /> An AI-powered school · {school.board}
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-[44px] leading-[1.05] tracking-tight text-ink lg:text-[58px]">
            One simple system that helps every child find their{" "}
            <span className="text-indigo">Mojo</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
            Five views of the same child — for teachers, coaches, the principal, parents and
            students. We spot problems early, show the honest picture, and let people make the
            calls. Pick one to look inside.
          </p>
        </div>
      </section>

      {/* persona bento */}
      <section className="mx-auto max-w-[1180px] px-6 pb-14 lg:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((p, i) => (
            <PersonaCard
              key={p.id}
              p={p}
              accentFg={ACCENT[p.id].fg}
              accentSoft={ACCENT[p.id].soft}
              wide={p.id === "teacher"}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* design rules */}
      <section className="border-y border-line bg-sand/50">
        <div className="mx-auto max-w-[1180px] px-6 py-14 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Six simple rules</p>
            <h2 className="mt-2 font-display text-[28px] text-ink">What every screen follows</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {DESIGN_RULES.map((r, i) => (
              <Reveal key={r.n} delay={i * 0.05}>
                <div className="flex gap-4">
                  <span className="font-display text-2xl leading-none text-indigo/30 tnum">
                    {String(r.n).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[17px] text-ink">{r.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">{r.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* facts footer */}
      <section className="mx-auto max-w-[1180px] px-6 py-12 lg:px-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">Students</p>
            <p className="mt-1.5 font-display text-2xl text-ink tnum">
              <CountUp value={school.students} />
            </p>
          </div>
          {[
            { k: "Annual fee", v: lakh(school.annualFee), s: `vs ${lakh(school.ibComparableFee)} at an IB school` },
            { k: "Board", v: "CBSE", s: "follows NCF" },
            { k: "Checked against", v: school.benchmark, s: "so we catch issues early" },
          ].map((f) => (
            <div key={f.k}>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">{f.k}</p>
              <p className="mt-1.5 font-display text-2xl text-ink tnum">{f.v}</p>
              {f.s && <p className="mt-0.5 text-[12px] text-faint">{f.s}</p>}
            </div>
          ))}
        </div>
        <p className="mt-10 text-[12px] text-faint">
          Tomo School OS · {school.campus}, {school.city} · CBSE Affiliation No. 830472 ·
          © {school.foundedYear}–2026 Tomo Schools. All rights reserved.
        </p>
      </section>
    </div>
  );
}
