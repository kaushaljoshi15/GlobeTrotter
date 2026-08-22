import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const userId = user?.id || (searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : 1);

    const saved = await prisma.userSavedDestination.findMany({
      where: { user_id: userId },
      include: {
        destination: true,
      },
      orderBy: { created_at: 'desc' },
    });

    const destinations = saved.map((s) => ({
      ...s.destination,
      avg_daily_cost: Number(s.destination.avg_daily_cost),
      saved_at: s.created_at,
    }));

    return apiSuccess(destinations, 'Saved destinations retrieved');
  } catch (err: any) {
    console.error('Error fetching saved destinations:', err);
    return apiError('Failed to fetch saved destinations', 500, err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const body = await request.json();
    const userId = user?.id || body.userId || 1;
    const { destinationId } = body;

    if (!destinationId) return apiError('Destination ID is required', 400);

    await prisma.userSavedDestination.upsert({
      where: {
        user_id_destination_id: {
          user_id: userId,
          destination_id: parseInt(destinationId),
        },
      },
      create: {
        user_id: userId,
        destination_id: parseInt(destinationId),
      },
      update: {},
    });

    return apiSuccess({ destinationId }, 'Destination saved to wishlist', 201);
  } catch (err: any) {
    console.error('Error saving destination:', err);
    return apiError('Failed to save destination', 500, err);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const userId = user?.id || (searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : 1);
    const destinationId = searchParams.get('destinationId');

    if (!destinationId) return apiError('Destination ID is required', 400);

    await prisma.userSavedDestination.deleteMany({
      where: {
        user_id: userId,
        destination_id: parseInt(destinationId),
      },
    });

    return apiSuccess({ destinationId: parseInt(destinationId) }, 'Destination removed from wishlist');
  } catch (err: any) {
    console.error('Error removing saved destination:', err);
    return apiError('Failed to remove destination', 500, err);
  }
}
