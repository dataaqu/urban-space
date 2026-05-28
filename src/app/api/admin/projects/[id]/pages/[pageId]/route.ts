export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { deleteImageByUrl } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; pageId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Clean up replaced images from R2
    const existing = await prisma.projectPage.findUnique({
      where: { id: params.pageId },
      select: { image1: true, image2: true, mobileImage1: true, mobileImage2: true },
    });

    if (existing) {
      if (existing.image1 && existing.image1 !== data.image1) {
        await deleteImageByUrl(existing.image1);
      }
      if (existing.image2 && existing.image2 !== (data.image2 || null)) {
        await deleteImageByUrl(existing.image2);
      }
      if (existing.mobileImage1 && existing.mobileImage1 !== (data.mobileImage1 || null)) {
        await deleteImageByUrl(existing.mobileImage1);
      }
      if (existing.mobileImage2 && existing.mobileImage2 !== (data.mobileImage2 || null)) {
        await deleteImageByUrl(existing.mobileImage2);
      }
    }

    const page = await prisma.projectPage.update({
      where: { id: params.pageId },
      data: {
        image1: data.image1,
        image2: data.image2 || null,
        mobileImage1: data.mobileImage1 || null,
        mobileImage2: data.mobileImage2 || null,
        textRightKa: data.textRightKa || null,
        textRightEn: data.textRightEn || null,
        metaInfoKa: data.metaInfoKa || null,
        metaInfoEn: data.metaInfoEn || null,
      },
    });
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json(page);
  } catch (error) {
    console.error('Update page error:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; pageId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Clean up R2 images before deleting
    const page = await prisma.projectPage.findUnique({
      where: { id: params.pageId },
      select: { image1: true, image2: true, mobileImage1: true, mobileImage2: true },
    });

    if (page) {
      const deletePromises: Promise<void>[] = [];
      if (page.image1) deletePromises.push(deleteImageByUrl(page.image1));
      if (page.image2) deletePromises.push(deleteImageByUrl(page.image2));
      if (page.mobileImage1) deletePromises.push(deleteImageByUrl(page.mobileImage1));
      if (page.mobileImage2) deletePromises.push(deleteImageByUrl(page.mobileImage2));
      await Promise.allSettled(deletePromises);
    }

    await prisma.projectPage.delete({ where: { id: params.pageId } });
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete page error:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
