export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
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

    if (!data.titleKa || !data.titleEn || !data.category) {
      return NextResponse.json({ error: 'titleKa, titleEn, category are required' }, { status: 400 });
    }

    if (!['ARCHITECTURE', 'URBAN'].includes(data.category)) {
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
        category: data.category,
        locationKa: data.locationKa || null,
        locationEn: data.locationEn || null,
        featuredImage: data.featuredImage || null,
        featured: data.featured || false,
        featuredOrder: data.featuredOrder || null,
        pages: {
          create: {
            type: 'SINGLE_IMAGE',
            order: 0,
            image1: '',
            textKa: '',
            textEn: '',
          },
        },
      },
      include: { pages: true },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
