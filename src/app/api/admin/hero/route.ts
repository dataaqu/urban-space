import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
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
    const maxOrder = await prisma.heroSlide.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const slide = await prisma.heroSlide.create({
      data: { ...data, order: (maxOrder?.order ?? -1) + 1 },
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
    // Batch update order
    await Promise.all(
      slides.map((slide: { id: string; order: number }) =>
        prisma.heroSlide.update({
          where: { id: slide.id },
          data: { order: slide.order },
        })
      )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reorder hero slides error:', error);
    return NextResponse.json({ error: 'Failed to reorder slides' }, { status: 500 });
  }
}
