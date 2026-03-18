export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const section = request.nextUrl.searchParams.get('section');

  const where = section ? { section } : {};
  const content = await prisma.siteContent.findMany({
    where,
    orderBy: [{ section: 'asc' }, { order: 'asc' }],
  });

  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { items } = await request.json();

    await Promise.all(
      items.map((item: any) =>
        prisma.siteContent.upsert({
          where: {
            section_key: { section: item.section, key: item.key },
          },
          update: {
            valueKa: item.valueKa,
            valueEn: item.valueEn,
          },
          create: {
            section: item.section,
            key: item.key,
            valueKa: item.valueKa,
            valueEn: item.valueEn,
            type: item.type || 'TEXT',
            order: item.order || 0,
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}