import 'server-only';
import { requireItem, requireStringField } from './csv/repository';
import { getSiteUrl } from './site-url';

export interface SeoConfig {
  siteName: string;
  fullName: string;
  role: string;
  tagline: string;
  description: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  resumePath: string;
  portfolioUrl: string;
  canonicalUrl: string;
  locale: string;
  keywords: string[];
}

export async function getSeoConfig(): Promise<SeoConfig> {
  const identityItem = await requireItem('site', 'identity');
  const seoGlobal = await requireItem('seo', 'global');

  const fullName = requireStringField(identityItem, 'full_name');
  const role = requireStringField(identityItem, 'primary_role');
  const tagline = requireStringField(identityItem, 'tagline');
  const email = requireStringField(identityItem, 'email');
  const githubUrl = requireStringField(identityItem, 'github_url');
  const linkedinUrl = requireStringField(identityItem, 'linkedin_url');
  const resumePath = requireStringField(identityItem, 'resume_path');
  const portfolioUrl = requireStringField(identityItem, 'portfolio_url');

  const title = requireStringField(seoGlobal, 'title');
  const description = requireStringField(seoGlobal, 'description');

  const baseSiteUrl = getSiteUrl();

  const keywords = [
    'AI Engineer',
    'Machine Learning Engineer',
    'GenAI Engineer',
    'LLM Application Development',
    'RAG Systems',
    'Python Developer',
    'PyTorch',
    'MLOps',
    'Data Infrastructure',
    'Distributed Systems',
    'Software Engineer'
  ];

  return {
    siteName: title,
    fullName,
    role,
    tagline,
    description,
    email,
    githubUrl,
    linkedinUrl,
    resumePath,
    portfolioUrl,
    canonicalUrl: baseSiteUrl,
    locale: 'en-US',
    keywords
  };
}
