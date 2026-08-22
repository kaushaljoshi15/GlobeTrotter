import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter-super-secret-jwt-key-2026';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    // 1. Find the code in the DB via Prisma
    const verificationRecord = await prisma.verificationCode.findFirst({
      where: { email, code },
      orderBy: { expires_at: 'desc' },
    });

    if (!verificationRecord) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 });
    }

    // 2. Check if expired
    if (new Date() > new Date(verificationRecord.expires_at)) {
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    // 3. Mark user as verified via Prisma
    const user = await prisma.user.update({
      where: { email },
      data: { is_verified: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        preferred_currency: true,
        avatar_url: true,
      },
    });

    // 4. Delete the code to prevent reuse
    await prisma.verificationCode.deleteMany({ where: { email } });

    // 5. Generate unified JWT token
    const token = jwt.sign(
      { id: user.id, userId: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      { message: 'Email verified successfully', token, user },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('OTP Verification Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
