import React from 'react';

export interface ProjectMetricsProps {
  metrics: readonly string[];
  maxCount: number;
}

export function ProjectMetrics({ metrics, maxCount }: ProjectMetricsProps) {
  if (metrics.length === 0) return null;
  const displayMetrics = metrics.slice(0, maxCount);

  return (
    <div className="flex flex-col gap-2 mt-4 text-sm text-[var(--color-text)] border-l-2 border-[var(--color-accent-soft)] pl-3">
      {displayMetrics.map((metric, index) => (
        <span key={index} className="block text-pretty">{metric}</span>
      ))}
    </div>
  );
}
