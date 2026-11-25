import { FormEvent, useEffect, useState } from 'react';
import { TIMETABLE } from '../data/sftData';

export interface RegisteredStudent {
  name: string;
  batch: string;
  whatsapp: string;
  studentId: string;
}

interface StudentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredStudent: RegisteredStudent | null;
  onOpenSyllabus: () => void;
}

export function StudentPortalModal({
  isOpen,
  onClose,
  registeredStudent,
  onOpenSyllabus,
}: StudentPortalModalProps) {
  const [studentIdInput, setStudentIdInput] = useState('SFT-2026-0418');
  const [batchInput, setBatchInput] = useState('2026 A/L Theory');
  const [signedInUser, setSignedInUser] = useState<RegisteredStudent | null>(null);
  const [copiedZoom, setCopiedZoom] = useState(false);

  useEffect(() => {
    if (registeredStudent) {
      setSignedInUser(registeredStudent);
    }
  }, [registeredStudent]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = studentIdInput.trim() || 'SFT-2026-0418';
    setSignedInUser({
      name: cleaned.startsWith('SFT-') ? 'Kavindu Perera' : cleaned,
      batch: batchInput,
      whatsapp: '077 458 9210',
      studentId: cleaned.startsWith('SFT-') ? cleaned : 'SFT-2026-0418',
    });
  };

  const matchedClass =
    TIMETABLE.find((row) => row.batchValue === (signedInUser?.batch || batchInput)) ||
    TIMETABLE[0];

  const handleCopyZoom = () => {
    const meetingCode = 'Zoom ID: 842 9104 3318 · Passcode: SFT2026';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(meetingCode).catch(() => {});
    }
    setCopiedZoom(true);
    window.setTimeout(() => setCopiedZoom(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-light-scrim/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-light-surface-bright rounded-lg border border-light-outline-variant/80 shadow-xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-light-outline-variant/60 bg-light-surface-container-low">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-md bg-light-primary-container text-light-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                school
              </span>
            </span>
            <div>
              <h2
                id="portal-modal-title"
                className="font-headline text-headline-sm text-light-on-surface"
              >
                Student Learning Portal
              </h2>
              <p className="font-body text-body-sm text-light-on-surface-variant">
                Hirusha Bandara · A/L Science for Technology
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close student portal"
            className="w-10 h-10 rounded-md bg-light-surface-bright border border-light-outline-variant text-light-on-surface hover:bg-light-surface-container-low flex items-center justify-center shrink-0 transition-colors duration-state-change"
          >
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        {!signedInUser ? (
          <form onSubmit={handleLogin} className="p-6 flex flex-col gap-5">
            <div className="p-3.5 rounded-md bg-light-secondary-container/70 text-light-on-secondary-container text-body-sm flex items-start gap-2.5">
              <span className="material-symbols-outlined text-title-lg shrink-0 mt-0.5" aria-hidden="true">
                info
              </span>
              <span>
                Enter your Student ID or use the pre-filled demo ID below to preview your live Zoom classroom link, term marks, and Unit Tute packs.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-label text-label-lg text-light-on-surface">
                  Student ID or Name
                </span>
                <input
                  type="text"
                  required
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  placeholder="SFT-2026-0418"
                  className="w-full px-4 py-3 rounded-md bg-light-surface-container-low border border-light-outline-variant text-light-on-surface focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 focus:bg-light-surface-bright transition-colors duration-state-change"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-label text-label-lg text-light-on-surface">
                  Enrolled Batch
                </span>
                <select
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-light-surface-container-low border border-light-outline-variant text-light-on-surface focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 focus:bg-light-surface-bright transition-colors duration-state-change"
                >
                  <option value="2026 A/L Theory">2026 A/L Theory</option>
                  <option value="2026 A/L Revision + Paper">2026 A/L Revision + Paper</option>
                  <option value="2027 A/L Theory">2027 A/L Theory</option>
                </select>
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-md border border-light-outline-variant text-light-on-surface font-label text-label-lg hover:bg-light-surface-container-low transition-colors duration-state-change"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-light-primary-container text-light-on-primary-container font-label text-label-lg hover:bg-light-primary transition-colors duration-state-change shadow-sm"
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                  login
                </span>
                <span>Access Student Portal</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 flex flex-col gap-5">
            {/* Student Summary Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md bg-light-surface-container-low border border-light-outline-variant/60">
              <div>
                <p className="font-label text-label-md text-light-primary">
                  {signedInUser.studentId} · {signedInUser.batch}
                </p>
                <h3 className="font-headline text-title-lg text-light-on-surface">
                  Welcome back, {signedInUser.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSignedInUser(null)}
                className="self-start sm:self-center px-3 py-1.5 rounded-md bg-light-surface-bright border border-light-outline-variant text-label-md font-label text-light-on-surface-variant hover:text-light-on-surface transition-colors duration-state-change"
              >
                Switch Account
              </button>
            </div>

            {/* Upcoming Live Class */}
            <div className="p-4 rounded-md border border-light-outline-variant/60 bg-light-surface-bright flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-label text-label-md text-electric-blue">
                  Next Scheduled Session
                </span>
                <span className="font-mono text-label-md text-light-on-surface-variant tabular-nums">
                  {matchedClass.day} · {matchedClass.time}
                </span>
              </div>
              <p className="font-headline text-title-md text-light-on-surface">
                {matchedClass.nextTopic}
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant">
                Location: {matchedClass.venue}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCopyZoom}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-light-primary-container text-light-on-primary-container font-label text-label-lg hover:bg-light-primary transition-colors duration-state-change"
                >
                  <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                    {copiedZoom ? 'check' : 'videocam'}
                  </span>
                  <span>
                    {copiedZoom ? 'Zoom Details Copied' : 'Copy Live Zoom Credentials'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSyllabus();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-light-outline-variant text-light-on-surface font-label text-label-lg hover:bg-light-surface-container-low transition-colors duration-state-change"
                >
                  <span className="material-symbols-outlined text-title-md text-electric-blue" aria-hidden="true">
                    checklist
                  </span>
                  <span>View 12-Unit Checklist</span>
                </button>
              </div>
            </div>

            {/* Personal Assessment Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-md bg-light-surface-container-low border border-light-outline-variant/50">
                <span className="font-label text-label-md text-light-on-surface-variant">
                  Latest Term Paper
                </span>
                <p className="font-headline text-headline-md text-light-on-surface tabular-nums mt-1">
                  79%
                </p>
                <span className="font-body text-body-sm text-success">
                  +11% above cohort avg
                </span>
              </div>
              <div className="p-3.5 rounded-md bg-light-surface-container-low border border-light-outline-variant/50">
                <span className="font-label text-label-md text-light-on-surface-variant">
                  MCQ Speed Accuracy
                </span>
                <p className="font-headline text-headline-md text-light-on-surface tabular-nums mt-1">
                  42 / 50
                </p>
                <span className="font-body text-body-sm text-light-on-surface-variant">
                  Avg 54s per question
                </span>
              </div>
              <div className="p-3.5 rounded-md bg-light-surface-container-low border border-light-outline-variant/50">
                <span className="font-label text-label-md text-light-on-surface-variant">
                  Syllabus Progress
                </span>
                <p className="font-headline text-headline-md text-light-on-surface tabular-nums mt-1">
                  10 / 12
                </p>
                <span className="font-body text-body-sm text-electric-blue">
                  On schedule (85%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
