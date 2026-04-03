export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { deleteImage } from '@/lib/cloudinary';

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

function getR2Key(url: string): string | null {
  if (!url || !url.startsWith(R2_PUBLIC_URL)) return null;
  return url.replace(R2_PUBLIC_URL + '/', '');
}

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
    const slide = await prisma.heroSlide.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(slide);
  } catch (error) {
    console.error('Update hero slide error:', error);
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
    const slide = await prisma.heroSlide.findUnique({ where: { id: params.id } });

    if (slide) {
      const imageKey = getR2Key(slide.image);
      if (imageKey) {
        try { await deleteImage(imageKey); } catch {}
      }

      if (slide.videoUrl) {
        const videoKey = getR2Key(slide.videoUrl);
        if (videoKey) {
          try { await deleteImage(videoKey); } catch {}
        }
      }
    }

    await prisma.heroSlide.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete hero slide error:', error);
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}
