export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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

    // Accept `categories` (array); fall back to legacy single `category`.
    const categories: string[] = Array.isArray(data.categories)
      ? Array.from(new Set(data.categories as string[]))
      : data.category
        ? [data.category]
        : [];
    const validCategories = ['ARCHITECTURE', 'URBAN'];
    if (categories.length === 0 || !categories.every((c) => validCategories.includes(c))) {
      return NextResponse.json({ error: 'At least one valid category is required' }, { status: 400 });
    }

    // Clean up old images if replaced
    const existing = await prisma.project.findUnique({
      where: { id: params.id },
      select: { featuredImage: true, mobileImage: true },
    });
    if (existing?.featuredImage && existing.featuredImage !== data.featuredImage) {
      await deleteImageByUrl(existing.featuredImage);
    }
    if (existing?.mobileImage && existing.mobileImage !== (data.mobileImage || null)) {
      await deleteImageByUrl(existing.mobileImage);
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        slug: data.slug,
        titleKa: data.titleKa,
        titleEn: data.titleEn,
        categories: categories as ('ARCHITECTURE' | 'URBAN')[],
        locationKa: data.locationKa || null,
        locationEn: data.locationEn || null,
        featuredImage: data.featuredImage || null,
        mobileImage: data.mobileImage || null,
        featured: data.featured || false,
        featuredOrder: data.featuredOrder || null,
      },
    });
    revalidatePath('/[locale]', 'layout');
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
      include: {
        pages: {
          select: { image1: true, image2: true, mobileImage1: true, mobileImage2: true },
        },
      },
    });

    if (project) {
      const deletePromises: Promise<void>[] = [];

      if (project.featuredImage) deletePromises.push(deleteImageByUrl(project.featuredImage));
      if (project.mobileImage) deletePromises.push(deleteImageByUrl(project.mobileImage));

      for (const page of project.pages) {
        if (page.image1) deletePromises.push(deleteImageByUrl(page.image1));
        if (page.image2) deletePromises.push(deleteImageByUrl(page.image2));
        if (page.mobileImage1) deletePromises.push(deleteImageByUrl(page.mobileImage1));
        if (page.mobileImage2) deletePromises.push(deleteImageByUrl(page.mobileImage2));
      }

      await Promise.allSettled(deletePromises);
    }

    await prisma.project.delete({ where: { id: params.id } });
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
