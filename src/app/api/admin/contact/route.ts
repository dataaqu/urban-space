export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const SINGLETON_ID = 'singleton';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const info = await prisma.contactInfo.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: { id: SINGLETON_ID },
  });

  return NextResponse.json(info);
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    const payload = {
      phone: data.phone || null,
      email: data.email || null,
      addressKa: data.addressKa || null,
      addressEn: data.addressEn || null,
      facebook: data.facebook || null,
      instagram: data.instagram || null,
      mapLat: data.mapLat !== undefined && data.mapLat !== '' ? Number(data.mapLat) : null,
      mapLng: data.mapLng !== undefined && data.mapLng !== '' ? Number(data.mapLng) : null,
    };

    const info = await prisma.contactInfo.upsert({
      where: { id: SINGLETON_ID },
      update: payload,
      create: { id: SINGLETON_ID, ...payload },
    });

    revalidatePath('/[locale]/contact', 'page');
    return NextResponse.json(info);
  } catch (error) {
    console.error('Update contact info error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
