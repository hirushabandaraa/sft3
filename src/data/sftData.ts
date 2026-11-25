export type RecordingCategory = 'theory' | 'revision' | 'papers' | 'moments';

export interface ChapterMarker {
  time: string;
  seconds: number;
  title: string;
}

export interface RecordingItem {
  id: string;
  category: RecordingCategory;
  badgeLabel: string;
  badgeTone: 'secondary' | 'primary' | 'success';
  title: string;
  description: string;
  duration: string;
  durationSeconds: number;
  imageUrl?: string;
  imageAlt?: string;
  isShort?: boolean;
  unitNumber: string;
  keyEquations: string[];
  tuteSummary: string[];
  chapters: ChapterMarker[];
}

export interface CohortDataPoint {
  label: string;
  shortLabel: string;
  score: number;
}

export interface CohortDataset {
  id: string;
  name: string;
  subtitle: string;
  gainLabel: string;
  sampleSize: number;
  points: CohortDataPoint[];
}

export interface SyllabusUnit {
  number: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  lessonsCount: number;
}

export interface ReviewItem {
  id: string;
  name: string;
  school: string;
  district: string;
  grade: string;
  quote: string;
}

export interface TimetableRow {
  id: string;
  stream: string;
  batchValue: string;
  day: string;
  time: string;
  format: string;
  formatTone: 'secondary' | 'primary' | 'success';
  venue: string;
  nextTopic: string;
}

export const TUTOR_PORTRAIT_URL =
  'https://lh3.googleusercontent.com/aida/ALJJyrAQdEvEntQxuxCMbhEIUK_SWiVKftjRpoQ--cXGWnyvXSmNsx5a9PJvo-baagjBKLwOIwG_mZwaSmLXteIwN1kuHDxra9X2lKSfdd0PypxX7ivVErPkzDbk1t9uhWxzSM1MVics8l_uqOLZFcEua1ugu9bY6insHQkFukzLjw7Fa5QjTZQmNBN_m62ELBWnuP08-B8-47V9OFnJJCAmmc90WLvb_Z1rOU8fi3Ax_TmzAQ51GWbjFwj7j9Q';

