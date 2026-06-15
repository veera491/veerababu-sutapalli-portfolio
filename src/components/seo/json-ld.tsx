import React from 'react';
import 'server-only';
import { getSeoConfig } from '@/lib/seo';
import { getSection, requireStringField, getStringArrayField, getOptionalStringField } from '@/lib/csv/repository';
import { toProjectViewModel } from '../projects/project-view-model';

export async function JsonLd() {
  const seo = await getSeoConfig();
  const projectItems = await getSection('project');
  const publicationItems = await getSection('publication');

  const projects = projectItems
    .filter(item => item.enabled)
    .map(toProjectViewModel)
    .sort((a, b) => a.order - b.order);

  const canonicalUrl = seo.canonicalUrl;
  const personId = `${canonicalUrl}#person`;
  const websiteId = `${canonicalUrl}#website`;

  // 1. Person Schema
  const personSchema = {
    '@type': 'Person',
    '@id': personId,
    name: seo.fullName,
    jobTitle: seo.role,
    description: seo.tagline,
    url: canonicalUrl,
    image: `${canonicalUrl}/assets/profile/hero-portrait.webp`,
    sameAs: [
      seo.githubUrl,
      seo.linkedinUrl
    ].filter(Boolean),
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Blekinge Institute of Technology',
        url: 'https://www.bth.se'
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Jawaharlal Nehru Technological University Kakinada',
        url: 'https://www.jntuk.edu.in'
      }
    ],
    knowsAbout: seo.keywords
  };

  // 2. WebSite Schema
  const websiteSchema = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: canonicalUrl,
    name: seo.siteName,
    description: seo.description,
    publisher: {
      '@id': personId
    },
    author: {
      '@id': personId
    },
    inLanguage: 'en-US'
  };

  // 3. ItemList Schema for Projects
  const projectsItemListSchema = {
    '@type': 'ItemList',
    '@id': `${canonicalUrl}#projects`,
    name: 'Selected Projects',
    description: 'A collection of machine learning, generative AI, and data engineering projects.',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.title,
        description: project.summary || project.shortDescription || '',
        url: project.githubUrl || project.demoUrl || project.publicationUrl || `${canonicalUrl}#work`,
        keywords: project.technologies.join(', '),
        creator: {
          '@id': personId
        }
      }
    }))
  };

  // 4. Report Schemas for Publications/Theses
  const publicationSchemas = publicationItems.map((pub) => {
    const title = requireStringField(pub, 'title');
    const summary = requireStringField(pub, 'summary');
    const authors = getStringArrayField(pub, 'author');
    const pubUrl = getOptionalStringField(pub, 'publication_url');

    return {
      '@type': 'Report',
      '@id': `${canonicalUrl}#publication-${pub.itemId}`,
      headline: title,
      description: summary,
      url: pubUrl || canonicalUrl,
      author: authors.map((authorName) => {
        if (authorName.toUpperCase() === seo.fullName.toUpperCase()) {
          return { '@id': personId };
        }
        return {
          '@type': 'Person',
          name: authorName
        };
      }),
      publisher: {
        '@type': 'EducationalOrganization',
        name: 'Blekinge Institute of Technology',
        url: 'https://www.bth.se'
      },
      mainEntityOfPage: pubUrl || canonicalUrl
    };
  });

  // Combine into a single graph
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      personSchema,
      websiteSchema,
      projectsItemListSchema,
      ...publicationSchemas
    ]
  };

  // Sanitize serialized JSON to prevent unsafe script termination
  const sanitizeJsonLd = (data: unknown) => {
    const json = JSON.stringify(data);
    return json
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(graph) }}
    />
  );
}
