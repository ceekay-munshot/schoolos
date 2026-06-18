"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Smartphone, Monitor } from "lucide-react";
import { PERSONA_ICONS } from "@/lib/icons";
import type { PersonaMeta } from "@/data";
import { cn } from "@/lib/utils";

export function PersonaCard({
  p,
  accentFg,
  accentSoft,
  wide,
  index = 0,
}: {
  p: PersonaMeta;
  accentFg: string;
  accentSoft: string;
  wide?: boolean;
  index?: number;
}) {
  const Icon = PERSONA_ICONS[p.icon];
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-5, 5]), { stiffness: 200, damping: 18 });

  return (
    <Link
      href={p.href}
      style={{ animationDelay: `${index * 70}ms` }}
      className={cn("group animate-rise [perspective:1000px]", wide && "lg:col-span-2")}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-7 shadow-soft transition-shadow duration-300 group-hover:shadow-lift"
      >
        <div className="flex items-start justify-between">
          <span
            className={cn("grid size-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-105", accentSoft)}
            style={{ color: accentFg }}
          >
            {Icon && <Icon size={24} />}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-faint">
            {p.device === "mobile" ? <Smartphone size={11} /> : <Monitor size={11} />}
            {p.device}
          </span>
        </div>

        <h2 className="mt-5 font-display text-[24px] text-ink">{p.label}</h2>
        <p className="mt-0.5 text-[13px] font-medium" style={{ color: accentFg }}>
          {p.tagline}
        </p>
        <p className={cn("mt-3 text-[14px] leading-relaxed text-muted", wide && "max-w-md")}>{p.blurb}</p>

        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-[13px] text-faint">
            {p.person} · {p.role}
          </span>
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-sand text-ink transition-all duration-300 group-hover:bg-indigo group-hover:text-white">
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