export const RECORDINGS: RecordingItem[] = [
  {
    id: 'unit-03-mechanics',
    category: 'theory',
    badgeLabel: '2026 Theory',
    badgeTone: 'secondary',
    title: 'Unit 03: Mechanics & Rotational Motion',
    description:
      'Torque, angular momentum, and equilibrium applications with worked SFT examples.',
    duration: '54:20',
    durationSeconds: 3260,
    imageUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrCDCM12GLy9YIXg7YoBdpsv-l5gtHRZP6IbAOzraMQj7ywvwnPchL8aB9HBq5fy5OKgKMHSoR7egcWKUkYkjMKVsNtWJKWdmJLWPPpT72ICYjFmFF1YaUhCPqL91z3mJtcDz208-KZZCXselCBhJrzF1EDT3fOHn2zqMLWch2oWHoT02OpdWnwT6IIY0UGV0SqFQBphWNR2t9cfUOPOw09HBzk5ECgFpUWTdSwnVSBA6HmvQ8gSt4ndyxw',
    imageAlt: 'Unit 03 Mechanics and Rotational Motion preview',
    unitNumber: 'Unit 03',
    keyEquations: [
      'τ = F × r sin(θ)  [Torque in N·m]',
      'L = Iω  [Angular Momentum Conservation]',
      'ΣF = 0 and Στ = 0  [Static Equilibrium]',
    ],
    tuteSummary: [
      'Free-body diagram method for coupled pulley and beam structures',
      'Moment of inertia calculations for uniform rods, discs, and rings',
      '2019 & 2023 A/L SFT Paper II structured calculation walkthrough',
    ],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Rotational Kinematics & Radian Measure' },
      { time: '14:40', seconds: 880, title: 'Torque, Couples & Lever Arm Analysis' },
      { time: '31:15', seconds: 1875, title: 'Equilibrium of Rigid Bodies (Worked Examples)' },
      { time: '44:10', seconds: 2650, title: 'Past Paper Part B Essay Breakdown' },
    ],
  },
  {
    id: 'unit-05-thermodynamics',
    category: 'revision',
    badgeLabel: '2026 Revision',
    badgeTone: 'primary',
    title: 'Unit 05: Thermodynamics & Heat Engines',
    description:
      'Rapid-fire formulas for specific heat capacity, calorimetry, and thermal efficiency.',
    duration: '48:15',
    durationSeconds: 2895,
    imageUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrDj-yLUbaXp1CZXSo4AzMTmn4X_u80abt9oZsJUpTJWIqksqlctuEOG6aIS0yuy5VQF5JLidGJ1aXJpCaEWlWPkwyKyoWsCppGpWI2TyDUFmp8bV_w6erK8fVnFh00ADRPKrQ0T4idPc4__okLMrRU3Q_u5mIYFqTOnNGMJR_rjS6g-kMf6Lmn_XGX2UVIVe7mRye4c_CPiDAJsyDf0XEwjdMTRJ2TkU0pHTkpXRTKrgBB0zv_vjyd5Lh5mXLfk',
    imageAlt: 'Thermodynamics and Heat Transfer preview',
    unitNumber: 'Unit 05',
    keyEquations: [
      'Q = mcΔθ + mL  [Calorimetry & Latent Heat]',
      'ΔU = Q − W  [First Law of Thermodynamics]',
      'η = 1 − (Tc / Th)  [Carnot Engine Efficiency]',
    ],
    tuteSummary: [
      'Method of mixtures with calorimeter heat capacity corrections',
      'PV-diagram work done in isothermal vs adiabatic expansion',
      'Practical heat-loss compensation graphs for SFT Paper I & II',
    ],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Specific Heat Capacity & Latent Heat Review' },
      { time: '15:30', seconds: 930, title: 'Mixture Calorimetry Problem Solving' },
      { time: '29:45', seconds: 1785, title: 'Heat Conduction & Thermal Conductivity' },
      { time: '39:20', seconds: 2360, title: 'Carnot Cycle & Efficiency Shortcuts' },
    ],
  },
  {
    id: 'paper-2024-essay',
    category: 'papers',
    badgeLabel: 'Paper Class',
    badgeTone: 'success',
    title: '2024 A/L SFT Paper II: Structured Essay',
    description:
      'Full marking-scheme breakdown showing how to secure full marks on Part B questions.',
    duration: '01:12:40',
    durationSeconds: 4360,
    imageUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrA1CJzrh8IOCF20lKihHcECXu-TuMCQLEh6JbgI2cqy0b0eAGAkGrKiWJ36hr2EkTb7Qqydi8l_NhXtyFKHt0GC7vbqnwDx6lijzEoq22NiKOK9bT1WzV9XTk3NkFs1pfClaiKcJMEtxGZXPgQH0QJ9EnyyHfoeqh6ljyYN_SLzLUI-sfYbiqrwHIVja69o-8NIBxgzW6ZwKXkBiSWzkN3nZuyUYEO7ArpQVOYruN9ENIsoYi1miC5_ySCesw',
    imageAlt: '2024 A/L SFT Past Paper Discussion preview',
    unitNumber: 'Paper II',
    keyEquations: [
      'Part A: 4 Structured Questions (400 marks scaled)',
      'Part B: 4 Essay Questions chosen from 6 (600 marks)',
      'SI Units & Significant Figures Marking Rule',
    ],
    tuteSummary: [
      'Line-by-line Department of Examinations marking scheme alignment',
      'Common deduction traps in circuit diagrams and titration steps',
      'Time allocation blueprint: 18 mins per Part A question',
    ],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Paper II Structure & Time Strategy' },
      { time: '16:10', seconds: 970, title: 'Part A Q1–Q4 Marking Rubric Points' },
      { time: '41:00', seconds: 2460, title: 'Part B Mechanics & Electricity Essay' },
      { time: '58:25', seconds: 3505, title: 'Part B Industrial Chemistry Essay' },
    ],
  },
  {
    id: 'unit-08-electronics',
    category: 'theory',
    badgeLabel: '2027 Theory',
    badgeTone: 'secondary',
    title: 'Unit 08: Applied Electronics & Logic Gates',
    description:
      'Semiconductor diodes, rectifier circuits, and truth-table simplification techniques.',
    duration: '44:50',
    durationSeconds: 2690,
    imageUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrCx5NedobxEaB8NpL8PoSEBMZqVJNNqrMJW2YTCoNUWdvTabax7Jc3OQ9_Snj5froeP2mwE0SQ6VVGUaTCDyTDEHS93rC6Fd6cgRlYZh6rD2j73bJ3dy6fFsmR4XsHKUErSaSPuG7REXnkecDquPLbM5_pzG2l8uGamkpTONdemqNb11sxXmoICDDwoNLVXbeOaYUgUlqa-TcJBgWw2YTmmXvxho_Giu2eT3zVCpFsz8Hlq0h3D2CslVPAcyQ',
    imageAlt: 'Basic Electronics and Logic Gates preview',
    unitNumber: 'Unit 08',
    keyEquations: [
      'V_out = V_peak − 0.7V  [Silicon Diode Forward Drop]',
      'A · (A + B) = A  [Boolean Absorption Law]',
      '!(A · B) = !A + !B  [De Morgan Theorem]',
    ],
    tuteSummary: [
      'Half-wave vs full-wave bridge rectifier output waveforms with smoothing capacitor',
      'Zener diode voltage regulator load calculations',
      'NAND-only universal gate synthesis for control circuits',
    ],
    chapters: [
      { time: '00:00', seconds: 0, title: 'PN Junction & I-V Characteristic Curve' },
      { time: '12:20', seconds: 740, title: 'Bridge Rectifier & Ripple Smoothing' },
      { time: '25:50', seconds: 1550, title: 'Combinational Logic & Truth Tables' },
      { time: '36:15', seconds: 2175, title: 'Real Technology Control Circuit Case' },
    ],
  },
  {
    id: 'unit-06-optics',
    category: 'revision',
    badgeLabel: '2027 Revision',
    badgeTone: 'primary',
    title: 'Unit 06: Waves, Sound & Optical Instruments',
    description:
      "Snell's law, lens combinations, and practical ray-diagram accuracy drills.",
    duration: '39:10',
    durationSeconds: 2350,
    imageUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrAN7Svl_0kM2-WTJXPGaM94QagXg4xY-BhHC4Ec0e36aBAqLxymtH7oKhi7r3bMWG8TrONU2JsyB9rpP43R_n2EWrT3keKp2arogRqicSlxySIgpUnOd6OSkuZS7tjyOK7iBff7NnyoRbBEWaGT5qt9eUdMm8mC6X-VBMp__5L-IADMLE8-Xdi_xG0mmvgKyhx4yRdwIs5bYMVoZp9Kog7dqBS0nererNd9oDRtIqW5XKL-l7ShSw',
    imageAlt: 'Waves and Geometric Optics preview',
    unitNumber: 'Unit 06',
    keyEquations: [
      'n₁ sin(i) = n₂ sin(r)  [Snell’s Law of Refraction]',
      '1/v − 1/u = 1/f  [Sign Convention Lens Formula]',
      'M = f_o / f_e  [Astronomical Telescope Magnification]',
    ],
    tuteSummary: [
      'Total internal reflection critical angle calculations in optical fibers',
      'New Cartesian sign convention checklist to eliminate sign mistakes',
      'Compound microscope ray diagram step-by-step drawing guide',
    ],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Wave Equation & Standing Waves in Pipes' },
      { time: '11:40', seconds: 700, title: 'Refraction, Prism & Critical Angle' },
      { time: '24:05', seconds: 1445, title: 'Thin Lens Formula & Power (Diopters)' },
      { time: '32:30', seconds: 1950, title: 'Optical Instruments Ray Diagrams' },
    ],
  },
  {
    id: 'mcq-materials-alloys',
    category: 'papers',
    badgeLabel: 'Paper Class',
    badgeTone: 'success',
    title: 'MCQ Speed Drill: Industrial Materials & Alloys',
    description:
      '50 timed Paper I questions with elimination shortcuts for polymer & metal properties.',
    duration: '51:05',
    durationSeconds: 3065,
    imageUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrB8DyfYblepMpjJ3NhDtn4ewA7f2w16SRKnRyZUJFRbDFh7yEgadyb2ScKgNeq2xkO1e9Hz0PxZ9BxuPGujsXZ0ZJQm6v_Fz-3_mcX0mw3dgDItMIH3mAeu-Txo3jZFrKjJkpB2q1le-D_5OeYTVCWoLnLgTnHBCIPAzg3nRxR8Yoy-P5vOA_2WyNwIp9S47IAS_m25I_2vhtTTjq918ZaCRHJNy2ZfmBq7Rq9gCvRo9wmlMkIGkq1tI2U',
    imageAlt: 'Industrial Materials and Polymers MCQ Sprint preview',
    unitNumber: 'Unit 10 & 11',
    keyEquations: [
      'σ = F / A  [Tensile Stress in Pa]',
      'ε = ΔL / L  [Tensile Strain (dimensionless)]',
      'E = σ / ε  [Young’s Modulus]',
    ],
    tuteSummary: [
      'Thermoplastics vs thermosetting polymers comparison matrix',
      'Ferrous & non-ferrous alloy compositions (Brass, Bronze, Duralumin, Steel)',
      '45-second elimination workflow for multi-statement Paper I MCQs',
    ],
    chapters: [
      { time: '00:00', seconds: 0, title: 'MCQ Elimination Framework (Q1–Q15)' },
      { time: '15:10', seconds: 910, title: 'Stress-Strain Curves & Ductility (Q16–Q30)' },
      { time: '31:40', seconds: 1900, title: 'Polymers, Ceramics & Composites (Q31–Q42)' },
      { time: '43:20', seconds: 2600, title: 'Corrosion & Electroplating Rapid Fire (Q43–Q50)' },
    ],
  },
  {
    id: 'moment-short-01',
    category: 'moments',
    badgeLabel: 'Classroom Short',
    badgeTone: 'secondary',
    title: 'Live SFT Class Highlight — Part 01',
    description: 'Inside our physical & online A/L SFT session with Hirusha Bandara.',
    duration: '00:24',
    durationSeconds: 24,
    isShort: true,
    imageUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrCDCM12GLy9YIXg7YoBdpsv-l5gtHRZP6IbAOzraMQj7ywvwnPchL8aB9HBq5fy5OKgKMHSoR7egcWKUkYkjMKVsNtWJKWdmJLWPPpT72ICYjFmFF1YaUhCPqL91z3mJtcDz208-KZZCXselCBhJrzF1EDT3fOHn2zqMLWch2oWHoT02OpdWnwT6IIY0UGV0SqFQBphWNR2t9cfUOPOw09HBzk5ECgFpUWTdSwnVSBA6HmvQ8gSt4ndyxw',
    unitNumber: 'Classroom Clip',
    keyEquations: ['Live Board Demonstration: Torque & Equilibrium'],
    tuteSummary: [
      'Real-time student Q&A from Saturday Colombo Physical + Zoom Hybrid hall',
      'Visual whiteboard breakdown of force resolution angles',
    ],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Opening Concept Check' },
      { time: '00:12', seconds: 12, title: 'Whiteboard Force Resolution' },
    ],
  },
  {
    id: 'moment-short-02',
    category: 'moments',
    badgeLabel: 'Classroom Short',
    badgeTone: 'secondary',
    title: 'Live SFT Class Highlight — Part 02',
    description: 'Key moments and practical concept breakdown in class.',
    duration: '00:20',
    durationSeconds: 20,
    isShort: true,
    imageUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrCx5NedobxEaB8NpL8PoSEBMZqVJNNqrMJW2YTCoNUWdvTabax7Jc3OQ9_Snj5froeP2mwE0SQ6VVGUaTCDyTDEHS93rC6Fd6cgRlYZh6rD2j73bJ3dy6fFsmR4XsHKUErSaSPuG7REXnkecDquPLbM5_pzG2l8uGamkpTONdemqNb11sxXmoICDDwoNLVXbeOaYUgUlqa-TcJBgWw2YTmmXvxho_Giu2eT3zVCpFsz8Hlq0h3D2CslVPAcyQ',
    unitNumber: 'Classroom Clip',
    keyEquations: ['Practical Circuit Inspection: Bridge Rectifier'],
    tuteSummary: [
      'Hands-on oscilloscope waveform check during Applied Electronics session',
      'Common exam mistakes highlighted live for 2026 & 2027 students',
    ],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Circuit Bench Setup' },
      { time: '00:10', seconds: 10, title: 'Waveform Verification' },
    ],
  },
];

