import { NextRequest } from 'next/server';
import { DestinationService } from '@/lib/services/destination.service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city_id = searchParams.get('city_id') ? parseInt(searchParams.get('city_id')!) : undefined;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const activities = await DestinationService.getActivities({
      city_id,
      category,
      search,
    });

    return apiSuccess(activities, 'Activities retrieved successfully');
  } catch (err: any) {
    console.error('Error fetching activities:', err);
    return apiError('Failed to fetch activities', 500, err);
  }
}
