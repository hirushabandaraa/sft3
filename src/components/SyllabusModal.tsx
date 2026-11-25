import { useEffect } from 'react';
import { SYLLABUS_UNITS } from '../data/sftData';

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SyllabusModal({ isOpen, onClose }: SyllabusModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-light-scrim/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="syllabus-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-light-surface-bright rounded-lg border border-light-outline-variant/80 shadow-xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-light-outline-variant/60 bg-light-surface-container-low">
          <div>
            <p className="font-label text-label-md text-electric-blue">
              2026 A/L Theory Cohort Pace · 85% Complete
            </p>
            <h2
              id="syllabus-modal-title"
              className="font-headline text-headline-sm text-light-on-surface"
            >
              12-Unit A/L SFT Syllabus Tracker
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close syllabus tracker"
            className="w-10 h-10 rounded-md bg-light-surface-bright border border-light-outline-variant text-light-on-surface hover:bg-light-surface-container-low flex items-center justify-center shrink-0 transition-colors duration-state-change"
          >
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto flex flex-col gap-2.5">
          {SYLLABUS_UNITS.map((unit) => {
            const statusStyle =
              unit.status === 'Completed'
                ? 'bg-success-container text-on-success-container'
                : unit.status === 'In Progress'
                  ? 'bg-light-secondary-container text-light-on-secondary-container'
                  : 'bg-light-surface-container-low text-light-on-surface-variant';
            return (
              <div
                key={unit.number}
                className="flex items-center justify-between gap-4 px-4 py-3 rounded-md border border-light-outline-variant/60 bg-light-surface"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-mono-md text-light-primary tabular-nums shrink-0">
                    Unit {unit.number}
                  </span>
                  <div className="min-w-0">
                    <p className="font-title text-body-md font-semibold text-light-on-surface truncate">
                      {unit.title}
                    </p>
                    <p className="font-body text-body-sm text-light-on-surface-variant tabular-nums">
                      {unit.lessonsCount} structured studio sessions
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-sm font-label text-label-md whitespace-nowrap shrink-0 ${statusStyle}`}
                >
                  {unit.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
