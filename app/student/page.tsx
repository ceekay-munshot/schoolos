"use client";

import * as React from "react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { Segmented } from "@/components/ui/tabs";
import { Reveal } from "@/components/motion";
import {
  studentProfiles,
  profileById,
  DEFAULT_PROFILE_ID,
} from "@/data/student-profiles";
import { TodayHero } from "@/components/student/TodayHero";
import { WeekSchedule } from "@/components/student/WeekSchedule";
import { LessonPlanCard } from "@/components/student/LessonPlanCard";
import { HomeworkUpload } from "@/components/student/HomeworkUpload";
import { InsightCards } from "@/components/student/InsightCards";
import { TutorPanel, TutorLocked } from "@/components/student/TutorPanel";
import { MahiraDeepDive } from "@/components/student/MahiraDeepDive";
import { PersonalLearningMap } from "@/components/viz/PersonalLearningMap";
import { MomentumRings } from "@/components/viz/MomentumRings";
import { skillGraphByProfile, momentumByProfile } from "@/data/viz-student-extra";

// Map profile IDs to short keys used in viz data
const PROFILE_KEY: Record<string, string> = {
  "stu-riya":     "riya",
  "stu-mahira":   "mahira",
  "stu-aditya-v": "aditya",
};

/* The Student OS, as a desktop dashboard. A three-child toggle (Riya · Mahira ·
   Aditya, by stage) swaps the whole view. Everyone gets Today, their week, the
   lesson their teacher planned, a place to hand in work, and observations on
   past work. The AI tutor is live for middle & high; for elementary it shows a
   gentle locked state, honouring the school's paper-first approach. */

const TOGGLE_ITEMS = studentProfiles.map((p) => {
  const stage = p.stage === "elementary" ? "Elementary" : p.stage === "middle" ? "Middle" : "High";
  return { id: p.id, label: `${p.name.split(" ")[0]} · ${stage}` };
});

export default function StudentApp() {
  const [activeId, setActiveId] = React.useState(DEFAULT_PROFILE_ID);
  const profile = profileById(activeId);
  const isMahira = profile.id === "stu-mahira";
  const profileKey = PROFILE_KEY[profile.id] ?? "mahira";
  const skillGraph = skillGraphByProfile[profileKey];
  const momentumData = momentumByProfile[profileKey];

  return (
    <AppShell
      persona="student"
      eyebrow={`${profile.grade} · ${profile.house} House`}
      title={profile.name}
      actions={
        <Segmented
          items={TOGGLE_ITEMS}
          value={activeId}
          onChange={setActiveId}
          className="hidden md:inline-flex"
        />
      }
    >
      {/* toggle again on small screens, where the header control is hidden */}
      <div className="mb-7 md:hidden">
        <Segmented items={TOGGLE_ITEMS} value={activeId} onChange={setActiveId} />
      </div>

      {/* a fresh mount per child so reveals replay and state resets cleanly */}
      <div key={profile.id}>
        <Section>
          <Reveal>
            <TodayHero profile={profile} />
          </Reveal>
          <Reveal>
            <div className="mt-5">
              {profile.hasTutor && momentumData ? (
                <MomentumRings data={momentumData} />
              ) : (
                <div className="rounded-xl bg-surface p-4 text-[13px] text-muted">
                  Your work goes on paper. Your teacher can see how you are getting on — right here.
                </div>
              )}
            </div>
          </Reveal>
        </Section>

        <Section>
          <Reveal>
            <WeekSchedule week={profile.schedule} />
          </Reveal>
        </Section>

        <Section
          title="What your teacher planned"
          description="The steps your teacher set out for the class happening now. Just so you know what's coming — there's nothing to do here."
        >
          <Reveal>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr,1fr]">
              <LessonPlanCard current={profile.currentClass} />
              <HomeworkUpload subject={profile.currentClass.subject} />
            </div>
          </Reveal>
        </Section>

        <Section>
          <InsightCards items={profile.pastWork} />
        </Section>

        {skillGraph && (
          <Section
            title="Your skill path"
            description="The nodes you have secured are lit up. The one you are working on is highlighted. Tap any node to see the detail."
          >
            <Reveal>
              <div className="relative rounded-xl border border-line bg-white p-4 shadow-soft">
                <PersonalLearningMap graph={skillGraph} />
              </div>
            </Reveal>
          </Section>
        )}

        <Section
          title="Your AI tutor"
          description={
            profile.hasTutor
              ? "Practise today's topic at your own pace. Your tutor gives hints, not answers, and leaves the big calls to your teacher."
              : "A quiet space that grows with you."
          }
        >
          <Reveal>
            {profile.hasTutor && profile.tutor ? (
              <TutorPanel tutor={profile.tutor} />
            ) : (
              <TutorLocked />
            )}
          </Reveal>

          {/* Mahira's richer Student-OS work, surfaced (not duplicated) */}
          {isMahira && (
            <Reveal>
              <div className="mt-5">
                <MahiraDeepDive />
              </div>
            </Reveal>
          )}
        </Section>
      </div>
    </AppShell>
  );
}
