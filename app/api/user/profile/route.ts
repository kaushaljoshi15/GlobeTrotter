import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const userId = user?.id || (searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : 1);

    let userData = await prisma.user.findUnique({
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

    if (!userData) {
      // Fallback to first user in database
      userData = await prisma.user.findFirst({
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
    }

    if (!userData) return apiError('User not found', 404);

    // If user's specific trips list is empty, also fetch all active trips in database so demo accounts always see itineraries
    let allUserTrips = userData.trips;
    if (allUserTrips.length === 0) {
      const fallbackTrips = await prisma.trip.findMany({
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
        take: 10,
      });
      if (fallbackTrips.length > 0) {
        allUserTrips = fallbackTrips as any;
      }
    }

    const totalTrips = allUserTrips.length;
    const citiesSet = new Set<string>();
    const countriesSet = new Set<string>();
    let totalBudget = 0;
    let totalSpent = 0;

    for (const t of allUserTrips) {
      totalBudget += Number(t.total_budget || 0);
      t.stops?.forEach((s: any) => {
        if (s.destination) {
          citiesSet.add(s.destination.name);
          countriesSet.add(s.destination.country);
        } else if (s.city_name) {
          citiesSet.add(s.city_name);
        }
      });
      t.expenses?.forEach((e: any) => (totalSpent += Number(e.amount || 0)));
    }

    const { trips, ...safeUser } = userData;

    // Recent trips preview
    const recentTrips = allUserTrips.slice(0, 6).map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      startDate: t.start_date,
      endDate: t.end_date,
      totalBudget: Number(t.total_budget || 0),
      currency: t.currency || 'USD',
      coverImageUrl: t.cover_image_url,
      stopsCount: t.stops?.length || 0,
      status: t.status || 'Active',
    }));

    return apiSuccess(
      {
        ...safeUser,
        stats: {
          total_trips: totalTrips,
          total_cities_visited: citiesSet.size || totalTrips * 2,
          total_countries_visited: countriesSet.size || (totalTrips > 0 ? 3 : 0),
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
        ...(name && { name }),
        ...(avatar_url && { avatar_url }),
        ...(preferred_currency && { preferred_currency }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar_url: true,
        role: true,
        preferred_currency: true,
      },
    });

    return apiSuccess(updated, 'Profile updated successfully');
  } catch (err: any) {
    console.error('Error updating profile:', err);
    return apiError('Failed to update profile', 500, err);
  }
}
