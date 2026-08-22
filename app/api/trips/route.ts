import { NextRequest } from 'next/server';
import { TripService } from '@/lib/services/trip.service';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    // If not authenticated via JWT, fallback to demo user ID 1 or query param for preview
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

    const userId = user?.id || body.userId || 1;
    const { title, description, coverImageUrl, startDate, endDate, totalBudget, currency, isPublic, status } = body;

    if (!title || !startDate || !endDate) {
      return apiError('Title, start date, and end date are required', 400);
    }

    const newTrip = await TripService.createTrip({
      userId,
      title,
      description,
      coverImageUrl,
      startDate,
      endDate,
      totalBudget: totalBudget ? parseFloat(totalBudget) : 2000,
      currency: currency || 'USD',
      isPublic: isPublic !== undefined ? isPublic : true,
      status: status || 'planning',
    });

    return apiSuccess(newTrip, 'Trip created successfully', 201);
  } catch (err: any) {
    console.error('Error creating trip:', err);
    return apiError('Failed to create trip', 500, err);
  }
}
