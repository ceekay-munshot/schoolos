// Gap treemap: nested structure, school → grades → strands → nodes
// gapCount = number of students who have a gap at this skill
export type TreeNode = {
  id: string;
  label: string;
  gapCount: number;
  children?: TreeNode[];
};

export const gapTreemapRoot: TreeNode = {
  id: "school", label: "Tomo School", gapCount: 847,
  children: [
    { id: "c3", label: "Class 3", gapCount: 82, children: [
      { id: "c3-maths",   label: "Maths",   gapCount: 41, children: [
        { id: "c3-number",   label: "Number",        gapCount: 24 },
        { id: "c3-geom",     label: "Geometry",      gapCount: 17 },
      ]},
      { id: "c3-english", label: "English", gapCount: 28, children: [
        { id: "c3-reading",  label: "Reading",       gapCount: 14 },
        { id: "c3-writing",  label: "Writing",       gapCount: 14 },
      ]},
      { id: "c3-science", label: "Science", gapCount: 13 },
    ]},
    { id: "c4", label: "Class 4", gapCount: 98, children: [
      { id: "c4-maths",   label: "Maths",   gapCount: 52, children: [
        { id: "c4-frac",     label: "Fractions",     gapCount: 31 },
        { id: "c4-geom",     label: "Geometry",      gapCount: 21 },
      ]},
      { id: "c4-english", label: "English", gapCount: 31 },
      { id: "c4-science", label: "Science", gapCount: 15 },
    ]},
    { id: "c5", label: "Class 5", gapCount: 124, children: [
      { id: "c5-maths",   label: "Maths",   gapCount: 68, children: [
        { id: "c5-frac",     label: "Fractions",     gapCount: 45 },
        { id: "c5-geom",     label: "Geometry",      gapCount: 23 },
      ]},
      { id: "c5-english", label: "English", gapCount: 38 },
      { id: "c5-science", label: "Science", gapCount: 18 },
    ]},
    { id: "c6", label: "Class 6", gapCount: 115 },
    { id: "c7", label: "Class 7", gapCount: 108 },
    { id: "c8", label: "Class 8", gapCount: 134 },
    { id: "c9", label: "Class 9", gapCount: 96 },
    { id: "c10", label: "Class 10", gapCount: 90 },
  ]
};

// Mastery flow bands: state counts at term-start vs now, and student flow between states
export const masteryFlowData = {
  states: ["Not yet taught", "Introduced", "Practising", "Mastered", "Gap"],
  stateColors: ["#B8B4AB", "#8B88C4", "#C99A3F", "#5E7C6A", "#B25B43"],
  termStart: [5600, 3300, 2900, 2800, 400],
  termNow:   [900, 2700, 4700, 5700, 1000],
  // flows[i] = from termStart state i, to termNow state j, n students
  flows: [
    { from: 0, to: 0, n: 900  },  // stayed not-taught
    { from: 0, to: 1, n: 3100 },  // introduced
    { from: 0, to: 2, n: 1500 },  // jumped to practising
    { from: 0, to: 3, n: 100  },  // rare — straight to mastered
    { from: 1, to: 1, n: 900  },  // stayed introduced
    { from: 1, to: 2, n: 2000 },  // moved to practising
    { from: 1, to: 3, n: 180  },  // moved to mastered
    { from: 1, to: 4, n: 220  },  // fell to gap
    { from: 2, to: 2, n: 300  },  // stayed practising
    { from: 2, to: 3, n: 2220 },  // mastered
    { from: 2, to: 4, n: 380  },  // fell to gap
    { from: 3, to: 3, n: 2700 },  // stayed mastered
    { from: 3, to: 4, n: 100  },  // faded
    { from: 4, to: 4, n: 400  },  // gap unchanged
  ]
};

// Attendance × Velocity matrix: 25 cells (ab 1–5 × vb 1–5)
// ab = attendance band (1=lowest, 5=highest); vb = velocity band (1=slowest, 5=fastest)
export const attendanceMatrixData: { ab: number; vb: number; count: number }[] = [
  // Low attendance (ab=1)
  { ab: 1, vb: 1, count: 48  }, { ab: 1, vb: 2, count: 31  }, { ab: 1, vb: 3, count: 19 }, { ab: 1, vb: 4, count: 8  }, { ab: 1, vb: 5, count: 4  },
  // ab=2
  { ab: 2, vb: 1, count: 210 }, { ab: 2, vb: 2, count: 340 }, { ab: 2, vb: 3, count: 180}, { ab: 2, vb: 4, count: 62 }, { ab: 2, vb: 5, count: 18 },
  // ab=3
  { ab: 3, vb: 1, count: 280 }, { ab: 3, vb: 2, count: 1100}, { ab: 3, vb: 3, count: 2800}, { ab: 3, vb: 4, count: 920}, { ab: 3, vb: 5, count: 200},
  // ab=4
  { ab: 4, vb: 1, count: 85  }, { ab: 4, vb: 2, count: 420 }, { ab: 4, vb: 3, count: 1800}, { ab: 4, vb: 4, count: 2100}, { ab: 4, vb: 5, count: 480},
  // High attendance (ab=5)
  { ab: 5, vb: 1, count: 22  }, { ab: 5, vb: 2, count: 89  }, { ab: 5, vb: 3, count: 310}, { ab: 5, vb: 4, count: 680 }, { ab: 5, vb: 5, count: 290},
];
