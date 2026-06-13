import { PortfolioItem } from '@/lib/csv/types';
import { ProjectViewModel } from './project-types';

export function toProjectViewModel(item: PortfolioItem): ProjectViewModel {
  const fields = item.fields;
  
  const getArray = (field: string): readonly string[] => {
    const val = fields[field];
    if (Array.isArray(val)) return val;
    if (val) return [val as string];
    return [];
  };

  const getString = (field: string): string | undefined => {
    const val = fields[field];
    if (Array.isArray(val)) return val[0];
    return val as string | undefined;
  };

  return {
    id: item.itemId,
    itemType: item.itemType as "featured" | "standard",
    order: item.itemOrder,
    title: getString('title') || item.itemId,
    slug: getString('slug') || item.itemId,
    category: getString('category'),
    summary: getString('summary'),
    shortDescription: getString('short_description'),
    status: getString('status'),
    role: getString('role'),
    problem: getString('problem'),
    motivation: getString('motivation'),
    methodology: getString('methodology'),
    dataset: getString('dataset'),
    dataScale: getString('data_scale'),
    technologies: getArray('technology'),
    metrics: getArray('metric'),
    results: getArray('result'),
    images: getArray('image'),
    diagrams: getArray('diagram'),
    coverImage: getString('cover_image') || getString('static_image') || getString('image') || getString('diagram'),
    githubUrl: getString('github_url'),
    publicationUrl: getString('publication_url'),
    demoUrl: getString('demo_url'),
  };
}
