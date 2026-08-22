import { NextRequest } from 'next/server';
import { TripService } from '@/lib/services/trip.service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; activityId: string }> }
) {
  try {
    const { activityId } = await params;
    const actId = parseInt(activityId);
    if (isNaN(actId)) return apiError('Invalid activity ID', 400);

    const success = await TripService.deleteActivity(actId);
    if (!success) {
      return apiError('Activity not found or already removed', 404);
    }

    return apiSuccess({ deletedActivityId: actId }, 'Activity removed from schedule');
  } catch (err: any) {
    console.error('Error removing activity:', err);
    return apiError('Failed to remove activity', 500, err);
  }
}
