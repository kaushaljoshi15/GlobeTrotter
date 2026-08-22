import { NextRequest } from 'next/server';
import { TripService } from '@/lib/services/trip.service';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareCode: string }> }
) {
  try {
    const { shareCode } = await params;
    if (!shareCode) return apiError('Share code is required', 400);

    const user = getUserFromRequest(request);
    const body = await request.json().catch(() => ({}));
    const targetUserId = user?.id || body.userId || 1;

    const clonedTrip = await TripService.cloneTrip(shareCode, targetUserId);
    if (!clonedTrip) {
      return apiError('Failed to clone trip or source trip not found', 404);
    }

    return apiSuccess(clonedTrip, 'Trip copied to your account successfully!', 201);
  } catch (err: any) {
    console.error('Error cloning trip:', err);
    return apiError('Failed to clone trip', 500, err);
  }
}
