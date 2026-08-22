import { NextRequest } from 'next/server';
import { TripService } from '@/lib/services/trip.service';
import { apiSuccess, apiError } from '@/lib/api-response';
import { addStopSchema, reorderStopsSchema } from '@/lib/validations';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) return apiError('Invalid trip ID', 400);

    const body = await request.json();
    const validation = addStopSchema.safeParse(body);
    if (!validation.success) {
      return apiError(validation.error.issues[0].message, 400, validation.error.format());
    }

    const { cityId, arrivalDate, departureDate, stayCostEstimated, transportCostEstimated, notes } = validation.data;

    const newStop = await TripService.addStop({
      tripId,
      cityId,
      arrivalDate,
      departureDate,
      stayCostEstimated,
      transportCostEstimated,
      notes,
    });

    return apiSuccess(newStop, 'Stop added to trip', 201);
  } catch (err: any) {
    console.error('Error adding stop:', err);
    return apiError('Failed to add stop', 500, err);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) return apiError('Invalid trip ID', 400);

    const body = await request.json();
    const validation = reorderStopsSchema.safeParse(body);
    if (!validation.success) {
      return apiError(validation.error.issues[0].message, 400, validation.error.format());
    }

    await TripService.reorderStops(tripId, validation.data.stopOrders);
    return apiSuccess({ tripId }, 'Stops reordered successfully');
  } catch (err: any) {
    console.error('Error reordering stops:', err);
    return apiError('Failed to reorder stops', 500, err);
  }
}
