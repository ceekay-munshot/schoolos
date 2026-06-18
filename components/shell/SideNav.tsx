"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import type { Persona } from "@/data/types";
import { cn } from "@/lib/utils";

export function SideNav({ persona }: { persona: Persona }) {
  const pathname = usePathname();
  const items = NAV[persona];
  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((item) => {
        const active =
          item.href === `/${persona}` ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active ? "bg-indigo-soft text-indigo" : "text-muted hover:bg-sand hover:text-ink",
            )}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo" />
            )}
            <Icon
              size={18}
              className={cn(
                "transition-transform duration-200",
                active ? "text-indigo" : "text-faint group-hover:translate-x-0.5 group-hover:text-muted",
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
