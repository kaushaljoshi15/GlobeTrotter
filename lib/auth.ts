import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter-super-secret-jwt-key-2026';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function getUserFromRequest(request: Request): AuthUser | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded) return null;

    const userId = decoded.id || decoded.userId;
    if (!userId) return null;

    return {
      id: parseInt(userId),
      email: decoded.email || '',
      name: decoded.name || '',
      role: decoded.role || 'traveler',
    };
  } catch (err) {
    return null;
  }
}
