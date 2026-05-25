export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Accept `categories` (array); fall back to legacy single `category`.
    const categories: string[] = Array.isArray(data.categories)
      ? data.categories
      : data.category
        ? [data.category]
        : [];

    if (!data.titleKa || !data.titleEn || categories.length === 0) {
      return NextResponse.json({ error: 'titleKa, titleEn and at least one category are required' }, { status: 400 });
    }

    const validCategories = ['ARCHITECTURE', 'URBAN'];
    const uniqueCategories = Array.from(new Set(categories));
    if (!uniqueCategories.every((c) => validCategories.includes(c))) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Generate slug from English title
    const baseSlug = (data.titleEn || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Ensure uniqueness by checking existing slugs
    let slug = baseSlug || `project-${Date.now()}`;
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    const project = await prisma.project.create({
      data: {
        slug,
        titleKa: data.titleKa,
        titleEn: data.titleEn,
        categories: uniqueCategories as ('ARCHITECTURE' | 'URBAN')[],
        locationKa: data.locationKa || null,
        locationEn: data.locationEn || null,
        featuredImage: data.featuredImage || null,
        mobileImage: data.mobileImage || null,
        featured: data.featured || false,
        featuredOrder: data.featuredOrder || null,
        pages: {
          create: {
            type: 'SINGLE_IMAGE',
            order: 0,
            image1: '',
          },
        },
      },
      include: { pages: true },
    });

    revalidatePath('/[locale]', 'layout');

    return NextResponse.json(project);
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
