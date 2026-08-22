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
            stops: {
              include: {
                destination: {
                  select: { id: true, name: true, country: true },
                },
              },
            },
            expenses: { select: { amount: true } },
          },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!userData) return apiError('User not found', 404);

    const totalTrips = userData.trips.length;
    const citiesSet = new Set<string>();
    const countriesSet = new Set<string>();
    let totalBudget = 0;
    let totalSpent = 0;

    for (const t of userData.trips) {
      totalBudget += Number(t.total_budget || 0);
      t.stops.forEach((s) => {
        if (s.destination) {
          citiesSet.add(s.destination.name);
          countriesSet.add(s.destination.country);
        }
      });
      t.expenses.forEach((e) => (totalSpent += Number(e.amount || 0)));
    }

    const { trips, ...safeUser } = userData;

    // Recent trips preview
    const recentTrips = trips.slice(0, 3).map((t) => ({
      id: t.id,
      title: t.title,
      startDate: t.start_date,
      endDate: t.end_date,
      totalBudget: Number(t.total_budget),
      currency: t.currency,
      stopsCount: t.stops.length,
      status: t.status,
    }));

    return apiSuccess(
      {
        ...safeUser,
        stats: {
          total_trips: totalTrips,
          total_cities_visited: citiesSet.size,
          total_countries_visited: countriesSet.size,
          total_budget_planned: totalBudget,
          total_spent: totalSpent,
        },
        recentTrips,
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
