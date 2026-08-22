import { NextRequest } from 'next/server';
import { TripService } from '@/lib/services/trip.service';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) {
      return apiError('Invalid trip ID', 400);
    }

    const trip = await TripService.getTripDetails(tripId);
    if (!trip) {
      return apiError('Trip not found', 404);
    }

    return apiSuccess(trip, 'Trip details retrieved');
  } catch (err: any) {
    console.error('Error getting trip details:', err);
    return apiError('Failed to get trip details', 500, err);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) {
      return apiError('Invalid trip ID', 400);
    }

    const user = getUserFromRequest(request);
    const body = await request.json();
    const userId = user?.id || body.userId || 1;

    const updated = await TripService.updateTrip(tripId, userId, body);
    if (!updated) {
      return apiError('Failed to update trip or unauthorized', 400);
    }

    return apiSuccess(updated, 'Trip updated successfully');
  } catch (err: any) {
    console.error('Error updating trip:', err);
    return apiError('Failed to update trip', 500, err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) {
      return apiError('Invalid trip ID', 400);
    }

    const user = getUserFromRequest(request);
    const userId = user?.id || 1;

    const success = await TripService.deleteTrip(tripId, userId);
    if (!success) {
      return apiError('Trip not found or could not be deleted', 404);
    }

    return apiSuccess({ deletedId: tripId }, 'Trip deleted successfully');
  } catch (err: any) {
    console.error('Error deleting trip:', err);
    return apiError('Failed to delete trip', 500, err);
  }
}
