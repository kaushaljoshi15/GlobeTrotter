import { NextRequest } from 'next/server';
import { DestinationService } from '@/lib/services/destination.service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const continent = searchParams.get('continent') || undefined;
    const cost_index = searchParams.get('cost_index') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const destinations = await DestinationService.getDestinations({
      search,
      continent,
      cost_index,
      limit,
    });

    return apiSuccess(destinations, 'Destinations retrieved successfully');
  } catch (err: any) {
    console.error('Error fetching destinations:', err);
    return apiError('Failed to fetch destinations', 500, err);
  }
}
