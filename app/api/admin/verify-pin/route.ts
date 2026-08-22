import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { apiSuccess, apiError } from '@/lib/api-response';

const ADMIN_MASTER_PIN = '1596';
const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter-super-secret-jwt-key-2026';

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return apiError('PIN is required', 400);
    }

    if (pin.toString().trim() !== ADMIN_MASTER_PIN) {
      return apiError('Invalid Master Admin PIN. Access Denied.', 401);
    }

    // Generate Admin Session Access Token
    const adminToken = jwt.sign(
      { isPinVerified: true, role: 'admin', authorizedAt: new Date().toISOString() },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return apiSuccess(
      { adminToken, authorized: true, message: 'Admin PIN Verified Successfully' },
      'Access Granted'
    );
  } catch (err: any) {
    console.error('Error verifying admin pin:', err);
    return apiError('Internal Server Error', 500, err);
  }
}
