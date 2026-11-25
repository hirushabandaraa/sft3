import { useState } from 'react';

interface ResilientImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  fallbackIcon?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  fallbackIcon = 'science',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-light-surface-container via-light-surface-container-low to-light-secondary-container/70 text-light-primary p-4 text-center"
      >
        <span className="w-11 h-11 rounded-md bg-light-surface-bright/90 border border-light-outline-variant/60 flex items-center justify-center text-electric-blue shadow-sm">
          <span className="material-symbols-outlined text-headline-md" aria-hidden="true">
            {fallbackIcon}
          </span>
        </span>
        {fallbackTitle ? (
          <span className="font-label text-label-md text-light-on-surface max-w-[20ch] line-clamp-2">
            {fallbackTitle}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
