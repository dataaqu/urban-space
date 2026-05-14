export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    const maxOrder = await prisma.projectPage.aggregate({
      where: { projectId: params.id },
      _max: { order: true },
    });

    const page = await prisma.projectPage.create({
      data: {
        projectId: params.id,
        type: data.type,
        order: (maxOrder._max.order ?? -1) + 1,
        image1: data.image1,
        image2: data.image2 || null,
        mobileImage1: data.mobileImage1 || null,
        mobileImage2: data.mobileImage2 || null,
        textRightKa: data.textRightKa || null,
        textRightEn: data.textRightEn || null,
      },
    });

    revalidatePath('/[locale]', 'layout');
    return NextResponse.json(page);
  } catch (error) {
    console.error('Create page error:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
