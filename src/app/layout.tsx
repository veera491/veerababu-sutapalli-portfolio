import React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { generateSiteMetadata } from '@/lib/metadata';
import { getThemeTokens, generateThemeVariables } from '@/lib/theme';
import { PageShell } from '@/components/layout/page-shell';
import { SiteHeader } from '@/components/navigation/site-header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  return await generateSiteMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeTokens = await getThemeTokens();
  const themeVariables = generateThemeVariables(themeTokens);

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased selection:bg-[var(--color-accent)] selection:text-[var(--color-accent-contrast)]`}
        style={themeVariables}
      >
        <PageShell header={<SiteHeader />}>
          {children}
        </PageShell>
      </body>
    </html>
  );
}
