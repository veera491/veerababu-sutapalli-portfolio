import 'server-only';
import { Metadata } from 'next';
import { getSeoConfig } from './seo';

export async function generateSiteMetadata(): Promise<Metadata> {
  const seo = await getSeoConfig();
  
  const ogImagePath = '/assets/og-image.png';
  
  // Webmaster verification — only rendered when env values are nonempty
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined;
  const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || undefined;

  const verificationMeta: Record<string, string> = {};
  if (googleVerification) verificationMeta.google = googleVerification;

  return {
    title: {
      default: seo.siteName,
      template: `%s | ${seo.fullName}`,
    },
    description: seo.description,
    metadataBase: new URL(seo.canonicalUrl),
    applicationName: seo.siteName,
    authors: [{ name: seo.fullName }],
    creator: seo.fullName,
    publisher: seo.fullName,
    keywords: seo.keywords,
    category: 'technology',
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: seo.siteName,
      description: seo.description,
      url: '/',
      siteName: seo.siteName,
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: seo.siteName,
        }
      ],
      type: 'website',
      locale: seo.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.siteName,
      description: seo.description,
      images: [ogImagePath],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon.png', type: 'image/png', sizes: '180x180' }
      ],
      shortcut: '/favicon.svg',
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ],
    },
    // Google Search Console verification (only when env var is set)
    ...(Object.keys(verificationMeta).length > 0 ? { verification: verificationMeta } : {}),
    // Bing verification is rendered via a separate meta tag in layout.tsx
    // because Next.js Metadata API does not support msvalidate.01 natively
    ...(bingVerification ? { other: { 'msvalidate.01': bingVerification } } : {}),
  };
}
