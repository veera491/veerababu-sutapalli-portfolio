import { getSection } from '@/lib/csv/repository';
import { HeroSection } from '@/components/hero/hero-section';
import { SelectedWorkSection } from '@/components/projects/selected-work-section';
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
      <SelectedWorkSection projects={enabledProjects} />
    </>
  );
}
