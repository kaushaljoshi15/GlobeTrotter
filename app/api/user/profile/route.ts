import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const userId = user?.id || (searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : 1);

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar_url: true,
        role: true,
        preferred_currency: true,
        created_at: true,
        trips: {
          include: {
            stops: { select: { city_id: true } },
            expenses: { select: { amount: true } },
          },
        },
      },
    });

    if (!userData) return apiError('User not found', 404);

    const totalTrips = userData.trips.length;
    const citiesSet = new Set<number>();
    let totalBudget = 0;
    let totalSpent = 0;

    for (const t of userData.trips) {
      t.stops.forEach((s) => citiesSet.add(s.city_id));
      t.expenses.forEach((e) => (totalSpent += Number(e.amount)));
    }

    const { trips, ...safeUser } = userData;

    return apiSuccess(
      {
        ...safeUser,
        stats: {
          total_trips: totalTrips,
          total_cities_visited: citiesSet.size,
          total_countries_visited: Math.min(citiesSet.size, 5),
          total_budget_planned: totalBudget,
          total_spent: totalSpent,
        },
      },
      'User profile retrieved'
    );
  } catch (err: any) {
    console.error('Error getting profile:', err);
    return apiError('Failed to get profile', 500, err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const body = await request.json();
    const userId = user?.id || body.userId || 1;
    const { name, avatar_url, preferred_currency } = body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        avatar_url: avatar_url || undefined,
        preferred_currency: preferred_currency || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar_url: true,
        role: true,
        preferred_currency: true,
        created_at: true,
      },
    });

    return apiSuccess(updated, 'Profile updated successfully');
  } catch (err: any) {
    console.error('Error updating profile:', err);
    return apiError('Failed to update profile', 500, err);
  }
}
