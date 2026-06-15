import React from 'react';
import type { Metadata } from 'next';
import { getSection } from '@/lib/csv/repository';
import { toProjectViewModel } from '@/components/projects/project-view-model';
import { HeroSection } from '@/components/hero/hero-section';
import { CapabilitiesSection } from '@/components/capabilities/capabilities-section';
import { SelectedWorkSection } from '@/components/projects/selected-work-section';
import { ContactSection } from '@/components/contact/contact-section';
import { DynamicCanvasWrapper } from '@/components/3d/canvas/DynamicCanvasWrapper.client';


// Route-specific metadata with indexing disabled and canonical override
export const metadata: Metadata = {
  title: '3D Neural Intelligence Core Lab',
  description: 'An isolated WebGL-powered 3D Neural Intelligence Core prototype.',
  alternates: {
    canonical: '/3d-lab',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function Page() {
  const rawProjects = await getSection('project');
  const enabledProjects = rawProjects
    .filter((p) => p.enabled)
    .map(toProjectViewModel);

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] overflow-x-hidden">
      {/* Isolated prototype styling */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Smoothly fade and offset 2D portrait column once the WebGL scene finishes rendering/ready state */
            div[data-scene-ready="true"] ~ div #home div.lg\\:w-\\[45\\%\\] {
              opacity: 0;
              pointer-events: none;
              transform: scale(0.96) translateY(5px);
              transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }
          `,
        }}
      />

      {/* 3D WebGL Canvas fixed in background */}
      <DynamicCanvasWrapper />

      {/* Semantic HTML text layers scrolling above canvas */}
      <div className="relative z-10 w-full pointer-events-auto">
        <HeroSection />
        <CapabilitiesSection />
        <SelectedWorkSection projects={enabledProjects} />
        <ContactSection />
      </div>
    </div>
  );
}
