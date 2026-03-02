import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ProjectCategory, ProjectType, ProjectStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as ProjectCategory | null;
    const type = searchParams.get('type') as ProjectType | null;
    const status = searchParams.get('status') as ProjectStatus | null;
    const featured = searchParams.get('featured');

    const where: {
      category?: ProjectCategory;
      type?: ProjectType;
      status?: ProjectStatus;
      featured?: boolean;
    } = {};

    if (category) where.category = category;
    if (type) where.type = type;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        titleKa: true,
        titleEn: true,
        descriptionKa: true,
        descriptionEn: true,
        category: true,
        type: true,
        images: true,
        featured: true,
        status: true,
        year: true,
        location: true,
        area: true,
      },
    });

    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const project = await prisma.project.create({
      data: {
        slug: body.slug,
        titleKa: body.titleKa,
        titleEn: body.titleEn,
        descriptionKa: body.descriptionKa,
        descriptionEn: body.descriptionEn,
        category: body.category,
        type: body.type,
        images: body.images || [],
        featured: body.featured || false,
        status: body.status || 'COMPLETED',
        year: body.year,
        location: body.location,
        area: body.area,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
