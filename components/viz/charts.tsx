import type { MasteryStatus, SeriesPoint } from "@/data/types";
import { STATUS_META, STATUS_ORDER, statusColor } from "@/lib/status";

/* ---------------- Sparkline (area + line) ---------------- */
export function Sparkline({
  data,
  width = 220,
  height = 56,
  color = "#37357A",
  fill = true,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
}) {
  if (data.length < 2) return null;
  const pad = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const x = (i: number) => pad + (i / (data.length - 1)) * (width - pad * 2);
  const y = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);
  const line = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${height} L${x(0)},${height} Z`;
  const id = `sg-${color.replace("#", "")}`;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.16} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${id})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r={3} fill={color} />
    </svg>
  );
}

/* ---------------- Mastery ring (donut gauge) ---------------- */
export function MasteryRing({
  value,
  size = 92,
  color = "#5E7C6A",
  label,
  caption,
}: {
  value: number; // 0–1
  size?: number;
  color?: string;
  label?: string;
  caption?: string;
}) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="inline-flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ECEAE3" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - value)}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display text-lg text-ink tnum">{label ?? `${Math.round(value * 100)}%`}</span>
        </div>
      </div>
      {caption && <span className="mt-1.5 text-[11px] uppercase tracking-wider text-faint">{caption}</span>}
    </div>
  );
}

/* ---------------- Distribution bar (stacked) ---------------- */
export function DistributionBar({
  counts,
  showLegend = true,
}: {
  counts: Partial<Record<MasteryStatus, number>>;
  showLegend?: boolean;
}) {
  const present = STATUS_ORDER.filter((s) => (counts[s] ?? 0) > 0);
  const total = present.reduce((a, s) => a + (counts[s] ?? 0), 0) || 1;
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {present.map((s) => (
          <div
            key={s}
            style={{ width: `${((counts[s] ?? 0) / total) * 100}%`, backgroundColor: statusColor(s) }}
            title={`${STATUS_META[s].label}: ${counts[s]}`}
          />
        ))}
      </div>
      {showLegend && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {present.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 text-[12px] text-muted">
              <span className="size-2 rounded-full" style={{ backgroundColor: statusColor(s) }} />
              {STATUS_META[s].label}
              <span className="tnum text-faint">{counts[s]}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Bar row (value vs expected) ---------------- */
export function BarRow({
  label,
  value,
  max,
  expected,
  color = "#37357A",
  unit = "",
}: {
  label: string;
  value: number;
  max: number;
  expected?: number;
  color?: string;
  unit?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-[13px] text-muted">{label}</span>
      <div className="relative h-2.5 flex-1 rounded-full bg-sand">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, (value / max) * 100)}%`, backgroundColor: color }}
        />
        {typeof expected === "number" && (
          <div
            className="absolute -top-1 h-4.5 w-0.5 rounded bg-ink/40"
            style={{ left: `${Math.min(100, (expected / max) * 100)}%`, height: 18, top: -3 }}
            title={`Expected ${expected}${unit}`}
          />
        )}
      </div>
      <span className="w-12 shrink-0 text-right text-[13px] font-medium tnum text-ink">
        {value}
        {unit}
      </span>
    </div>
  );
}

/* ---------------- Benchmark correlation (predicted vs ACER actual) ---------------- */
export function BenchmarkPlot({
  data,
  size = 240,
}: {
  data: { predicted: number; actual: number; label: string }[];
  size?: number;
}) {
  const pad = 28;
  const lo = 60;
  const hi = 90;
  const map = (v: number) => pad + ((v - lo) / (hi - lo)) * (size - pad * 2);
  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* axes */}
      <line x1={pad} y1={size - pad} x2={size - pad} y2={size - pad} stroke="#ECEAE3" />
      <line x1={pad} y1={pad} x2={pad} y2={size - pad} stroke="#ECEAE3" />
      {/* perfect-correlation diagonal */}
      <line
        x1={pad}
        y1={size - pad}
        x2={size - pad}
        y2={pad}
        stroke="#C7C2B6"
        strokeDasharray="3 4"
      />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={map(d.predicted)}
          cy={size - pad - (map(d.actual) - pad)}
          r={5}
          fill="#37357A"
          fillOpacity={0.85}
          stroke="#fff"
          strokeWidth={1.5}
        >
          <title>{`${d.label}: predicted ${d.predicted}, actual ${d.actual}`}</title>
        </circle>
      ))}
      <text x={size - pad} y={size - 8} textAnchor="end" className="fill-faint" style={{ fontSize: 10 }}>
        predicted →
      </text>
      <text x={10} y={pad} className="fill-faint" style={{ fontSize: 10 }}>
        ACER ↑
      </text>
    </svg>
  );
}

/* ---------------- Mini line for trends (with axis labels) ---------------- */
export function TrendLine({
  data,
  width = 460,
  height = 120,
  color = "#37357A",
  format = (v: number) => `${v}`,
}: {
  data: SeriesPoint[];
  width?: number;
  height?: number;
  color?: string;
  format?: (v: number) => string;
}) {
  const padX = 8;
  const padY = 18;
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i: number) => padX + (i / (data.length - 1)) * (width - padX * 2);
  const y = (v: number) => padY + (1 - (v - min) / span) * (height - padY * 2);
  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const id = `tl-${color.replace("#", "")}`;
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.14} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${line} L${x(data.length - 1)},${height} L${x(0)},${height} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.value)} r={i === data.length - 1 ? 4 : 0} fill={color} />
          <text x={x(i)} y={height - 2} textAnchor="middle" className="fill-faint" style={{ fontSize: 10 }}>
            {d.label}
          </text>
        </g>
      ))}
      <text x={x(data.length - 1)} y={y(values[values.length - 1]) - 10} textAnchor="end" className="fill-ink" style={{ fontSize: 11, fontWeight: 600 }}>
        {format(values[values.length - 1])}
      </text>
    </svg>
  );
}
