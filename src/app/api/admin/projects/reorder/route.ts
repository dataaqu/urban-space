export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface FeaturedItem {
  id: string;
  position: number;
}

interface DisplayItem {
  id: string;
  displayOrder: number;
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { featured, display } = body as {
      featured?: FeaturedItem[];
      display?: DisplayItem[];
    };

    const ops: Promise<unknown>[] = [];

    if (Array.isArray(featured)) {
      const featuredIds = featured.map((f) => f.id);

      ops.push(
        prisma.project.updateMany({
          where: { featured: true, id: { notIn: featuredIds } },
          data: { featured: false, featuredOrder: null },
        }),
      );

      for (const item of featured) {
        ops.push(
          prisma.project.update({
            where: { id: item.id },
            data: { featured: true, featuredOrder: item.position },
          }),
        );
      }
    }

    if (Array.isArray(display)) {
      for (const item of display) {
        ops.push(
          prisma.project.update({
            where: { id: item.id },
            data: { displayOrder: item.displayOrder },
          }),
        );
      }
    }

    await Promise.all(ops);
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reorder projects error:', error);
    return NextResponse.json(
      { error: 'Failed to reorder' },
      { status: 500 },
    );
  }
}
