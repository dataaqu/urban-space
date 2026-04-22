import prisma from '@/lib/prisma';

export async function getHeroSlides() {
  try {
    return await prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  } catch {
    return [];
  }
}

export async function getFeaturedProjects() {
  try {
    return await prisma.project.findMany({
      where: { featured: true },
      include: {
        pages: {
          orderBy: { order: 'asc' },
          take: 1,
          select: { image1: true },
        },
      },
      orderBy: { featuredOrder: 'asc' },
      take: 8,
    });
  } catch {
    return [];
  }
}

export async function getSiteContent(section?: string) {
  try {
    const where = section ? { section } : {};
    return await prisma.siteContent.findMany({
      where,
      orderBy: [{ section: 'asc' }, { order: 'asc' }],
    });
  } catch {
    return [];
  }
}

export async function getContentMap(section: string) {
  const items = await getSiteContent(section);
  const map: Record<string, { ka: string; en: string }> = {};
  for (const item of items) {
    map[item.key] = { ka: item.valueKa, en: item.valueEn };
  }
  return map;
}

export async function getServices() {
  try {
    return await prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
  } catch {
    return [];
  }
}
