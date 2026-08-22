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
    const { cityId, arrivalDate, departureDate, stayCostEstimated, transportCostEstimated, notes } = body;

    if (!cityId || !arrivalDate || !departureDate) {
      return apiError('City, arrival date, and departure date are required', 400);
    }

    const newStop = await TripService.addStop({
      tripId,
      cityId: parseInt(cityId),
      arrivalDate,
      departureDate,
      stayCostEstimated: stayCostEstimated ? parseFloat(stayCostEstimated) : 0,
      transportCostEstimated: transportCostEstimated ? parseFloat(transportCostEstimated) : 0,
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
    const { stopOrders } = body; // Array of { stopId: number, order: number }

    if (!Array.isArray(stopOrders)) {
      return apiError('stopOrders array is required', 400);
    }

    await TripService.reorderStops(tripId, stopOrders);
    return apiSuccess({ tripId }, 'Stops reordered successfully');
  } catch (err: any) {
    console.error('Error reordering stops:', err);
    return apiError('Failed to reorder stops', 500, err);
  }
}
