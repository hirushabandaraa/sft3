import { useEffect, useState } from 'react';

export type CommunityChannelType = 'whatsapp' | 'telegram' | null;

interface ChannelModalProps {
  channel: CommunityChannelType;
  onClose: () => void;
  onProceedToRegister: () => void;
}

export function ChannelModal({
  channel,
  onClose,
  onProceedToRegister,
}: ChannelModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [channel]);

  useEffect(() => {
    if (!channel) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [channel, onClose]);

  if (!channel) return null;

  const isWhatsApp = channel === 'whatsapp';
  const title = isWhatsApp ? 'Official SFT WhatsApp Channel' : 'Island-wide SFT Telegram Group';
  const handle = isWhatsApp ? '+94 77 458 9210' : '@HirushaBandaraSFT';
  const description = isWhatsApp
    ? 'Receive daily MCQ challenges, weekly Zoom links, and Unit Tute PDFs directly via our verified academic coordinator.'
    : 'Discuss past paper structured essay answers, download marking schemes, and stay updated with 2026 & 2027 revision timetables.';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(handle).catch(() => {});
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-light-scrim/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="channel-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-light-surface-bright rounded-lg border border-light-outline-variant/80 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-light-outline-variant/60 bg-light-surface-container-low">
          <h2 id="channel-modal-title" className="font-headline text-title-lg text-light-on-surface">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close channel dialog"
            className="w-9 h-9 rounded-md bg-light-surface-bright border border-light-outline-variant text-light-on-surface hover:bg-light-surface-container-low flex items-center justify-center shrink-0"
          >
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <p className="font-body text-body-md text-light-on-surface-variant">
            {description}
          </p>

          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-md bg-light-surface-container-low border border-light-outline-variant/60">
            <span className="font-mono text-mono-md text-light-on-surface">{handle}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-sm bg-light-surface-bright border border-light-outline-variant font-label text-label-md text-light-primary hover:bg-light-surface-container transition-colors duration-state-change"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onProceedToRegister();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-light-primary-container text-light-on-primary-container font-label text-label-lg hover:bg-light-primary transition-colors duration-state-change"
          >
            <span>Complete Quick Registration for Instant Invite</span>
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
