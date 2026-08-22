import { NextRequest } from 'next/server';
import { DestinationService } from '@/lib/services/destination.service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const destId = parseInt(id);
    if (isNaN(destId)) {
      return apiError('Invalid destination ID', 400);
    }

    const destination = await DestinationService.getDestinationById(destId);
    if (!destination) {
      return apiError('Destination not found', 404);
    }

    return apiSuccess(destination, 'Destination details retrieved');
  } catch (err: any) {
    console.error('Error fetching destination by id:', err);
    return apiError('Failed to fetch destination details', 500, err);
  }
}