export const COHORT_DATASETS: CohortDataset[] = [
  {
    id: '2026-theory',
    name: '2026 Theory Cohort',
    subtitle: 'Cohort progression from Grade 12 Term 1 through Final A/L Mock Exam (n = 420 students)',
    gainLabel: '+37% Avg Gain',
    sampleSize: 420,
    points: [
      { label: 'Term 01', shortLabel: 'Term 01', score: 44 },
      { label: 'Term 02', shortLabel: 'Term 02', score: 56 },
      { label: 'Term 03', shortLabel: 'Term 03', score: 68 },
      { label: 'Term 04', shortLabel: 'Term 04', score: 76 },
      { label: 'Final Mock', shortLabel: 'Final Mock', score: 81 },
    ],
  },
  {
    id: '2026-revision',
    name: '2026 Revision + Paper',
    subtitle: 'Intensive MCQ & Structured Essay score lift across 5 timed evaluations (n = 310 students)',
    gainLabel: '+34% Avg Gain',
    sampleSize: 310,
    points: [
      { label: 'Diagnostic', shortLabel: 'Term 01', score: 49 },
      { label: 'Cycle 02', shortLabel: 'Term 02', score: 60 },
      { label: 'Cycle 03', shortLabel: 'Term 03', score: 71 },
      { label: 'Cycle 04', shortLabel: 'Term 04', score: 78 },
      { label: 'Final Mock', shortLabel: 'Final Mock', score: 83 },
    ],
  },
  {
    id: '2025-top-cohort',
    name: '2025 Island Results Cohort',
    subtitle: 'Verified progression of 2025 A/L Technology stream students achieving A/B grades (n = 385 students)',
    gainLabel: '+39% Avg Gain',
    sampleSize: 385,
    points: [
      { label: 'Term 01', shortLabel: 'Term 01', score: 45 },
      { label: 'Term 02', shortLabel: 'Term 02', score: 58 },
      { label: 'Term 03', shortLabel: 'Term 03', score: 70 },
      { label: 'Term 04', shortLabel: 'Term 04', score: 79 },
      { label: 'Final Mock', shortLabel: 'Final Mock', score: 84 },
    ],
  },
];

