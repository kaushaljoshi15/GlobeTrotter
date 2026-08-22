import { NextRequest } from 'next/server';
import { TripService } from '@/lib/services/trip.service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) return apiError('Invalid trip ID', 400);

    const body = await request.json();
    const { tripStopId, activityId, customTitle, category, activityDate, startTime, endTime, cost, notes } = body;

    if (!tripStopId || !activityDate) {
      return apiError('Stop ID and activity date are required', 400);
    }

    const activity = await TripService.addActivity({
      tripStopId: parseInt(tripStopId),
      activityId: activityId ? parseInt(activityId) : undefined,
      customTitle,
      category,
      activityDate,
      startTime,
      endTime,
      cost: cost ? parseFloat(cost) : 0,
      notes,
    });

    return apiSuccess(activity, 'Activity scheduled successfully', 201);
  } catch (err: any) {
    console.error('Error scheduling activity:', err);
    return apiError('Failed to schedule activity', 500, err);
  }
}
