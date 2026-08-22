import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { TripService } from '@/lib/services/trip.service';

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const body = await request.json();
    const { itinerary, userId: explicitUserId } = body;

    if (!itinerary) {
      return apiError('Missing itinerary payload', 400);
    }

    const userId = user?.id || explicitUserId || 1;

    // 1. Calculate Start & End Dates
    const today = new Date();
    const startDate = new Date(today.getTime() + 14 * 86400000); // 2 weeks from now
    const durationDays = itinerary.durationDays || 5;
    const endDate = new Date(startDate.getTime() + (durationDays - 1) * 86400000);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // 2. Create the Trip
    const newTrip = await TripService.createTrip({
      userId,
      title: itinerary.title || 'AI Generated Expedition',
      description: itinerary.overview || itinerary.tagline || 'Curated by GlobeTrotter AI Atelier',
      coverImageUrl: itinerary.coverImageUrl,
      startDate: startDateStr,
      endDate: endDateStr,
      totalBudget: parseFloat(itinerary.budget?.total || 2000),
      currency: itinerary.budget?.currency || 'USD',
      isPublic: true,
      status: 'planning',
    });

    // 3. Create Destination Stops & Activities
    if (itinerary.stops && Array.isArray(itinerary.stops)) {
      let stopOrder = 1;
      for (const stop of itinerary.stops) {
        // Find or create the destination in the catalog
        let destination = await prisma.destination.findFirst({
          where: { name: { contains: stop.cityName.split('&')[0].trim(), mode: 'insensitive' } },
        });

        if (!destination) {
          destination = await prisma.destination.create({
            data: {
              name: stop.cityName,
              country: stop.country || 'Global',
              continent: stop.continent || 'Asia',
              description: `Curated scenic stop in ${stop.cityName}`,
              image_url: stop.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
              cost_index: 'moderate',
              avg_daily_cost: 120.0,
              currency: itinerary.budget?.currency || 'USD',
              popularity_score: 95,
              best_time_to_visit: 'Spring / Autumn',
            },
          });
        }

        // Calculate stop arrival & departure
        const stopStayDays = stop.daysCount || 2;
        const stopArrival = new Date(startDate.getTime() + (stopOrder - 1) * stopStayDays * 86400000);
        const stopDeparture = new Date(stopArrival.getTime() + (stopStayDays - 1) * 86400000);

        const createdStop = await prisma.tripStop.create({
          data: {
            trip_id: newTrip.id,
            city_id: destination.id,
            stop_order: stopOrder,
            arrival_date: stopArrival,
            departure_date: stopDeparture,
            stay_cost_estimated: stop.stayCostEstimated || 150,
            transport_cost_estimated: stop.transportCostEstimated || 50,
            notes: stop.recommendedHotel ? `Recommended Stay: ${stop.recommendedHotel}` : '',
          },
        });

        // Insert Activities for this Stop
        if (stop.days && Array.isArray(stop.days)) {
          for (const day of stop.days) {
            const actDate = new Date(stopArrival.getTime() + (day.dateOffset || 0) * 86400000);
            if (day.activities && Array.isArray(day.activities)) {
              for (const act of day.activities) {
                await prisma.tripActivity.create({
                  data: {
                    trip_stop_id: createdStop.id,
                    custom_title: act.title,
                    category: act.category || 'sightseeing',
                    activity_date: actDate,
                    start_time: act.startTime || '10:00',
                    end_time: act.endTime || '12:30',
                    cost: act.cost || 0,
                    notes: act.description || '',
                    is_completed: false,
                  },
                });
              }
            }
          }
        }

        stopOrder++;
      }
    }

    return apiSuccess({ tripId: newTrip.id, shareCode: newTrip.share_code }, 'Itinerary saved to database successfully', 201);
  } catch (err: any) {
    console.error('Error saving AI itinerary to database:', err);
    return apiError('Failed to save AI itinerary to database', 500, err);
  }
}
