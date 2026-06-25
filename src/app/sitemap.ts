import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { SITE_URL, LOCALES } from '@/lib/seo';

// Built at request time — the project list comes from the DB, which Railway
// can't reach at build time.
export const dynamic = 'force-dynamic';

/** Paths (after the locale prefix) for the static public pages. */
const STATIC_PATHS = ['', '/studio', '/projects', '/contact'];

function languagesFor(path: string): Record<string, string> {
  return Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`]));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
        alternates: { languages: languagesFor(path) },
      });
    }
  }

  let projects: { slug: string; updatedAt: Date }[] = [];
  try {
    projects = await prisma.project.findMany({
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // DB unreachable — still return the static entries.
  }

  for (const project of projects) {
    const path = `/projects/${project.slug}`;
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: project.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages: languagesFor(path) },
      });
    }
  }

  return entries;
}
