import { NextRequest } from 'next/server';
import { TripService } from '@/lib/services/trip.service';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { createTripSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const userId = user?.id || (searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : 1);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const trips = await TripService.getUserTrips(userId, { status, search });
    return apiSuccess(trips, 'Trips retrieved successfully');
  } catch (err: any) {
    console.error('Error fetching trips:', err);
    return apiError('Failed to fetch trips', 500, err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const body = await request.json();

    // Zod Schema Validation
    const validation = createTripSchema.safeParse(body);
    if (!validation.success) {
      return apiError(validation.error.issues[0].message, 400, validation.error.format());
    }

    const { title, description, coverImageUrl, startDate, endDate, totalBudget, currency, isPublic, status } =
      validation.data;
    const userId = user?.id || body.userId || 1;

    const newTrip = await TripService.createTrip({
      userId,
      title,
      description,
      coverImageUrl,
      startDate,
      endDate,
      totalBudget,
      currency,
      isPublic,
      status,
    });

    return apiSuccess(newTrip, 'Trip created successfully', 201);
  } catch (err: any) {
    console.error('Error creating trip:', err);
    return apiError('Failed to create trip', 500, err);
  }
}
