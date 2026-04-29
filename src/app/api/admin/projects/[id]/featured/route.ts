export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const MAX_FEATURED = 5;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { featured } = (await request.json()) as { featured: boolean };

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { id: true, featured: true, featuredOrder: true },
    });
    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (featured) {
      if (project.featured) {
        return NextResponse.json({ success: true });
      }
      const featuredProjects = await prisma.project.findMany({
        where: { featured: true },
        select: { id: true, featuredOrder: true },
        orderBy: { featuredOrder: 'asc' },
      });
      if (featuredProjects.length >= MAX_FEATURED) {
        return NextResponse.json(
          { error: `მაქსიმუმ ${MAX_FEATURED} პროექტი შეიძლება მთავარ გვერდზე` },
          { status: 400 },
        );
      }
      const nextOrder = featuredProjects.length + 1;
      await prisma.project.update({
        where: { id: params.id },
        data: { featured: true, featuredOrder: nextOrder },
      });
    } else {
      if (!project.featured) {
        return NextResponse.json({ success: true });
      }
      const removed = project.featuredOrder ?? 999;
      await prisma.$transaction([
        prisma.project.update({
          where: { id: params.id },
          data: { featured: false, featuredOrder: null },
        }),
        prisma.project.updateMany({
          where: {
            featured: true,
            featuredOrder: { gt: removed },
          },
          data: {
            featuredOrder: { decrement: 1 },
          },
        }),
      ]);
    }

    revalidatePath('/[locale]', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Toggle featured error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle featured' },
      { status: 500 },
    );
  }
}
