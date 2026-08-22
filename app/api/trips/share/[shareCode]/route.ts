import { NextRequest } from 'next/server';
import { TripService } from '@/lib/services/trip.service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareCode: string }> }
) {
  try {
    const { shareCode } = await params;
    if (!shareCode) return apiError('Share code is required', 400);

    const trip = await TripService.getTripByShareCode(shareCode);
    if (!trip) {
      return apiError('Public trip not found', 404);
    }

    return apiSuccess(trip, 'Public trip retrieved successfully');
  } catch (err: any) {
    console.error('Error fetching public trip by share code:', err);
    return apiError('Failed to fetch public trip', 500, err);
  }
}
