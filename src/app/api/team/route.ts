export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const teamMember = await prisma.teamMember.create({
      data: {
        nameKa: body.nameKa,
        nameEn: body.nameEn,
        positionKa: body.positionKa,
        positionEn: body.positionEn,
        image: body.image,
        order: body.order || 0,
      },
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}