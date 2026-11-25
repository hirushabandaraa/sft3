import { useEffect, useState } from 'react';
import { RecordingItem } from '../data/sftData';
import { ResilientImage } from './ResilientImage';

interface RecordingModalProps {
  recording: RecordingItem | null;
  onClose: () => void;
}

function formatSeconds(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function RecordingModal({ recording, onClose }: RecordingModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [downloadedTute, setDownloadedTute] = useState(false);

  useEffect(() => {
    if (!recording) return;
    setIsPlaying(true);
    setCurrentSeconds(0);
    setPlaybackRate(1);
    setDownloadedTute(false);
  }, [recording]);

  useEffect(() => {
    if (!recording || !isPlaying) return;
    const intervalMs = Math.max(250, Math.round(1000 / playbackRate));
    const timer = window.setInterval(() => {
      setCurrentSeconds((prev) => {
        if (prev + 1 >= recording.durationSeconds) {
          setIsPlaying(false);
          return recording.durationSeconds;
        }
        return prev + 1;
      });
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [recording, isPlaying, playbackRate]);

  useEffect(() => {
    if (!recording) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [recording, onClose]);

  if (!recording) return null;

  const progressPercent = Math.min(
    100,
    Math.round((currentSeconds / Math.max(1, recording.durationSeconds)) * 100)
  );

  const handleDownloadTute = () => {
    const content = [
      `HIRUSHA BANDARA | A/L SCIENCE FOR TECHNOLOGY (SFT)`,
      `====================================================`,
      `Unit / Session: ${recording.title}`,
      `Category: ${recording.badgeLabel}`,
      `Duration: ${recording.duration}`,
      ``,
      `KEY FORMULAS & CONCEPTS`,
      ...recording.keyEquations.map((eq, idx) => `${idx + 1}. ${eq}`),
      ``,
      `TUTE OUTLINE & WORKED OBJECTIVES`,
      ...recording.tuteSummary.map((item, idx) => `- ${item}`),
      ``,
      `CHAPTER TIMESTAMPS`,
      ...recording.chapters.map((ch) => `[${ch.time}] ${ch.title}`),
      ``,
      `Generated from Hirusha Bandara A/L SFT Learning Platform`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${recording.id}-study-tute.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadedTute(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-light-scrim/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recording-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-light-surface-bright rounded-lg border border-light-outline-variant/80 shadow-xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-light-outline-variant/60 bg-light-surface-container-low">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-label-md font-label text-light-primary">
              <span>{recording.badgeLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{recording.unitNumber}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{recording.duration}</span>
            </div>
            <h2
              id="recording-modal-title"
              className="font-headline text-headline-sm text-light-on-surface"
            >
              {recording.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close recording player"
            className="w-10 h-10 rounded-md bg-light-surface-bright border border-light-outline-variant text-light-on-surface hover:bg-light-surface-container-low flex items-center justify-center shrink-0 transition-colors duration-state-change"
          >
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Video Stage */}
          <div className="lg:col-span-7 bg-deep-navy text-light-inverse-on-surface flex flex-col">
            <div className="relative aspect-video bg-deep-navy overflow-hidden">
              <ResilientImage
                src={recording.imageUrl}
                alt={recording.imageAlt || recording.title}
                className="w-full h-full object-cover opacity-85"
                fallbackTitle={recording.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/90 via-deep-navy/25 to-transparent" />

              {/* Center Play/Pause Overlay */}
              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                aria-label={isPlaying ? 'Pause lesson' : 'Play lesson'}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-electric-blue/95 text-white flex items-center justify-center shadow-lg hover:bg-light-primary transition-colors duration-state-change"
              >
                <span className="material-symbols-outlined text-[32px]" aria-hidden="true">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              {/* Current Chapter Overlay */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none">
                <div className="flex flex-col">
                  <span className="font-label text-label-sm text-energetic-cyan">
                    {isPlaying ? 'Playing Studio Recording' : 'Paused'}
                  </span>
                  <span className="font-title text-body-sm text-white truncate max-w-[36ch]">
                    {recording.chapters
                      .slice()
                      .reverse()
                      .find((ch) => currentSeconds >= ch.seconds)?.title ||
                      recording.chapters[0]?.title}
                  </span>
                </div>
                <span className="font-mono text-label-md text-white tabular-nums bg-deep-navy/80 px-2.5 py-1 rounded-sm border border-white/15">
                  {formatSeconds(currentSeconds)} / {recording.duration}
                </span>
              </div>
            </div>

            {/* Scrubber & Controls */}
            <div className="px-4 py-3 flex flex-col gap-3 bg-deep-navy border-t border-white/10">
              <input
                type="range"
                min={0}
                max={recording.durationSeconds}
                value={currentSeconds}
                aria-label="Seek recording timeline"
                onChange={(e) => setCurrentSeconds(Number(e.target.value))}
                className="w-full accent-energetic-cyan cursor-pointer h-1.5"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white/15 text-white font-label text-label-md transition-colors duration-state-change"
                  >
                    <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSeconds((s) => Math.max(0, s - 15))}
                    className="px-2.5 py-1.5 rounded-sm bg-white/10 hover:bg-white/15 text-white font-mono text-label-md tabular-nums transition-colors duration-state-change"
                  >
                    -15s
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentSeconds((s) => Math.min(recording.durationSeconds, s + 15))
                    }
                    className="px-2.5 py-1.5 rounded-sm bg-white/10 hover:bg-white/15 text-white font-mono text-label-md tabular-nums transition-colors duration-state-change"
                  >
                    +15s
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setPlaybackRate(rate)}
                      className={`px-2 py-1 rounded-sm font-mono text-label-md tabular-nums transition-colors duration-state-change ${
                        playbackRate === rate
                          ? 'bg-electric-blue text-white'
                          : 'bg-white/10 text-slate-300 hover:bg-white/15'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-body-sm text-slate-300 flex items-center justify-between">
                <span>Progress: {progressPercent}% watched</span>
                <span>HD 1080p Studio Audio</span>
              </div>
            </div>
          </div>

          {/* Chapters & Study Tute */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-5 max-h-[540px] overflow-y-auto bg-light-surface-bright">
            <div className="flex flex-col gap-5">
              {/* Chapters */}
              <div className="flex flex-col gap-2">
                <h3 className="font-headline text-title-md text-light-on-surface">
                  Timestamped Chapters
                </h3>
                <div className="flex flex-col gap-1.5">
                  {recording.chapters.map((chapter) => {
                    const isActive =
                      currentSeconds >= chapter.seconds &&
                      (recording.chapters.find(
                        (c) => c.seconds > chapter.seconds && currentSeconds >= c.seconds
                      ) === undefined);
                    return (
                      <button
                        key={chapter.time}
                        type="button"
                        onClick={() => {
                          setCurrentSeconds(chapter.seconds);
                          setIsPlaying(true);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md border flex items-center justify-between gap-3 transition-colors duration-state-change ${
                          isActive
                            ? 'bg-light-surface-container border-electric-blue/40 text-light-primary'
                            : 'bg-light-surface-container-low border-light-outline-variant/50 text-light-on-surface hover:bg-light-surface-container'
                        }`}
                      >
                        <span className="font-body text-body-sm font-medium truncate">
                          {chapter.title}
                        </span>
                        <span className="font-mono text-label-md tabular-nums shrink-0 text-light-on-surface-variant">
                          {chapter.time}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Key Equations */}
              <div className="flex flex-col gap-2">
                <h3 className="font-headline text-title-md text-light-on-surface">
                  Key Formulas Covered
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {recording.keyEquations.map((eq) => (
                    <li
                      key={eq}
                      className="px-3 py-2 rounded-md bg-light-surface-container-low border border-light-outline-variant/50 font-mono text-body-sm text-light-on-surface"
                    >
                      {eq}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Study Notes */}
              <div className="flex flex-col gap-2">
                <h3 className="font-headline text-title-md text-light-on-surface">
                  Unit Tute Highlights
                </h3>
                <ul className="flex flex-col gap-1.5 list-disc pl-5 text-body-sm text-light-on-surface-variant">
                  {recording.tuteSummary.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-light-outline-variant/60 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleDownloadTute}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-light-primary-container text-light-on-primary-container font-label text-label-lg hover:bg-light-primary transition-colors duration-state-change shadow-sm"
              >
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                  {downloadedTute ? 'check_circle' : 'download'}
                </span>
                <span>
                  {downloadedTute ? 'Unit Study Tute Downloaded' : 'Download Unit Study Tute'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
