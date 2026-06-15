import { getSection } from '@/lib/csv/repository';
import { HeroSection } from '@/components/hero/hero-section';
import { AboutSection } from '@/components/about/about-section';
import { CapabilitiesSection } from '@/components/capabilities/capabilities-section';
import { SelectedWorkSection } from '@/components/projects/selected-work-section';
import { ResearchSection } from '@/components/research/research-section';
import { ExperienceSection } from '@/components/experience/experience-section';
import { EducationSection } from '@/components/education/education-section';
import { ContactSection } from '@/components/contact/contact-section';
import { toProjectViewModel } from '@/components/projects/project-view-model';

export default async function Home() {
  const rawProjects = await getSection('project');
  
  // Filter for enabled projects and map to view model
  const enabledProjects = rawProjects
    .filter(p => p.enabled)
    .map(toProjectViewModel);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <CapabilitiesSection />
      <SelectedWorkSection projects={enabledProjects} />
      <ResearchSection />
      <ExperienceSection />
      <EducationSection />
      <ContactSection />
    </>
  );
}