export const SYLLABUS_UNITS: SyllabusUnit[] = [
  { number: '01', title: 'Basic Concepts of Science & Measurement', status: 'Completed', lessonsCount: 6 },
  { number: '02', title: 'Kinematics, Force & Linear Motion', status: 'Completed', lessonsCount: 8 },
  { number: '03', title: 'Mechanics, Work, Energy & Rotational Motion', status: 'Completed', lessonsCount: 9 },
  { number: '04', title: 'Properties of Matter & Fluid Mechanics', status: 'Completed', lessonsCount: 7 },
  { number: '05', title: 'Thermodynamics & Heat Transfer', status: 'Completed', lessonsCount: 8 },
  { number: '06', title: 'Waves, Sound & Optical Instruments', status: 'Completed', lessonsCount: 7 },
  { number: '07', title: 'Electrostatics, Current Electricity & Magnetism', status: 'Completed', lessonsCount: 9 },
  { number: '08', title: 'Applied Electronics & Digital Logic Gates', status: 'Completed', lessonsCount: 6 },
  { number: '09', title: 'Chemical Bonding, Stoichiometry & Acids/Bases', status: 'Completed', lessonsCount: 8 },
  { number: '10', title: 'Industrial Materials, Polymers & Alloys', status: 'Completed', lessonsCount: 6 },
  { number: '11', title: 'Electrochemistry, Corrosion & Environmental SFT', status: 'In Progress', lessonsCount: 5 },
  { number: '12', title: 'Biotechnology Principles & Industrial Processes', status: 'Upcoming', lessonsCount: 5 },
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'nethmi',
    name: 'Nethmi Jayawardena',
    school: 'Visakha Vidyalaya',
    district: 'Colombo District',
    grade: 'A Grade - SFT',
    quote:
      "I struggled with Mechanics and Electronics until joining Hirusha Sir's revision class. His visual diagrams and timed past paper drills helped me jump from 48% to an A.",
  },
  {
    id: 'tharindu',
    name: 'Tharindu Wickramasinghe',
    school: 'Dharmaraja College',
    district: 'Kandy District',
    grade: 'A Grade - SFT',
    quote:
      'The online recordings library saved me hours every week. Being able to pause, replay derivations, and check weekly assessment feedback kept me consistent all the way to the exam.',
  },
  {
    id: 'kasun',
    name: 'Kasun Rajapaksha',
    school: 'Richmond College',
    district: 'Galle District',
    grade: 'A Grade - SFT',
    quote:
      'Sir explains practical units and structured essay marking schemes so clearly. I entered the A/L hall feeling completely prepared for every calculation and graph question.',
  },
];

