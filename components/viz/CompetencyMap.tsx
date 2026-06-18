import { FRACTION_PATH, masteryAt } from "@/data/mastery";
import { nodeById } from "@/data/competency";
import { statusColor, statusLabel } from "@/lib/status";
import { cn } from "@/lib/utils";

const SHORT: Record<string, string> = {
  "MATH.FRAC.MEANING.01": "Meaning",
  "MATH.FRAC.MEANING.02": "Number line",
  "MATH.FRAC.EQUIV.01": "Equivalence",
  "MATH.FRAC.COMPARE.02": "Compare",
  "MATH.FRAC.ADD.03": "Add / subtract",
  "MATH.FRAC.WORD.04": "Word problems",
};

/** Linear prerequisite chain for the Fractions strand, coloured by a child's
 *  mastery. The gap node is ringed; everything downstream of it is visibly
 *  blocked — that's the "walk back to the root" made legible. */
export function CompetencyMap({
  studentId,
  className,
}: {
  studentId: string;
  className?: string;
}) {
  const states = FRACTION_PATH.map((id) => ({
    node: nodeById(id)!,
    state: masteryAt(studentId, id),
  }));
  const gapIndex = states.findIndex((s) => s.state?.status === "gap");

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-start">
        {states.map(({ node, state }, i) => {
          const status = state?.status ?? "not-introduced";
          const color = statusColor(status);
          const isGap = status === "gap";
          const blocked = gapIndex >= 0 && i > gapIndex && status !== "mastered" && status !== "retained";
          return (
            <div key={node.id} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <span className={cn("h-0.5 flex-1", i === 0 ? "opacity-0" : "bg-line")} />
                <span className="relative grid place-items-center">
                  <span
                    className={cn("grid size-7 place-items-center rounded-full", isGap && "live-dot")}
                    style={{ backgroundColor: color, opacity: blocked ? 0.45 : 1 }}
                  >
                    {(status === "mastered" || status === "retained") && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6.2l2.2 2.2 4.8-5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {isGap && (
                    <span className="absolute -inset-1 rounded-full ring-2 ring-gap/40" />
                  )}
                </span>
                <span className={cn("h-0.5 flex-1", i === states.length - 1 ? "opacity-0" : "bg-line")} />
              </div>
              <p className={cn("mt-2 text-center text-[11px] font-medium leading-tight", blocked ? "text-faint" : "text-ink")}>
                {SHORT[node.id] ?? node.id}
              </p>
              {isGap ? (
                <span className="mt-1 rounded-full bg-gap-soft px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gap">
                  Root gap
                </span>
              ) : (
                <span className="mt-1 text-[10px] text-faint">{statusLabel(status)}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
