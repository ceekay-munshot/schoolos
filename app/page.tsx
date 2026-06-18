import Link from "next/link";
import { ArrowRight, Smartphone, Monitor } from "lucide-react";
import { personas, DESIGN_RULES, school } from "@/data";
import { PERSONA_ICONS } from "@/lib/icons";
import { Brand, Spark } from "@/components/shell/Brand";
import { lakh } from "@/lib/utils";

const ACCENT: Record<string, { fg: string; soft: string }> = {
  teacher: { fg: "#37357A", soft: "bg-indigo-soft" },
  coach: { fg: "#5E7C6A", soft: "bg-mastered-soft" },
  principal: { fg: "#1C1B19", soft: "bg-sand" },
  parent: { fg: "#C8802E", soft: "bg-saffron-soft" },
  student: { fg: "#37357A", soft: "bg-indigo-soft" },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* top bar */}
      <header className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-6 lg:px-10">
        <Brand href="/" />
        <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-medium text-muted">
          UI/UX prototype · believable mock data
        </span>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-[1180px] px-6 pb-10 pt-10 lg:px-10 lg:pt-16">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[12px] font-medium text-indigo">
            <Spark size={14} /> AI-native K–12 · {school.board}
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-[44px] leading-[1.05] tracking-tight text-ink lg:text-[58px]">
            The operating system for a school that helps every child find their{" "}
            <span className="text-indigo">Mojo</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
            Six interfaces onto one stack — each shaped for one person&apos;s job. Leading
            metrics that move before the exam does, honest gaps instead of a wall of green,
            and the human always deciding. Choose a surface to step inside.
          </p>
        </div>
      </section>

      {/* persona bento */}
      <section className="mx-auto max-w-[1180px] px-6 pb-14 lg:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((p, i) => {
            const Icon = PERSONA_ICONS[p.icon];
            const a = ACCENT[p.id];
            const wide = p.id === "teacher";
            return (
              <Link
                key={p.id}
                href={p.href}
                style={{ animationDelay: `${i * 70}ms` }}
                className={`group animate-rise relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface p-7 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift ${
                  wide ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`grid size-12 place-items-center rounded-2xl ${a.soft}`} style={{ color: a.fg }}>
                    {Icon && <Icon size={24} />}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-faint">
                    {p.device === "mobile" ? <Smartphone size={11} /> : <Monitor size={11} />}
                    {p.device}
                  </span>
                </div>

                <h2 className="mt-5 font-display text-[24px] text-ink">{p.label}</h2>
                <p className="mt-0.5 text-[13px] font-medium" style={{ color: a.fg }}>
                  {p.tagline}
                </p>
                <p className={`mt-3 text-[14px] leading-relaxed text-muted ${wide ? "max-w-md" : ""}`}>
                  {p.blurb}
                </p>

                <div className="mt-auto flex items-center justify-between pt-6">
                  <span className="text-[13px] text-faint">
                    {p.person} · {p.role}
                  </span>
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-sand text-ink transition-all duration-300 group-hover:bg-indigo group-hover:text-white">
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* design rules */}
      <section className="border-y border-line bg-sand/50">
        <div className="mx-auto max-w-[1180px] px-6 py-14 lg:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">
            Six non-negotiable design rules
          </p>
          <h2 className="mt-2 font-display text-[28px] text-ink">What every screen obeys</h2>
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {DESIGN_RULES.map((r) => (
              <div key={r.n} className="flex gap-4">
                <span className="font-display text-2xl leading-none text-indigo/30 tnum">
                  {String(r.n).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-[17px] text-ink">{r.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* facts footer */}
      <section className="mx-auto max-w-[1180px] px-6 py-12 lg:px-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { k: "Students", v: school.students.toLocaleString("en-IN") },
            { k: "Annual fee", v: lakh(school.annualFee), s: `vs ${lakh(school.ibComparableFee)} at an IB school` },
            { k: "Board", v: "CBSE", s: "aligned to NCF" },
            { k: "Validated against", v: school.benchmark, s: "leading vs lagging, proven" },
          ].map((f) => (
            <div key={f.k}>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">{f.k}</p>
              <p className="mt-1.5 font-display text-2xl text-ink tnum">{f.v}</p>
              {f.s && <p className="mt-0.5 text-[12px] text-faint">{f.s}</p>}
            </div>
          ))}
        </div>
        <p className="mt-10 text-[12px] text-faint">
          Tomo School OS · a design prototype. All students, names and data shown are
          fictional but representative. © {school.foundedYear}–2026.
        </p>
      </section>
    </div>
  );
}
