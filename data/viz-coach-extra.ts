// Retention curves — skills mastered by students in coach's caseload,
// with Ebbinghaus decay estimates
export const retentionSkills = [
  { nodeId: "MATH.FRAC.MEANING.01", label: "Fraction meaning",
    daysSinceMastered: 8, decayDays: 50, atRisk: false },   // retention ≈ 85%
  { nodeId: "MATH.FRAC.EQUIV.01", label: "Equal fractions",
    daysSinceMastered: 9, decayDays: 28, atRisk: false },   // retention ≈ 72%
  { nodeId: "ENG.TENSE.SIMPLE.02", label: "Simple past tense",
    daysSinceMastered: 91, decayDays: 38, atRisk: true },   // retention ≈ 9%
  { nodeId: "SCI.LIVING.CELLS.01", label: "Cell structure",
    daysSinceMastered: 52, decayDays: 28, atRisk: true },   // retention ≈ 16%
  { nodeId: "MATH.NUM.PLACE.03", label: "Place value — lakhs",
    daysSinceMastered: 14, decayDays: 45, atRisk: false },  // retention ≈ 73%
  { nodeId: "SOC.HISTORY.MUGHAL.02", label: "Mughal empire",
    daysSinceMastered: 110, decayDays: 30, atRisk: true },  // retention ≈ 3%
];
// retention at a given day = Math.exp(-daysSinceMastered / decayDays)

// Gantt data — 10 students from the caseload with their check-in history
export const ganttStudents = [
  { studentId: "stu-riya",   name: "Riya Iyer",
    checkins: [
      { date: "2026-04-15", durationMin: 25, status: "done" as const },
      { date: "2026-05-08", durationMin: 30, status: "done" as const },
      { date: "2026-06-02", durationMin: 20, status: "done" as const },
      { date: "2026-07-10", durationMin: 0,  status: "upcoming" as const },
    ]},
  { studentId: "stu-aarav",  name: "Aarav Sharma",
    checkins: [
      { date: "2026-04-22", durationMin: 20, status: "done" as const },
      { date: "2026-05-20", durationMin: 25, status: "done" as const },
      { date: "2026-06-24", durationMin: 0,  status: "upcoming" as const },
    ]},
  { studentId: "stu-ananya", name: "Ananya Reddy",
    checkins: [
      { date: "2026-04-10", durationMin: 30, status: "done" as const },
      { date: "2026-06-18", durationMin: 28, status: "done" as const },
      // Note: gap of >4 weeks — will highlight
    ]},
  { studentId: "stu-kabir",  name: "Kabir Mehta",
    checkins: [
      { date: "2026-04-28", durationMin: 22, status: "done" as const },
      { date: "2026-05-26", durationMin: 20, status: "done" as const },
      { date: "2026-06-23", durationMin: 0,  status: "upcoming" as const },
    ]},
  { studentId: "stu-diya",   name: "Diya Patel",
    checkins: [
      { date: "2026-04-14", durationMin: 18, status: "done" as const },
      { date: "2026-05-12", durationMin: 22, status: "done" as const },
      { date: "2026-06-09", durationMin: 20, status: "done" as const },
      { date: "2026-07-07", durationMin: 0,  status: "upcoming" as const },
    ]},
  { studentId: "stu-vihaan", name: "Vihaan Nair",
    checkins: [
      { date: "2026-05-05", durationMin: 25, status: "done" as const },
      // large gap — no check-in before this
    ]},
  { studentId: "stu-saanvi", name: "Saanvi Gupta",
    checkins: [
      { date: "2026-04-18", durationMin: 20, status: "done" as const },
      { date: "2026-05-16", durationMin: 25, status: "done" as const },
      { date: "2026-06-13", durationMin: 22, status: "done" as const },
    ]},
  { studentId: "stu-ishaan", name: "Ishaan Banerjee",
    checkins: [
      { date: "2026-04-25", durationMin: 30, status: "done" as const },
      { date: "2026-06-20", durationMin: 0,  status: "upcoming" as const },
      // gap — 8 weeks
    ]},
  { studentId: "stu-myra",   name: "Myra Kapoor",
    checkins: [
      { date: "2026-04-11", durationMin: 20, status: "done" as const },
      { date: "2026-05-09", durationMin: 22, status: "done" as const },
      { date: "2026-06-06", durationMin: 20, status: "done" as const },
      { date: "2026-07-04", durationMin: 0,  status: "upcoming" as const },
    ]},
  { studentId: "stu-advait", name: "Advait Deshpande",
    checkins: [
      { date: "2026-04-20", durationMin: 28, status: "done" as const },
      { date: "2026-05-18", durationMin: 25, status: "done" as const },
      { date: "2026-06-15", durationMin: 0,  status: "upcoming" as const },
    ]},
];
