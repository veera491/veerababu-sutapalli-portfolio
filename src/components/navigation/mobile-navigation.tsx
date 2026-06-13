'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export interface NavLink {
  label: string;
  target: string;
}

export interface MobileNavigationProps {
  links: NavLink[];
}

export function MobileNavigation({ links }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden flex items-center">
      <button
        type="button"
        className="p-2 -mr-2 text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus:outline-none rounded-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close main menu" : "Open main menu"}
      >
        {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-[64px] z-50 bg-[var(--color-background)] border-t border-[var(--color-border)] p-4 flex flex-col">
          <nav className="flex flex-col gap-6 pt-8" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.target}
                className="text-2xl font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus:outline-none rounded-sm w-fit"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
