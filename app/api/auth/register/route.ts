import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

// Master Admin Email & Passcode
const SUPER_ADMIN_EMAIL = 'joshikaushald1596@gmail.com';
const ADMIN_MASTER_PASSCODE = '1596';

export async function POST(request: Request) {
  try {
    const { name, email, password, role, adminPasscode } = await request.json();

    // 1. Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Password complexity check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.' },
        { status: 400 }
      );
    }

    // 2. Role Security Check
    let assignedRole = role;

    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      // Super Admin is always granted admin role
      assignedRole = 'admin';
    } else if (role === 'admin') {
      // Other users registering as Admin must provide Master Passcode (1596)
      if (!adminPasscode || adminPasscode.toString().trim() !== ADMIN_MASTER_PASSCODE) {
        return NextResponse.json(
          { error: 'Invalid Admin Passcode. Please enter the master passcode (1596) to register as an Administrator.' },
          { status: 403 }
        );
      }
      assignedRole = 'admin';
    }

    // 3. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      let errorMessage = 'This email is already registered. Please go to the Login page.';
      if (existingUser.google_id && !existingUser.password_hash) {
        errorMessage = 'This email was registered using Google. Please click "Continue with Google" on the Login page.';
      }
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Insert into Database via Prisma
    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
        role: assignedRole,
        is_verified: false,
        preferred_currency: 'USD',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // 6. Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 7. Save OTP to verification_codes table
    await prisma.verificationCode.deleteMany({ where: { email } });
    await prisma.verificationCode.create({
      data: {
        email,
        code: otpCode,
        expires_at: expiresAt,
      },
    });

    // 8. Send the OTP via Email
    try {
      const { sendOTP } = await import('@/lib/email');
      await sendOTP(email, otpCode);
    } catch (emailErr) {
      console.warn('Failed to send email OTP:', emailErr);
    }

    return NextResponse.json(
      { message: 'Registration initiated. Please verify your email.', user: createdUser, requiresVerification: true },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}