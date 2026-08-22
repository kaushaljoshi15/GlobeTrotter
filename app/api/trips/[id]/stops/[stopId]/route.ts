import { NextRequest } from 'next/server';
import { TripService } from '@/lib/services/trip.service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  try {
    const { id, stopId } = await params;
    const tripId = parseInt(id);
    const parsedStopId = parseInt(stopId);

    if (isNaN(tripId) || isNaN(parsedStopId)) {
      return apiError('Invalid trip ID or stop ID', 400);
    }

    const success = await TripService.deleteStop(parsedStopId, tripId);
    if (!success) {
      return apiError('Stop not found or could not be removed', 404);
    }

    return apiSuccess({ deletedStopId: parsedStopId }, 'Stop removed from trip');
  } catch (err: any) {
    console.error('Error removing stop:', err);
    return apiError('Failed to remove stop', 500, err);
  }
}
