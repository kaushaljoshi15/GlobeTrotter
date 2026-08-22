import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, country, continent, description, imageUrl, costIndex, avgDailyCost, currency, latitude, longitude, bestTimeToVisit } = body;

    if (!name || !country || !continent) {
      return apiError('City name, country, and continent are required', 400);
    }

    const newDest = await prisma.destination.create({
      data: {
        name,
        country,
        continent,
        description: description || '',
        image_url: imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        cost_index: costIndex || 'moderate',
        avg_daily_cost: avgDailyCost ? parseFloat(avgDailyCost) : 120.0,
        currency: currency || 'USD',
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        popularity_score: 90,
        best_time_to_visit: bestTimeToVisit || 'Year-round',
      },
    });

    return apiSuccess(newDest, 'Destination added to catalog successfully', 201);
  } catch (err: any) {
    console.error('Error creating destination:', err);
    return apiError('Failed to create destination', 500, err);
  }
}
