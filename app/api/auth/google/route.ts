import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const client = new OAuth2Client(CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter-super-secret-jwt-key-2026';
const SUPER_ADMIN_EMAIL = 'joshikaushald1596@gmail.com';

export async function POST(request: Request) {
  try {
    const { credential } = await request.json();
    if (!credential) {
      return NextResponse.json({ error: 'Missing credential' }, { status: 400 });
    }

    // 1. Verify Google Token with Google OAuth
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
      return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 });
    }

    const { email, name, sub: google_id, picture } = payload;
    const isSuperAdmin = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

    // 2. Check if user exists in PostgreSQL via Prisma
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // 3. Automatically create user with verified status
      user = await prisma.user.create({
        data: {
          name: name || (isSuperAdmin ? 'Kaushal Joshi (Super Admin)' : 'Traveler'),
          email,
          google_id,
          avatar_url: picture || null,
          role: isSuperAdmin ? 'admin' : 'traveler',
          is_verified: true,
          preferred_currency: 'USD',
        },
      });

      // Send Welcome Email
      try {
        const { sendGoogleWelcomeEmail } = await import('@/lib/email');
        await sendGoogleWelcomeEmail(email, name || 'Traveler');
      } catch (emailErr) {
        console.warn('Welcome email error:', emailErr);
      }
    } else {
      // If super admin email, always make sure role is admin
      const shouldUpdateRole = isSuperAdmin && user.role !== 'admin';
      if (!user.google_id || !user.is_verified || shouldUpdateRole) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            google_id,
            is_verified: true,
            role: isSuperAdmin ? 'admin' : user.role,
            avatar_url: user.avatar_url || picture || null,
          },
        });
      }
    }

    // 4. Generate standard JWT session
    const token = jwt.sign(
      { id: user.id, userId: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        message: 'Google Sign In successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url,
          preferred_currency: user.preferred_currency,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error during Google Auth' },
      { status: 500 }
    );
  }
}
