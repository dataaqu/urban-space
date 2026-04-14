export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { deleteImageByUrl } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Clean up replaced images/videos from R2
    const existing = await prisma.heroSlide.findUnique({
      where: { id: params.id },
      select: { image: true, videoUrl: true },
    });

    if (existing) {
      if (existing.image && existing.image !== data.image) {
        await deleteImageByUrl(existing.image);
      }
      if (existing.videoUrl && existing.videoUrl !== (data.videoUrl || null)) {
        await deleteImageByUrl(existing.videoUrl);
      }
    }

    const slide = await prisma.heroSlide.update({
      where: { id: params.id },
      data: {
        image: data.image,
        videoUrl: data.videoUrl || null,
        type: data.type || 'IMAGE',
        titleKa: data.titleKa || null,
        titleEn: data.titleEn || null,
        active: data.active ?? true,
      },
    });
    return NextResponse.json(slide);
  } catch (error) {
    console.error('Update slide error:', error);
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Clean up R2 files before deleting
    const slide = await prisma.heroSlide.findUnique({
      where: { id: params.id },
      select: { image: true, videoUrl: true },
    });

    if (slide) {
      const deletePromises: Promise<void>[] = [];
      if (slide.image) deletePromises.push(deleteImageByUrl(slide.image));
      if (slide.videoUrl) deletePromises.push(deleteImageByUrl(slide.videoUrl));
      await Promise.allSettled(deletePromises);
    }

    await prisma.heroSlide.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete slide error:', error);
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}
