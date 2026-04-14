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

    // Clean up old featured image if replaced
    const existing = await prisma.project.findUnique({ where: { id: params.id }, select: { featuredImage: true } });
    if (existing?.featuredImage && existing.featuredImage !== data.featuredImage) {
      await deleteImageByUrl(existing.featuredImage);
    }

    const project = await prisma.project.update({
      where: { id: params.id },
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
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
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
    // Fetch project with all pages to clean up R2 images
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { pages: { select: { image1: true, image2: true } } },
    });

    if (project) {
      const deletePromises: Promise<void>[] = [];

      if (project.featuredImage) deletePromises.push(deleteImageByUrl(project.featuredImage));

      for (const page of project.pages) {
        if (page.image1) deletePromises.push(deleteImageByUrl(page.image1));
        if (page.image2) deletePromises.push(deleteImageByUrl(page.image2));
      }

      await Promise.allSettled(deletePromises);
    }

    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
