import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const SINGLETON_ID = 'singleton';

export async function GET() {
  const info = await prisma.contactInfo.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: { id: SINGLETON_ID },
  });
  return NextResponse.json(info);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'name, email, message are required' },
        { status: 400 },
      );
    }

    if (typeof data.email !== 'string' || !data.email.includes('@')) {
      return NextResponse.json({ error: 'invalid email' }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name: String(data.name).slice(0, 200),
        email: String(data.email).slice(0, 200),
        phone: data.phone ? String(data.phone).slice(0, 100) : null,
        message: String(data.message).slice(0, 5000),
      },
    });

    return NextResponse.json({ id: submission.id });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
