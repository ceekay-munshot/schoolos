import { ScanLine, GraduationCap, CloudOff, TriangleAlert, RefreshCw } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import {
  rooms,
  attendance,
  physicalAttendanceToday,
  captureStations,
  tutorAvailability,
  syncHealth,
  offlineHealth,
} from "@/data/principal-extra";
import { MetricTile } from "@/components/patterns/atoms";
import { MasteryRing } from "@/components/viz/charts";
import { Freshness } from "@/components/patterns/Signals";
import { Card, SectionLabel, Badge } from "@/components/ui/primitives";
import { pct } from "@/lib/utils";

export default function PrincipalOperations() {
  const totalCap = rooms.reduce((a, r) => a + r.capacity, 0);
  const totalEnrolled = rooms.reduce((a, r) => a + r.enrolled, 0);
  const utilisation = totalEnrolled / totalCap;
  const totalScans = captureStations.reduce((a, s) => a + s.scans, 0);
  const totalMissed = captureStations.reduce((a, s) => a + s.missed, 0);
  const captureRate = totalScans / (totalScans + totalMissed);

  return (
    <AppShell persona="principal" eyebrow="The school as a running operation" title="Operations">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Rooms, adults and stations — and the eyesight of the engine. If capture lapses, every
        diagnosis downstream goes blind, so it is read here as ops-critical, not vanity.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile label="Space utilisation" value={pct(utilisation)} accent="#37357A" foot={`${totalEnrolled} of ${totalCap} seats`} />
        <MetricTile label="Physical attendance" value={pct(physicalAttendanceToday)} foot="present today" />
        <MetricTile label="Capture this week" value={pct(captureRate)} accent="#5E7C6A" foot={`${totalMissed} missed scans`} />
        <MetricTile label="Tutor uptime" value={pct(tutorAvailability.uptime, 1)} foot="rolling 30 days" />
      </div>

      <Section title="Room, group & adult allocation" description="Live allocation across the campus — who is where, with whom, and how full.">
        <Card>
          <div className="grid grid-cols-12 gap-4 border-b border-line px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-faint">
            <span className="col-span-3">Room</span>
            <span className="col-span-3">Group</span>
            <span className="col-span-2">Teacher</span>
            <span className="col-span-2">Assistant</span>
            <span className="col-span-2 text-right">Capacity</span>
          </div>
          <div className="divide-y divide-line">
            {rooms.map((r) => {
              const full = r.enrolled / r.capacity;
              return (
                <div key={r.room} className="grid grid-cols-12 items-center gap-4 px-5 py-3.5">
                  <span className="col-span-3 text-[14px] font-medium text-ink">{r.room}</span>
                  <span className="col-span-3 text-[13px] text-muted">{r.group}</span>
                  <span className="col-span-2 text-[13px] text-ink">{r.teacher}</span>
                  <span className="col-span-2 text-[13px] text-muted">{r.assistant}</span>
                  <div className="col-span-2 flex items-center justify-end gap-2.5">
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-sand">
                      <div className="h-full rounded-full" style={{ width: `${full * 100}%`, backgroundColor: full > 0.95 ? "#C0913A" : "#5E7C6A" }} />
                    </div>
                    <span className="w-12 shrink-0 text-right text-[13px] tnum text-ink">{r.enrolled}/{r.capacity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </Section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="Physical attendance" description="Present today, by group.">
          <Card className="p-6">
            <div className="space-y-3.5">
              {attendance.map((a) => {
                const r = a.present / a.total;
                return (
                  <div key={a.group} className="flex items-center gap-3">
                    <span className="w-36 shrink-0 text-[13px] text-muted">{a.group}</span>
                    <div className="h-2.5 flex-1 rounded-full bg-sand">
                      <div className="h-full rounded-full" style={{ width: `${r * 100}%`, backgroundColor: r < 0.92 ? "#C0913A" : "#5E7C6A" }} />
                    </div>
                    <span className="w-14 shrink-0 text-right text-[13px] tnum text-ink">{a.present}/{a.total}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </Section>

        <Section title="AI Tutor availability & usage" description="Middle & high self-work — the tutor assists practice, never replaces a teacher.">
          <Card className="flex items-center gap-6 p-6">
            <MasteryRing value={tutorAvailability.activeStudentsThisWeek} color="#37357A" size={104} caption="active" />
            <div className="space-y-2.5">
              <p className="inline-flex items-center gap-2 font-display text-lg text-ink">
                <GraduationCap size={18} className="text-indigo" /> {pct(tutorAvailability.activeStudentsThisWeek)} active this week
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
                <span>{tutorAvailability.sessionsThisWeek} sessions</span>
                <span>median {tutorAvailability.medianTurns} turns</span>
              </div>
              <p className="text-[12px] text-faint">
                {tutorAvailability.flaggedForTeacher} sessions deferred to a teacher decision this
                week — judgment territory is always handed back to a human.
              </p>
            </div>
          </Card>
        </Section>
      </div>

      <Section title="Capture-station performance" description="The engine's eyesight — clean scans in, missed scans surfaced for a quick fix.">
        <Card className="mb-4 flex items-start gap-3 border-practising/25 bg-practising-soft/40 p-4">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-practising" />
          <p className="text-[13px] leading-relaxed text-ink">
            Discovery Room&apos;s station is missing more scans than the rest — every miss is a child&apos;s
            work the engine can&apos;t see. Operations is already on it; capture stays an ops-critical metric.
          </p>
        </Card>
        <Card>
          <div className="grid grid-cols-12 gap-4 border-b border-line px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-faint">
            <span className="col-span-5">Station</span>
            <span className="col-span-2 text-right">Scans</span>
            <span className="col-span-2 text-right">Missed</span>
            <span className="col-span-3 text-right">Last sync</span>
          </div>
          <div className="divide-y divide-line">
            {captureStations.map((s) => (
              <div key={s.location} className="grid grid-cols-12 items-center gap-4 px-5 py-3.5">
                <span className="col-span-5 inline-flex items-center gap-2 text-[14px] text-ink">
                  <ScanLine size={15} className={s.status === "watch" ? "text-practising" : "text-mastered"} />
                  {s.location}
                </span>
                <span className="col-span-2 text-right text-[13px] tnum text-muted">{s.scans}</span>
                <span className={"col-span-2 text-right text-[13px] font-medium tnum " + (s.status === "watch" ? "text-practising" : "text-muted")}>
                  {s.missed}
                </span>
                <span className="col-span-3 inline-flex items-center justify-end gap-1.5 text-[12px] text-faint">
                  {s.status === "watch" && <Badge tone="practising">watch</Badge>}
                  {s.lastSync}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Offline & sync health" description="Capture, marking and the day's plan all work offline and sync when a connection returns.">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <SectionLabel className="mb-4">Pending sync by surface</SectionLabel>
            <div className="divide-y divide-line">
              {syncHealth.map((s) => (
                <div key={s.surface} className="flex items-center justify-between py-3">
                  <span className="inline-flex items-center gap-2 text-[14px] text-ink">
                    {s.state === "pending" ? (
                      <RefreshCw size={14} className="text-indigo" />
                    ) : (
                      <span className="size-2 rounded-full bg-mastered" />
                    )}
                    {s.surface}
                  </span>
                  <span className="text-[13px] text-muted">
                    {s.pending === 0 ? (
                      <Freshness state="today" label="Synced" />
                    ) : (
                      <>
                        <span className="font-medium tnum text-ink">{s.pending}</span> pending · {s.oldestPending}
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="flex flex-col justify-center gap-3 p-6">
            <div className="inline-flex items-center gap-2 text-[14px] font-medium text-ink">
              <CloudOff size={16} className="text-muted" /> Devices online
            </div>
            <p className="font-display text-3xl tnum text-ink">
              {offlineHealth.devicesOnline}
              <span className="text-lg text-faint"> / {offlineHealth.devicesTotal}</span>
            </p>
            <Freshness state="sync-pending" label={`Last full sync · ${offlineHealth.lastFullSync}`} />
          </Card>
        </div>
      </Section>
    </AppShell>
  );
}
