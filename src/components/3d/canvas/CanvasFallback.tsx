import React from 'react';

export function CanvasFallback() {
  return (
    <div
      className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0d0d0d] overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      data-testid="canvas-fallback"
    >
      {/* Background soft radial gradient */}
      <div
        className="absolute inset-0 opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 60% 50%, var(--color-accent) 0%, transparent 60%)',
        }}
      />

      {/* Lightweight SVG motif representing Neural Core */}
      <svg
        className="w-48 h-48 opacity-25 text-[var(--color-accent)] animate-[pulse_3s_infinite]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="40" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="25" />
        <circle cx="50" cy="50" r="8" fill="var(--color-accent)" fillOpacity="0.4" />
        <line x1="50" y1="10" x2="50" y2="90" />
        <line x1="10" y1="50" x2="90" y2="50" />
        <line x1="21.7" y1="21.7" x2="78.3" y2="78.3" />
        <line x1="21.7" y1="78.3" x2="78.3" y2="21.7" />
        <circle cx="50" cy="10" r="1.5" fill="currentColor" />
        <circle cx="50" cy="90" r="1.5" fill="currentColor" />
        <circle cx="10" cy="50" r="1.5" fill="currentColor" />
        <circle cx="90" cy="50" r="1.5" fill="currentColor" />
        <circle cx="21.7" cy="21.7" r="1.5" fill="currentColor" />
        <circle cx="78.3" cy="78.3" r="1.5" fill="currentColor" />
        <circle cx="21.7" cy="78.3" r="1.5" fill="currentColor" />
        <circle cx="78.3" cy="21.7" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}
export default CanvasFallback;
