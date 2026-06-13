import 'server-only';
import { Metadata } from 'next';
import { parseCsv } from './csv/parser';
import { assetExists } from './assets/manifest';

export async function generateSiteMetadata(): Promise<Metadata> {
  const { content } = await parseCsv();
  
  const seoGlobal = content['seo']?.find(i => i.itemId === 'global');
  const siteIdentity = content['site']?.find(i => i.itemId === 'identity');
  
  const title = (seoGlobal?.fields['title'] as string) || 'VEERABABU SUTAPALLI';
  const description = (seoGlobal?.fields['description'] as string) || '';
  const fullName = (siteIdentity?.fields['full_name'] as string) || 'VEERABABU SUTAPALLI';
  const url = (siteIdentity?.fields['portfolio_url'] as string) || 'https://veerababu-sutapalli-portfolio.vercel.app/';
  
  const ogImagePath = '/assets/placeholders/project-cover.svg'; // Fallback
  
  return {
    title,
    description,
    metadataBase: new URL(url),
    authors: [{ name: fullName }],
    creator: fullName,
    openGraph: {
      title,
      description,
      url,
      siteName: title,
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImagePath],
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}
