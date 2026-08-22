import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter-super-secret-jwt-key-2026';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // 2. Find user in database via Prisma
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 2.5 Check if user signed up with Google (no password)
    if (!user.password_hash) {
      return NextResponse.json({ error: 'This account was created with Google. Please use Google Sign In.' }, { status: 401 });
    }

    // 2.6 Check verification status
    if (!user.is_verified) {
      return NextResponse.json({ 
        error: 'Email not verified. Please check your email for the verification code.',
        requiresVerification: true 
      }, { status: 403 });
    }

    // 3. Check Password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 4. Generate JWT Token
    const token = jwt.sign(
      { id: user.id, userId: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Send success response with token
    return NextResponse.json(
      { 
        message: 'Login successful', 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          avatar_url: user.avatar_url,
          preferred_currency: user.preferred_currency,
        } 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}