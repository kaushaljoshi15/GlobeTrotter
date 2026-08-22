import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar_url: true,
        is_verified: true,
        created_at: true,
        _count: {
          select: { trips: true },
        },
      },
    });

    const formatted = users.map((u) => ({
      ...u,
      total_trips: u._count.trips,
    }));

    return apiSuccess(formatted, 'Users retrieved successfully');
  } catch (err: any) {
    console.error('Error fetching admin users:', err);
    return apiError('Failed to fetch users', 500, err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, password } = body;

    if (!email) {
      return apiError('Email is required', 400);
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Promote existing user to the specified role
      user = await prisma.user.update({
        where: { email },
        data: {
          role: role || 'admin',
          name: name || user.name,
        },
      });
      return apiSuccess(user, `User ${email} promoted to ${role || 'admin'}`);
    }

    // Create new admin / organizer user
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password || 'Admin@1596!', 10);

    const newUser = await prisma.user.create({
      data: {
        name: name || 'Admin Member',
        email,
        password_hash: hashedPassword,
        role: role || 'admin',
        is_verified: true,
      },
    });

    return apiSuccess(newUser, `New ${role || 'admin'} created successfully`, 201);
  } catch (err: any) {
    console.error('Error adding admin user:', err);
    return apiError('Failed to add admin user', 500, err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return apiError('User ID and role are required', 400);
    }

    const updated = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return apiSuccess(updated, 'User role updated successfully');
  } catch (err: any) {
    console.error('Error updating user role:', err);
    return apiError('Failed to update role', 500, err);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return apiError('User ID is required', 400);
    }

    await prisma.user.delete({
      where: { id: parseInt(userId) },
    });

    return apiSuccess({ id: parseInt(userId) }, 'User deleted successfully');
  } catch (err: any) {
    console.error('Error deleting user:', err);
    return apiError('Failed to delete user', 500, err);
  }
}
