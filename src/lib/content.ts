import prisma from '@/lib/prisma';

export async function getHeroSlides() {
  return prisma.heroSlide.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  });
}

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  return settings;
}

export async function getSiteContent(section?: string) {
  const where = section ? { section } : {};
  return prisma.siteContent.findMany({
    where,
    orderBy: [{ section: 'asc' }, { order: 'asc' }],
  });
}

export async function getContentMap(section: string) {
  const items = await getSiteContent(section);
  const map: Record<string, { ka: string; en: string }> = {};
  for (const item of items) {
    map[item.key] = { ka: item.valueKa, en: item.valueEn };
  }
  return map;
}

export async function getTeamMembers() {
  return prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function getPartners() {
  return prisma.partner.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function getServices() {
  return prisma.service.findMany({
    orderBy: { order: 'asc' },
  });
}
