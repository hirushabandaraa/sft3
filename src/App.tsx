import { FormEvent, useMemo, useRef, useState } from 'react';
import { ChannelModal, CommunityChannelType } from './components/ChannelModal';
import { RecordingModal } from './components/RecordingModal';
import { ResilientImage } from './components/ResilientImage';
import { RegisteredStudent, StudentPortalModal } from './components/StudentPortalModal';
import { SyllabusModal } from './components/SyllabusModal';
import {
  COHORT_DATASETS,
  RECORDINGS,
  REVIEWS,
  RecordingCategory,
  RecordingItem,
  TIMETABLE,
  TUTOR_PORTRAIT_URL,
} from './data/sftData';

type FilterTab = 'all' | RecordingCategory;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'theory', label: 'Theory' },
  { id: 'revision', label: 'Revision' },
  { id: 'papers', label: 'Past Papers' },
  { id: 'moments', label: 'Moments of our classroom' },
];

const BAR_FILLS = ['#DAE2FD', '#B4C5FF', '#06B6D4', '#2563EB', '#004AC6'];
const BAR_X = [86, 206, 326, 446, 546];

function badgeToneClass(tone: 'secondary' | 'primary' | 'success'): string {
  if (tone === 'success') {
    return 'bg-success-container text-on-success-container';
  }
  if (tone === 'primary') {
    return 'bg-light-surface-container text-light-primary';
  }
  return 'bg-light-secondary-container text-light-on-secondary-container';
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [selectedRecording, setSelectedRecording] = useState<RecordingItem | null>(null);
  const [portalOpen, setPortalOpen] = useState(false);
  const [syllabusOpen, setSyllabusOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState<CommunityChannelType>(null);

  // Analytics interactive state
  const [selectedCohortId, setSelectedCohortId] = useState<string>(COHORT_DATASETS[0].id);
  const [hoveredTermIdx, setHoveredTermIdx] = useState<number | null>(null);

  // Registration & Timetable interactive state
  const [selectedRowId, setSelectedRowId] = useState<string>(TIMETABLE[0].id);
  const [regName, setRegName] = useState('');
  const [regBatch, setRegBatch] = useState('2026 A/L Theory');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);
  const [registeredStudent, setRegisteredStudent] = useState<RegisteredStudent | null>(() => {
    try {
      const saved = window.localStorage.getItem('sft_registered_student');
      return saved ? (JSON.parse(saved) as RegisteredStudent) : null;
    } catch {
      return null;
    }
  });

  const nameInputRef = useRef<HTMLInputElement>(null);

  const visibleRecordings = useMemo(() => {
    if (activeFilter === 'all') {
      return RECORDINGS.filter((item) => item.category !== 'moments');
    }
    return RECORDINGS.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  const activeCohort = useMemo(
    () => COHORT_DATASETS.find((c) => c.id === selectedCohortId) || COHORT_DATASETS[0],
    [selectedCohortId]
  );

  // Convert percentage (0..90%) into SVG Y coordinate (200 down to 50)
  const chartGeometry = useMemo(() => {
    return activeCohort.points.map((pt, idx) => {
      const clamped = Math.max(0, Math.min(95, pt.score));
      const height = Math.round((clamped / 90) * 150);
      const y = 200 - height;
      const x = BAR_X[idx];
      const cx = x + 28;
      return { ...pt, x, y, height, cx };
    });
  }, [activeCohort]);

  const trendPolyline = useMemo(
    () => chartGeometry.map((pt) => `${pt.cx},${pt.y}`).join(' '),
    [chartGeometry]
  );

  const handleSelectTimetableRow = (rowId: string, batchValue: string) => {
    setSelectedRowId(rowId);
    setRegBatch(batchValue);
    setRegSuccess(false);
    setRegError(null);
  };

  const handleJumpToEnroll = () => {
    const el = document.getElementById('enroll');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(() => nameInputRef.current?.focus(), 350);
    }
  };

  const handleRegistrationSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = regName.trim();
    const digitsOnly = regWhatsapp.replace(/\D/g, '');

    if (trimmedName.length < 2) {
      setRegError('Please enter your full name.');
      setRegSuccess(false);
      return;
    }

    if (digitsOnly.length < 9 || digitsOnly.length > 13) {
      setRegError('Enter a valid Sri Lankan WhatsApp number (e.g. 077 123 4567).');
      setRegSuccess(false);
      return;
    }

    const newStudent: RegisteredStudent = {
      name: trimmedName,
      batch: regBatch,
      whatsapp: regWhatsapp.trim(),
      studentId: `SFT-${regBatch.startsWith('2027') ? '2027' : '2026'}-${digitsOnly.slice(-4)}`,
    };

    setRegisteredStudent(newStudent);
    try {
      window.localStorage.setItem('sft_registered_student', JSON.stringify(newStudent));
    } catch {
      // Ignore storage errors
    }

    setRegError(null);
    setRegSuccess(true);
  };

  return (
    <div className="bg-light-surface text-light-on-surface font-body antialiased min-h-screen flex flex-col">
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-light-surface-bright/95 backdrop-blur-xs border-b border-light-outline-variant/60">
        <div className="max-w-7xl mx-auto px-page-margin lg:px-12 h-20 flex items-center justify-between gap-8">
          {/* Brand Logo */}
          <a
            href="#home"
            className="flex items-center gap-gutter-sm group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary rounded-md shrink-0"
          >
            <span className="w-10 h-10 rounded-md bg-light-primary-container text-light-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-headline-md" aria-hidden="true">
                science
              </span>
            </span>
            <span className="font-headline text-title-lg text-light-on-surface tracking-tight whitespace-nowrap shrink-0">
              Hirusha Bandara <span className="text-light-outline">|</span>{' '}
              <span className="text-electric-blue">A/L SFT</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-gutter-xl">
            <a
              href="#home"
              className="font-label text-label-lg text-light-on-surface hover:text-electric-blue transition-colors duration-state-change whitespace-nowrap shrink-0"
            >
              Home
            </a>
            <a
              href="#recordings"
              className="font-label text-label-lg text-light-on-surface-variant hover:text-electric-blue transition-colors duration-state-change whitespace-nowrap shrink-0"
            >
              Class Recordings
            </a>
            <a
              href="#progress"
              className="font-label text-label-lg text-light-on-surface-variant hover:text-electric-blue transition-colors duration-state-change whitespace-nowrap shrink-0"
            >
              Student Progress
            </a>
            <a
              href="#reviews"
              className="font-label text-label-lg text-light-on-surface-variant hover:text-electric-blue transition-colors duration-state-change whitespace-nowrap shrink-0"
            >
              Reviews
            </a>
            <a
              href="#contact"
              className="font-label text-label-lg text-light-on-surface-variant hover:text-electric-blue transition-colors duration-state-change whitespace-nowrap shrink-0"
            >
              Contact
            </a>
          </nav>

          {/* Primary CTA + Mobile Toggle */}
          <div className="flex items-center gap-gutter-sm shrink-0">
            <button
              type="button"
              onClick={() => setPortalOpen(true)}
              className="hidden sm:inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-2.5 rounded-md bg-light-primary-container text-light-on-primary-container font-label text-label-lg hover:bg-light-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2 transition-colors duration-state-change ease-state-change shadow-sm whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                login
              </span>
              <span className="font-label text-label-lg">
                {registeredStudent ? 'My Student Portal' : 'Student Portal Login'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md bg-light-surface-bright text-light-on-surface border border-light-outline-variant hover:bg-light-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary transition-colors duration-state-change"
            >
              <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden border-t border-light-outline-variant/60 bg-light-surface-bright px-page-margin py-gutter-md"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-gutter-sm">
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 font-label text-label-lg text-light-on-surface hover:text-electric-blue"
              >
                Home
              </a>
              <a
                href="#recordings"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 font-label text-label-lg text-light-on-surface-variant hover:text-electric-blue"
              >
                Class Recordings
              </a>
              <a
                href="#progress"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 font-label text-label-lg text-light-on-surface-variant hover:text-electric-blue"
              >
                Student Progress
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 font-label text-label-lg text-light-on-surface-variant hover:text-electric-blue"
              >
                Reviews
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 font-label text-label-lg text-light-on-surface-variant hover:text-electric-blue"
              >
                Contact
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setPortalOpen(true);
                }}
                className="mt-gutter-xs inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary-container text-light-on-primary-container font-label text-label-lg"
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                  login
                </span>
                <span>{registeredStudent ? 'My Student Portal' : 'Student Portal Login'}</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section id="home" className="pt-12 pb-section-mobile lg:pt-16 lg:pb-section overflow-hidden">
          <div className="max-w-7xl mx-auto px-page-margin lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl lg:gap-12 items-center">
              {/* Left Copy & Actions */}
              <div className="lg:col-span-7 flex flex-col gap-gutter-lg">
                <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-md bg-light-secondary-container text-light-on-secondary-container">
                  <span className="material-symbols-outlined text-title-md text-light-secondary" aria-hidden="true">
                    school
                  </span>
                  <span className="font-label text-label-md">
                    2026 &amp; 2027 A/L Technology Stream
                  </span>
                </div>

                <h1 className="font-headline text-display-lg-mobile lg:text-display-lg text-light-on-surface text-balance">
                  Master A/L Science for Technology with Clarity &amp; Confidence
                </h1>

                <p className="font-body text-body-lg text-light-on-surface-variant max-w-prose text-pretty">
                  Build deep conceptual mastery through structured theory units, step-by-step past paper discussions, and hands-on practical guidance led by Hirusha Bandara.
                </p>

                <div className="flex flex-wrap items-center gap-gutter-md pt-gutter-xs">
                  <button
                    type="button"
                    onClick={handleJumpToEnroll}
                    className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary-container text-light-on-primary-container font-label text-label-lg hover:bg-light-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2 transition-colors duration-state-change ease-state-change shadow-sm whitespace-nowrap shrink-0"
                  >
                    <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                      videocam
                    </span>
                    <span className="font-label text-label-lg">Join Next Live Class</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRecording(RECORDINGS[0])}
                    className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-surface-bright text-light-on-surface border border-light-outline-variant font-label text-label-lg hover:bg-light-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2 transition-colors duration-state-change ease-state-change whitespace-nowrap shrink-0"
                  >
                    <span
                      className="material-symbols-outlined text-title-lg text-electric-blue"
                      aria-hidden="true"
                    >
                      play_circle
                    </span>
                    <span className="font-label text-label-lg">Watch Free Sample</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-gutter-lg pt-gutter-sm text-light-on-surface-variant">
                  <div className="flex items-center gap-gutter-sm">
                    <span
                      className="material-symbols-outlined text-electric-blue text-title-lg"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <span className="font-body text-body-sm">
                      Complete Sinhala &amp; English Medium Notes
                    </span>
                  </div>
                  <div className="flex items-center gap-gutter-sm">
                    <span
                      className="material-symbols-outlined text-energetic-cyan text-title-lg"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <span className="font-body text-body-sm">
                      Weekly Term Paper Evaluations
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Framed Tutor Portrait & Floating Badges */}
              <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  {/* Framed Portrait Container */}
                  <div className="rounded-xl bg-light-surface-bright p-3 border border-light-outline-variant/60 shadow-lg">
                    <div className="rounded-lg overflow-hidden bg-light-surface-container-low aspect-[3/4]">
                      <ResilientImage
                        src={TUTOR_PORTRAIT_URL}
                        alt="Hirusha Bandara, A/L Science for Technology Specialist"
                        className="w-full h-full object-cover object-top"
                        fallbackTitle="Hirusha Bandara · A/L SFT Specialist"
                        fallbackIcon="person"
                      />
                    </div>
                  </div>

                  {/* Floating Badge Card 1: Top Left */}
                  <div className="absolute -top-4 -left-2 sm:-left-6 bg-light-surface-bright rounded-lg px-gutter-md py-3 border border-light-outline-variant/60 shadow-lg flex items-center gap-gutter-sm">
                    <span className="w-9 h-9 rounded-md bg-light-surface-container flex items-center justify-center text-electric-blue shrink-0">
                      <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                        workspace_premium
                      </span>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label text-label-lg text-light-on-surface">
                        A/L SFT Specialist
                      </span>
                      <span className="font-label text-label-md text-light-on-surface-variant">
                        B.Sc. Engineering (Hons)
                      </span>
                    </div>
                  </div>

                  {/* Floating Badge Card 2: Bottom Right */}
                  <div className="absolute -bottom-5 -right-2 sm:-right-4 bg-light-surface-bright rounded-lg px-gutter-md py-3 border border-light-outline-variant/60 shadow-lg flex items-center gap-gutter-sm">
                    <span className="w-9 h-9 rounded-md bg-light-secondary-container flex items-center justify-center text-light-on-secondary-container shrink-0">
                      <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                        public
                      </span>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label text-label-lg text-light-on-surface">
                        Island-wide Online &amp; Physical Classes
                      </span>
                      <span className="font-label text-label-md text-light-on-surface-variant">
                        Colombo · Kandy · Live Zoom
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Class Recordings Library Preview */}
        <section
          id="recordings"
          className="py-section-mobile lg:py-section bg-light-surface-bright border-y border-light-outline-variant/40"
        >
          <div className="max-w-7xl mx-auto px-page-margin lg:px-12 flex flex-col gap-gutter-xl">
            {/* Section Header + Filter Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter-lg">
              <div className="flex flex-col gap-gutter-sm max-w-2xl">
                <h2 className="font-headline text-headline-lg-mobile lg:text-headline-lg text-light-on-surface">
                  Class Recordings Library
                </h2>
                <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
                  Revisit any concept on demand with HD studio recordings, downloadable Tutes, and timestamped past paper walkthroughs.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="shrink-0">
                <div
                  role="tablist"
                  aria-label="Filter class recordings"
                  className="inline-flex flex-wrap items-center gap-gutter-xs p-1.5 rounded-md bg-light-surface-container-low border border-light-outline-variant/60"
                >
                  {FILTER_TABS.map((tab) => {
                    const isActive = activeFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveFilter(tab.id)}
                        className={`px-gutter-md py-2 rounded-sm font-label text-label-lg transition-colors duration-state-change whitespace-nowrap shrink-0 ${
                          isActive
                            ? 'bg-light-primary-container text-light-on-primary-container shadow-sm'
                            : 'text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-bright'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3-Column Recording Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-lg items-stretch">
              {visibleRecordings.map((item) => {
                if (item.isShort) {
                  return (
                    <article
                      key={item.id}
                      className="bg-light-surface rounded-lg p-gutter-md border border-light-outline-variant/60 shadow-sm flex flex-col justify-between gap-gutter-md h-full"
                    >
                      <div className="flex flex-col gap-gutter-md">
                        <div className="relative rounded-md overflow-hidden aspect-[9/16] max-h-96 mx-auto w-full bg-light-inverse-surface group">
                          <ResilientImage
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover opacity-85 group-hover:scale-[1.02] transition-transform duration-state-change"
                            fallbackTitle={item.title}
                            fallbackIcon="smart_display"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/80 via-deep-navy/20 to-transparent" />
                          <button
                            type="button"
                            onClick={() => setSelectedRecording(item)}
                            aria-label={`Play ${item.title}`}
                            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-electric-blue/95 text-white flex items-center justify-center shadow-lg hover:bg-light-primary transition-colors duration-state-change"
                          >
                            <span className="material-symbols-outlined text-[30px]" aria-hidden="true">
                              play_arrow
                            </span>
                          </button>
                          <span className="absolute top-2.5 right-2.5 inline-flex items-center px-2.5 py-1 rounded-sm bg-light-inverse-surface text-light-inverse-on-surface font-mono tabular-nums pointer-events-none">
                            <span className="font-mono text-label-md">{item.duration}</span>
                          </span>
                        </div>

                        <header className="flex flex-col gap-gutter-xs">
                          <span
                            className={`self-start inline-flex items-center px-2.5 py-1 rounded-sm font-label text-label-md ${badgeToneClass(
                              item.badgeTone
                            )}`}
                          >
                            {item.badgeLabel}
                          </span>
                          <h3 className="font-headline text-title-lg text-light-on-surface">
                            {item.title}
                          </h3>
                          <p className="font-body text-body-sm text-light-on-surface-variant">
                            {item.description}
                          </p>
                        </header>
                      </div>

                      <footer className="pt-gutter-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedRecording(item)}
                          className="w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-2.5 rounded-md bg-light-surface-container text-light-primary font-label text-label-lg hover:bg-light-surface-container-high transition-colors duration-state-change whitespace-nowrap shrink-0"
                        >
                          <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                            play_circle
                          </span>
                          <span>Watch Highlight</span>
                        </button>
                      </footer>
                    </article>
                  );
                }

                return (
                  <article
                    key={item.id}
                    className="bg-light-surface rounded-lg p-gutter-md border border-light-outline-variant/60 shadow-sm flex flex-col justify-between gap-gutter-md h-full"
                  >
                    <div className="flex flex-col gap-gutter-md">
                      <div className="relative rounded-md overflow-hidden aspect-video bg-light-surface-container-low group">
                        <ResilientImage
                          src={item.imageUrl}
                          alt={item.imageAlt || item.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-state-change"
                          fallbackTitle={item.title}
                        />
                        <span className="absolute bottom-2.5 right-2.5 inline-flex items-center px-2.5 py-1 rounded-sm bg-light-inverse-surface text-light-inverse-on-surface font-mono tabular-nums">
                          <span className="font-mono text-label-md">{item.duration}</span>
                        </span>
                      </div>
                      <header className="flex flex-col gap-gutter-xs">
                        <span
                          className={`self-start inline-flex items-center px-2.5 py-1 rounded-sm font-label text-label-md ${badgeToneClass(
                            item.badgeTone
                          )}`}
                        >
                          {item.badgeLabel}
                        </span>
                        <h3 className="font-headline text-title-lg text-light-on-surface">
                          {item.title}
                        </h3>
                        <p className="font-body text-body-sm text-light-on-surface-variant">
                          {item.description}
                        </p>
                      </header>
                    </div>
                    <footer className="pt-gutter-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedRecording(item)}
                        className="w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-2.5 rounded-md bg-light-surface-container text-light-primary font-label text-label-lg hover:bg-light-surface-container-high transition-colors duration-state-change whitespace-nowrap shrink-0"
                      >
                        <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                          play_circle
                        </span>
                        <span className="font-label text-label-lg">Watch Recording</span>
                      </button>
                    </footer>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Student Work & Performance Graphs Section */}
        <section id="progress" className="py-section-mobile lg:py-section">
          <div className="max-w-7xl mx-auto px-page-margin lg:px-12 flex flex-col gap-gutter-xl">
            <div className="flex flex-col gap-gutter-sm max-w-2xl">
              <h2 className="font-headline text-headline-lg-mobile lg:text-headline-lg text-light-on-surface">
                Measurable Student Progress &amp; Performance
              </h2>
              <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
                Every student&apos;s term test scores, weekly MCQ accuracy, and syllabus milestones are tracked continuously so nothing is left to chance before the A/L exam.
              </p>
            </div>

            {/* Summary Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg items-stretch">
              <article className="bg-light-surface-bright rounded-lg p-gutter-lg border border-light-outline-variant/60 shadow-sm flex flex-col justify-between gap-gutter-sm h-full">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label-md text-light-on-surface-variant">
                    2024–2025 Island Results
                  </span>
                  <span className="material-symbols-outlined text-success text-headline-md" aria-hidden="true">
                    verified
                  </span>
                </div>
                <p className="font-headline text-display-md-mobile lg:text-display-md text-light-on-surface tabular-nums">
                  95% Pass Rate
                </p>
                <p className="font-body text-body-sm text-light-on-surface-variant">
                  Over 68% of regular paper-class students achieved A or B grades in SFT.
                </p>
              </article>

              <article className="bg-light-surface-bright rounded-lg p-gutter-lg border border-light-outline-variant/60 shadow-sm flex flex-col justify-between gap-gutter-sm h-full">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label-md text-light-on-surface-variant">
                    Exam Practice Archive
                  </span>
                  <span
                    className="material-symbols-outlined text-electric-blue text-headline-md"
                    aria-hidden="true"
                  >
                    assignment_turned_in
                  </span>
                </div>
                <p className="font-headline text-display-md-mobile lg:text-display-md text-light-on-surface tabular-nums">
                  50+ Paper Discussions
                </p>
                <p className="font-body text-body-sm text-light-on-surface-variant">
                  Full 2015–2025 GCE A/L past papers plus provincial model papers.
                </p>
              </article>

              <article className="bg-light-surface-bright rounded-lg p-gutter-lg border border-light-outline-variant/60 shadow-sm flex flex-col justify-between gap-gutter-sm h-full">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label-md text-light-on-surface-variant">
                    Continuous Evaluation
                  </span>
                  <span
                    className="material-symbols-outlined text-energetic-cyan text-headline-md"
                    aria-hidden="true"
                  >
                    trending_up
                  </span>
                </div>
                <p className="font-headline text-display-md-mobile lg:text-display-md text-light-on-surface tabular-nums">
                  Weekly Assessment Tracking
                </p>
                <p className="font-body text-body-sm text-light-on-surface-variant">
                  Individual progress cards shared with students and parents every month.
                </p>
              </article>
            </div>

            {/* Interactive Analytics Showcase: Bar/Line Chart + Circular Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-stretch">
              {/* Left: Average Marks Improvement Across Term Tests */}
              <div className="lg:col-span-8 bg-light-surface-bright rounded-lg p-gutter-lg border border-light-outline-variant/60 shadow-sm flex flex-col justify-between gap-gutter-lg">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-sm">
                    <div>
                      <h3 className="font-headline text-headline-sm text-light-on-surface">
                        Average Marks Improvement Across Term Tests
                      </h3>
                      <p className="font-body text-body-sm text-light-on-surface-variant">
                        {activeCohort.subtitle}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-gutter-xs self-start px-3 py-1 rounded-sm bg-success-container text-on-success-container font-label text-label-md whitespace-nowrap shrink-0 tabular-nums">
                      {activeCohort.gainLabel}
                    </span>
                  </div>

                  {/* Interactive Cohort Switcher */}
                  <div
                    role="tablist"
                    aria-label="Select student cohort dataset"
                    className="inline-flex flex-wrap items-center gap-1 p-1 rounded-md bg-light-surface-container-low border border-light-outline-variant/60 self-start"
                  >
                    {COHORT_DATASETS.map((dataset) => {
                      const active = dataset.id === activeCohort.id;
                      return (
                        <button
                          key={dataset.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setSelectedCohortId(dataset.id)}
                          className={`px-3 py-1.5 rounded-sm font-label text-label-md transition-colors duration-state-change whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-light-surface-bright text-light-primary shadow-sm'
                              : 'text-light-on-surface-variant hover:text-light-on-surface'
                          }`}
                        >
                          {dataset.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clean SVG Bar + Trend Line Chart */}
                <div className="w-full pt-gutter-sm">
                  <svg
                    viewBox="0 0 640 240"
                    className="w-full h-auto"
                    role="img"
                    aria-label={`Bar and trend chart showing average SFT marks rising from ${activeCohort.points[0].score}% to ${activeCohort.points[4].score}%`}
                  >
                    {/* Horizontal Grid Lines */}
                    <line x1="48" y1="200" x2="616" y2="200" stroke="#CBD5E1" strokeWidth="1" />
                    <line
                      x1="48"
                      y1="150"
                      x2="616"
                      y2="150"
                      stroke="#E2E8F0"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1="48"
                      y1="100"
                      x2="616"
                      y2="100"
                      stroke="#E2E8F0"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1="48"
                      y1="50"
                      x2="616"
                      y2="50"
                      stroke="#E2E8F0"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />

                    {/* Y-Axis Labels */}
                    <text
                      x="36"
                      y="204"
                      textAnchor="end"
                      fill="#64748B"
                      fontFamily="Spline Sans Mono, monospace"
                      fontSize="11"
                    >
                      0%
                    </text>
                    <text
                      x="36"
                      y="154"
                      textAnchor="end"
                      fill="#64748B"
                      fontFamily="Spline Sans Mono, monospace"
                      fontSize="11"
                    >
                      30%
                    </text>
                    <text
                      x="36"
                      y="104"
                      textAnchor="end"
                      fill="#64748B"
                      fontFamily="Spline Sans Mono, monospace"
                      fontSize="11"
                    >
                      60%
                    </text>
                    <text
                      x="36"
                      y="54"
                      textAnchor="end"
                      fill="#64748B"
                      fontFamily="Spline Sans Mono, monospace"
                      fontSize="11"
                    >
                      90%
                    </text>

                    {/* Bars */}
                    {chartGeometry.map((pt, idx) => (
                      <rect
                        key={pt.label}
                        x={pt.x}
                        y={pt.y}
                        width="56"
                        height={pt.height}
                        rx="8"
                        fill={BAR_FILLS[idx]}
                        opacity={hoveredTermIdx === null || hoveredTermIdx === idx ? 1 : 0.65}
                        className="cursor-pointer transition-opacity duration-state-change"
                        onMouseEnter={() => setHoveredTermIdx(idx)}
                        onMouseLeave={() => setHoveredTermIdx(null)}
                      />
                    ))}

                    {/* Trend Line */}
                    <polyline
                      fill="none"
                      stroke="#0F172A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={trendPolyline}
                    />

                    {/* Trend Data Nodes & Labels */}
                    {chartGeometry.map((pt, idx) => {
                      const isFinal = idx === chartGeometry.length - 1;
                      const isHovered = hoveredTermIdx === idx;
                      return (
                        <g
                          key={pt.label}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredTermIdx(idx)}
                          onMouseLeave={() => setHoveredTermIdx(null)}
                        >
                          <circle
                            cx={pt.cx}
                            cy={pt.y}
                            r={isHovered ? 7 : 5}
                            fill={isFinal || isHovered ? '#06B6D4' : '#FFFFFF'}
                            stroke="#0F172A"
                            strokeWidth="2.5"
                          />
                          <text
                            x={pt.cx}
                            y={pt.y - 12}
                            textAnchor="middle"
                            fill={isFinal ? '#004AC6' : '#0F172A'}
                            fontFamily="Spline Sans Mono, monospace"
                            fontSize={isFinal ? '13' : '12'}
                            fontWeight={isFinal ? '700' : '600'}
                          >
                            {pt.score}%
                          </text>
                          <text
                            x={pt.cx}
                            y="224"
                            textAnchor="middle"
                            fill={isFinal ? '#0F172A' : '#475569'}
                            fontFamily="Instrument Sans, sans-serif"
                            fontSize="12"
                            fontWeight={isFinal ? '700' : '600'}
                          >
                            {pt.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Right: Circular Progress Indicator for Syllabus Completion */}
              <div className="lg:col-span-4 bg-light-surface-bright rounded-lg p-gutter-lg border border-light-outline-variant/60 shadow-sm flex flex-col items-center justify-between gap-gutter-md text-center">
                <div className="w-full text-left">
                  <h3 className="font-headline text-headline-sm text-light-on-surface">
                    Syllabus Completion
                  </h3>
                  <p className="font-body text-body-sm text-light-on-surface-variant">
                    2026 A/L Theory Cohort Pace
                  </p>
                </div>

                {/* Circular SVG Ring (85%) */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg
                    viewBox="0 0 160 160"
                    className="w-full h-full -rotate-90"
                    role="img"
                    aria-label="85 percent syllabus completion"
                  >
                    <circle
                      cx="80"
                      cy="80"
                      r="64"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="14"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="64"
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray="402.12"
                      strokeDashoffset="60.3"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-headline text-display-md-mobile text-light-on-surface tabular-nums">
                      85%
                    </span>
                    <span className="font-label text-label-md text-light-on-surface-variant tabular-nums">
                      10 / 12 Units
                    </span>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-gutter-xs pt-gutter-xs border-t border-light-outline-variant/40 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-body-sm text-light-on-surface-variant">
                      Theory &amp; Practicals
                    </span>
                    <span className="font-mono text-mono-md text-light-on-surface tabular-nums">
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-body-sm text-light-on-surface-variant">
                      Final Revision Buffer
                    </span>
                    <span className="font-mono text-mono-md text-electric-blue tabular-nums">
                      3 Months
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSyllabusOpen(true)}
                    className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-light-surface-container text-light-primary font-label text-label-md hover:bg-light-surface-container-high transition-colors duration-state-change"
                  >
                    <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                      checklist
                    </span>
                    <span>Inspect 12-Unit Checklist</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Student Reviews & Testimonials */}
        <section
          id="reviews"
          className="py-section-mobile lg:py-section bg-light-surface-container-low border-y border-light-outline-variant/40"
        >
          <div className="max-w-7xl mx-auto px-page-margin lg:px-12 flex flex-col gap-gutter-xl">
            <div className="flex flex-col gap-gutter-sm max-w-2xl">
              <h2 className="font-headline text-headline-lg-mobile lg:text-headline-lg text-light-on-surface">
                What Our A/L Students Say
              </h2>
              <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
                Real feedback from Technology stream students across Sri Lanka who transformed their SFT marks and university Z-scores.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg items-stretch">
              {REVIEWS.map((review) => (
                <article
                  key={review.id}
                  className="bg-light-surface-bright rounded-lg p-gutter-lg border border-light-outline-variant/60 shadow-sm flex flex-col justify-between gap-gutter-md h-full"
                >
                  <div className="flex flex-col gap-gutter-md">
                    <div className="flex items-center justify-between gap-gutter-sm">
                      <div className="flex items-center gap-0.5 text-rating-star" aria-label="5 out of 5 stars">
                        {[0, 1, 2, 3, 4].map((starIdx) => (
                          <span
                            key={starIdx}
                            className="material-symbols-outlined material-symbols-filled text-title-md"
                            aria-hidden="true"
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-sm bg-success-container text-on-success-container font-label text-label-md whitespace-nowrap">
                        {review.grade}
                      </span>
                    </div>

                    <p className="font-body text-body-md text-light-on-surface text-pretty">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                  </div>

                  <footer className="pt-gutter-sm border-t border-light-outline-variant/40 flex flex-col">
                    <span className="font-title text-title-md text-light-on-surface">
                      {review.name}
                    </span>
                    <span className="font-body text-body-sm text-light-on-surface-variant">
                      {review.school} · {review.district}
                    </span>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Class Timetable & Enrollment CTA */}
        <section id="enroll" className="py-section-mobile lg:py-section">
          <div className="max-w-7xl mx-auto px-page-margin lg:px-12 flex flex-col gap-gutter-xl">
            <div className="flex flex-col gap-gutter-sm max-w-2xl">
              <h2 className="font-headline text-headline-lg-mobile lg:text-headline-lg text-light-on-surface">
                2026 / 2027 Class Timetable &amp; Quick Registration
              </h2>
              <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
                Choose your batch schedule below and reserve your seat. Our academic coordinator will send your Zoom link and first unit Tute pack via WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
              {/* Left: Class Schedule Table */}
              <div className="lg:col-span-8">
                <div className="w-full overflow-x-auto bg-light-surface-bright rounded-lg border border-light-outline-variant/60 shadow-sm">
                  <table className="w-full min-w-[600px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-light-outline-variant/60 bg-light-surface-container-low">
                        <th scope="col" className="px-gutter-md py-3.5 text-light-on-surface-variant font-label">
                          <span className="font-label text-label-md whitespace-nowrap">Class Stream</span>
                        </th>
                        <th scope="col" className="px-gutter-md py-3.5 text-light-on-surface-variant font-label">
                          <span className="font-label text-label-md whitespace-nowrap">Day</span>
                        </th>
                        <th scope="col" className="px-gutter-md py-3.5 text-light-on-surface-variant font-label">
                          <span className="font-label text-label-md whitespace-nowrap">Time (SLST)</span>
                        </th>
                        <th scope="col" className="px-gutter-md py-3.5 text-light-on-surface-variant font-label">
                          <span className="font-label text-label-md whitespace-nowrap">Format</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-light-outline-variant/40">
                      {TIMETABLE.map((row) => {
                        const isSelected = selectedRowId === row.id;
                        return (
                          <tr
                            key={row.id}
                            onClick={() => handleSelectTimetableRow(row.id, row.batchValue)}
                            className={`cursor-pointer transition-colors duration-state-change ${
                              isSelected
                                ? 'bg-light-surface-container/60'
                                : 'hover:bg-light-surface-container-low/50'
                            }`}
                          >
                            <td className="px-gutter-md py-4 text-light-on-surface">
                              <div className="flex flex-col">
                                <span className="font-title text-title-md whitespace-nowrap">
                                  {row.stream}
                                </span>
                                <span className="font-body text-body-sm text-light-on-surface-variant">
                                  {row.venue}
                                </span>
                              </div>
                            </td>
                            <td className="px-gutter-md py-4 text-light-on-surface-variant">
                              <span className="font-body text-body-md whitespace-nowrap">{row.day}</span>
                            </td>
                            <td className="px-gutter-md py-4 text-light-on-surface tabular-nums">
                              <span className="font-mono text-mono-md whitespace-nowrap">{row.time}</span>
                            </td>
                            <td className="px-gutter-md py-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-sm font-label text-label-md whitespace-nowrap ${badgeToneClass(
                                  row.formatTone
                                )}`}
                              >
                                {row.format}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Quick Registration Card */}
              <div className="lg:col-span-4">
                <div className="bg-light-surface-bright rounded-lg p-gutter-lg border border-light-outline-variant/60 shadow-sm flex flex-col gap-gutter-md">
                  <header className="flex flex-col gap-gutter-xs">
                    <h3 className="font-headline text-headline-sm text-light-on-surface">
                      Quick Registration
                    </h3>
                    <p className="font-body text-body-sm text-light-on-surface-variant">
                      Get instant access to the next live session and free Unit 01 Tute PDF.
                    </p>
                  </header>

                  <form onSubmit={handleRegistrationSubmit} className="flex flex-col gap-gutter-md">
                    <label className="flex flex-col gap-gutter-xs">
                      <span className="font-label text-label-lg text-light-on-surface">
                        Student Name
                      </span>
                      <input
                        ref={nameInputRef}
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Kavindu Perera"
                        className="w-full px-gutter-md py-3 rounded-md bg-light-surface-container-low border border-light-outline-variant text-light-on-surface placeholder:text-light-outline focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 focus:bg-light-surface-bright transition-colors duration-state-change"
                      />
                    </label>

                    <label className="flex flex-col gap-gutter-xs">
                      <span className="font-label text-label-lg text-light-on-surface">
                        Batch Year
                      </span>
                      <select
                        value={regBatch}
                        onChange={(e) => setRegBatch(e.target.value)}
                        className="w-full px-gutter-md py-3 rounded-md bg-light-surface-container-low border border-light-outline-variant text-light-on-surface focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 focus:bg-light-surface-bright transition-colors duration-state-change"
                      >
                        <option value="2026 A/L Theory">2026 A/L Theory</option>
                        <option value="2026 A/L Revision + Paper">2026 A/L Revision + Paper</option>
                        <option value="2027 A/L Theory">2027 A/L Theory</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-gutter-xs">
                      <span className="font-label text-label-lg text-light-on-surface">
                        WhatsApp Number
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        required
                        value={regWhatsapp}
                        onChange={(e) => setRegWhatsapp(e.target.value)}
                        placeholder="077 123 4567"
                        className="w-full px-gutter-md py-3 rounded-md bg-light-surface-container-low border border-light-outline-variant text-light-on-surface placeholder:text-light-outline focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 focus:bg-light-surface-bright transition-colors duration-state-change"
                      />
                    </label>

                    {regError && (
                      <div
                        role="alert"
                        className="p-3 rounded-md bg-light-error-container text-light-on-error-container font-body text-body-sm flex items-center gap-gutter-sm"
                      >
                        <span className="material-symbols-outlined text-title-lg shrink-0" aria-hidden="true">
                          error
                        </span>
                        <span>{regError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary-container text-light-on-primary-container font-label text-label-lg hover:bg-light-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2 transition-colors duration-state-change ease-state-change shadow-sm whitespace-nowrap shrink-0"
                    >
                      <span className="font-label text-label-lg">Register Now</span>
                      <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                        arrow_forward
                      </span>
                    </button>

                    {regSuccess && (
                      <div
                        role="status"
                        className="p-3 rounded-md bg-success-container text-on-success-container font-body text-body-sm flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-gutter-sm">
                          <span className="material-symbols-outlined text-title-lg shrink-0" aria-hidden="true">
                            check_circle
                          </span>
                          <span>
                            Registration received! Check your WhatsApp for the class link.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPortalOpen(true)}
                          className="self-start font-label text-label-md underline hover:opacity-80"
                        >
                          Open Student Portal Now
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <footer id="contact" className="bg-light-inverse-surface text-light-inverse-on-surface pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-page-margin lg:px-12 flex flex-col gap-gutter-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-xl items-start">
            {/* Brand Column */}
            <div className="md:col-span-5 flex flex-col gap-gutter-md">
              <div className="flex items-center gap-gutter-sm">
                <span className="w-9 h-9 rounded-md bg-light-primary-container text-light-on-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                    science
                  </span>
                </span>
                <span className="font-headline text-title-lg text-light-inverse-on-surface">
                  Hirusha Bandara | A/L SFT
                </span>
              </div>
              <p className="font-body text-body-sm text-light-outline-variant max-w-sm text-pretty">
                Sri Lanka&apos;s dedicated Advanced Level Science for Technology learning platform combining structured theory, practicals, and data-backed exam preparation.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 flex flex-col gap-gutter-sm">
              <h4 className="font-label text-label-lg text-light-inverse-on-surface">Quick Links</h4>
              <nav aria-label="Footer Quick Links" className="flex flex-col gap-gutter-xs">
                <a
                  href="#home"
                  className="font-body text-body-sm text-light-outline-variant hover:text-light-inverse-on-surface transition-colors duration-state-change"
                >
                  Home
                </a>
                <a
                  href="#recordings"
                  className="font-body text-body-sm text-light-outline-variant hover:text-light-inverse-on-surface transition-colors duration-state-change"
                >
                  Class Recordings
                </a>
                <a
                  href="#progress"
                  className="font-body text-body-sm text-light-outline-variant hover:text-light-inverse-on-surface transition-colors duration-state-change"
                >
                  Student Progress
                </a>
                <a
                  href="#reviews"
                  className="font-body text-body-sm text-light-outline-variant hover:text-light-inverse-on-surface transition-colors duration-state-change"
                >
                  Student Reviews
                </a>
                <a
                  href="#enroll"
                  className="font-body text-body-sm text-light-outline-variant hover:text-light-inverse-on-surface transition-colors duration-state-change"
                >
                  Class Timetable
                </a>
              </nav>
            </div>

            {/* Community Channels */}
            <div className="md:col-span-4 flex flex-col gap-gutter-sm">
              <h4 className="font-label text-label-lg text-light-inverse-on-surface">
                Join Student Channels
              </h4>
              <div className="flex flex-wrap gap-gutter-sm">
                <button
                  type="button"
                  onClick={() => setActiveChannel('whatsapp')}
                  className="inline-flex items-center gap-gutter-xs px-gutter-md py-2.5 rounded-md bg-success-container text-on-success-container font-label text-label-lg hover:opacity-90 transition-opacity duration-state-change whitespace-nowrap shrink-0"
                >
                  <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                    chat
                  </span>
                  <span>WhatsApp Channel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('telegram')}
                  className="inline-flex items-center gap-gutter-xs px-gutter-md py-2.5 rounded-md bg-light-primary-container text-light-on-primary-container font-label text-label-lg hover:bg-light-primary transition-colors duration-state-change whitespace-nowrap shrink-0"
                >
                  <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                    send
                  </span>
                  <span>Telegram Group</span>
                </button>
                <a
                  href="https://www.youtube.com/@HirushaBandara-wt7eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-gutter-xs px-gutter-md py-2.5 rounded-md bg-light-surface-variant/20 text-light-inverse-on-surface border border-light-outline-variant/30 font-label text-label-lg hover:bg-light-surface-variant/30 transition-colors duration-state-change whitespace-nowrap shrink-0"
                >
                  <span
                    className="material-symbols-outlined text-title-md text-energetic-cyan"
                    aria-hidden="true"
                  >
                    smart_display
                  </span>
                  <span>YouTube Channel</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-gutter-lg border-t border-light-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-gutter-sm text-light-outline-variant">
            <p className="font-body text-body-sm">
              © 2026 Hirusha Bandara SFT. All rights reserved.
            </p>
            <p className="font-label text-label-md">
              Island-wide A/L Science for Technology
            </p>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <RecordingModal
        recording={selectedRecording}
        onClose={() => setSelectedRecording(null)}
      />

      <StudentPortalModal
        isOpen={portalOpen}
        onClose={() => setPortalOpen(false)}
        registeredStudent={registeredStudent}
        onOpenSyllabus={() => setSyllabusOpen(true)}
      />

      <SyllabusModal isOpen={syllabusOpen} onClose={() => setSyllabusOpen(false)} />

      <ChannelModal
        channel={activeChannel}
        onClose={() => setActiveChannel(null)}
        onProceedToRegister={handleJumpToEnroll}
      />
    </div>
  );
}