export const TIMETABLE: TimetableRow[] = [
  {
    id: '2026-theory',
    stream: '2026 Theory',
    batchValue: '2026 A/L Theory',
    day: 'Saturday',
    time: '08:00 AM – 12:30 PM',
    format: 'Hybrid',
    formatTone: 'secondary',
    venue: 'Nugegoda Apex Hall + Live Zoom',
    nextTopic: 'Unit 11: Electrochemistry & Industrial Cells',
  },
  {
    id: '2027-theory',
    stream: '2027 Theory',
    batchValue: '2027 A/L Theory',
    day: 'Sunday',
    time: '08:30 AM – 01:00 PM',
    format: 'Hybrid',
    formatTone: 'secondary',
    venue: 'Kandy Synergy Institute + Live Zoom',
    nextTopic: 'Unit 04: Fluid Pressure & Bernoulli Applications',
  },
  {
    id: '2026-revision',
    stream: '2026 Revision',
    batchValue: '2026 A/L Revision + Paper',
    day: 'Wednesday',
    time: '06:30 PM – 09:30 PM',
    format: 'Live Zoom',
    formatTone: 'primary',
    venue: 'Island-wide HD Zoom Webinar',
    nextTopic: 'Thermodynamics & Optics Rapid Formula Drill',
  },
  {
    id: 'paper-class',
    stream: 'Paper Class',
    batchValue: '2026 A/L Revision + Paper',
    day: 'Friday',
    time: '04:00 PM – 07:30 PM',
    format: 'Island-wide',
    formatTone: 'success',
    venue: 'Online Timed Portal + Physical Centres',
    nextTopic: 'Full Model Paper 14 (Part I + II Timed)',
  },
];
