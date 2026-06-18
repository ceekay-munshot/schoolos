import { Check } from "lucide-react";

/** Offline-first is a non-negotiable rule (#5). We surface sync state as a calm,
 *  reassuring detail — never an alarm. */
export function OfflinePill() {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-2 rounded-full bg-mastered/40 live-dot" />
        <span className="relative inline-flex size-2 rounded-full bg-mastered" />
      </span>
      <div className="leading-tight">
        <p className="text-[12px] font-medium text-ink">Working offline-ready</p>
        <p className="text-[10px] text-faint">
          <Check size={9} className="-mt-0.5 mr-0.5 inline" />
          Synced 6 min ago
        </p>
      </div>
    </div>
  );
}
