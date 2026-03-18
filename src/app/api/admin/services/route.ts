export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const maxOrder = await prisma.service.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const service = await prisma.service.create({
      data: { ...data, order: (maxOrder?.order ?? -1) + 1 },
    });
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}