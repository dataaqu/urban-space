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

    const project = await prisma.project.create({
      data: {
        slug: data.slug,
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
