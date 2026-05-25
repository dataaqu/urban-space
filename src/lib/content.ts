import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';

export const getHeroSlides = unstable_cache(
  async () => {
    try {
      return await prisma.heroSlide.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
      });
    } catch {
      return [];
    }
  },
  ['hero-slides'],
  { revalidate: 300, tags: ['hero-slides'] },
);

export const getFeaturedProjects = unstable_cache(
  async () => {
    try {
      return await prisma.project.findMany({
        where: { featured: true },
        include: {
          pages: {
            orderBy: { order: 'asc' },
            take: 1,
            select: { image1: true, mobileImage1: true },
          },
        },
        orderBy: { featuredOrder: 'asc' },
        take: 8,
      });
    } catch {
      return [];
    }
  },
  ['featured-projects'],
  { revalidate: 300, tags: ['featured-projects', 'projects'] },
);

const getSiteContentCached = unstable_cache(
  async (section: string) => {
    try {
      const where = section ? { section } : {};
      return await prisma.siteContent.findMany({
        where,
        orderBy: [{ section: 'asc' }, { order: 'asc' }],
      });
    } catch {
      return [];
    }
  },
  ['site-content'],
  { revalidate: 300, tags: ['site-content'] },
);

export async function getSiteContent(section?: string) {
  return getSiteContentCached(section ?? '');
}

export async function getContentMap(section: string) {
  const items = await getSiteContentCached(section);
  const map: Record<string, { ka: string; en: string }> = {};
  for (const item of items) {
    map[item.key] = { ka: item.valueKa, en: item.valueEn };
  }
  return map;
}

export { parseMapCoords } from './map-coords';

export const getServices = unstable_cache(
  async () => {
    try {
      return await prisma.service.findMany({
        orderBy: { order: 'asc' },
      });
    } catch {
      return [];
    }
  },
  ['services'],
  { revalidate: 600, tags: ['services'] },
);
