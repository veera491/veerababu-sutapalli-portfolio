import { PortfolioItem } from '@/lib/csv/types';
import { requireStringField } from '@/lib/csv/repository';

export interface HeroProofStripProps {
  items: readonly PortfolioItem[];
}

export function HeroProofStrip({ items }: HeroProofStripProps) {
  const enabledItems = items.filter(i => i.enabled).sort((a, b) => a.itemOrder - b.itemOrder);
  if (enabledItems.length === 0) return null;

  return (
    <div className="w-full mt-24 border-t border-[var(--color-border)] pt-8 lg:pt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {enabledItems.map(item => {
          const val = requireStringField(item, 'value');
          // Handle em-dash split "Primary — Secondary" safely
          const parts = val.split('—').map(s => s.trim());
          const primary = parts[0];
          const secondary = parts.length > 1 ? parts.slice(1).join(' — ') : null;

          return (
            <div key={item.itemId} className="flex flex-col gap-1">
              <span className="text-lg md:text-xl font-medium text-[var(--color-text)]">
                {primary}
              </span>
              {secondary && (
                <span className="text-sm text-[var(--color-muted)]">
                  {secondary}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
