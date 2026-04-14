export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: 'asc' },
  });

  return NextResponse.json(slides);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    const maxOrder = await prisma.heroSlide.aggregate({
      _max: { order: true },
    });

    const slide = await prisma.heroSlide.create({
      data: {
        image: data.image,
        videoUrl: data.videoUrl || null,
        type: data.type || 'IMAGE',
        titleKa: data.titleKa || null,
        titleEn: data.titleEn || null,
        order: (maxOrder._max.order ?? -1) + 1,
        active: data.active ?? true,
      },
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Create hero slide error:', error);
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slides } = await request.json();

    await Promise.all(
      slides.map((s: { id: string; order: number }) =>
        prisma.heroSlide.update({
          where: { id: s.id },
          data: { order: s.order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
  }
}
