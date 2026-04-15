export const revalidate = 60;

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const include = { pages: { orderBy: { order: 'asc' as const } } };
    const project =
      await prisma.project.findUnique({ where: { slug: params.id }, include }) ||
      await prisma.project.findUnique({ where: { id: params.id }, include });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}
