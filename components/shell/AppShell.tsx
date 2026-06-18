import * as React from "react";
import { Brand } from "./Brand";
import { SideNav } from "./SideNav";
import { PersonaSwitcher } from "./PersonaSwitcher";
import { OfflinePill } from "./OfflinePill";
import { personaById, school } from "@/data";
import type { Persona } from "@/data/types";
import { cn } from "@/lib/utils";

export function AppShell({
  persona,
  title,
  eyebrow,
  actions,
  children,
  maxWidth = "max-w-[1200px]",
}: {
  persona: Persona;
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const meta = personaById(persona);
  return (
    <div className="flex min-h-screen bg-canvas">
      {/* ---- left rail ---- */}
      <aside className="sticky top-0 hidden h-screen w-[252px] shrink-0 flex-col border-r border-line bg-canvas px-4 py-5 lg:flex">
        <div className="px-2">
          <Brand />
        </div>

        <div className="mt-8 px-1">
          <p className="px-2 pb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
            {meta.label}
          </p>
          <SideNav persona={persona} />
        </div>

        <div className="mt-auto flex flex-col gap-2.5 px-1">
          <OfflinePill />
          <PersonaSwitcher current={persona} />
        </div>
      </aside>

      {/* ---- main column ---- */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md">
          <div className={cn("mx-auto flex items-center gap-4 px-6 py-4 lg:px-10", maxWidth)}>
            <div className="min-w-0 flex-1">
              {eyebrow && (
                <p className="text-[12px] font-medium text-faint">{eyebrow}</p>
              )}
              <h1 className="truncate font-display text-[26px] leading-tight text-ink">
                {title}
              </h1>
            </div>
            {actions}
            <div className="hidden items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-right sm:flex">
              <div className="leading-tight">
                <p className="text-[12px] font-medium text-ink">Thu, 18 June</p>
                <p className="text-[10px] text-faint">{school.name} · {school.campus.replace(" Campus", "")}</p>
              </div>
            </div>
          </div>
        </header>

        <main className={cn("mx-auto w-full flex-1 px-6 py-8 lg:px-10", maxWidth)}>
          {children}
        </main>
      </div>
    </div>
  );
}

/** A simple page section wrapper with an optional heading + description. */
export function Section({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-10", className)}>
      {(title || actions) && (
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            {title && <h2 className="font-display text-xl text-ink">{title}</h2>}
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
