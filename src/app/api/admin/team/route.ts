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
    const maxOrder = await prisma.teamMember.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const member = await prisma.teamMember.create({
      data: { ...data, order: (maxOrder?.order ?? -1) + 1 },
    });
    return NextResponse.json(member);
  } catch (error) {
    console.error('Create team member error:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
