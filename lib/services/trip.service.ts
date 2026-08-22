import prisma from '@/lib/prisma';

export class TripService {
  /**
   * List all trips for a user with aggregated relational metadata using Prisma
   */
  static async getUserTrips(userId: number, filters?: { search?: string; status?: string }) {
    const where: any = { user_id: userId };

    if (filters?.status && filters.status !== 'all') {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const trips = await prisma.trip.findMany({
      where,
      orderBy: [{ start_date: 'asc' }, { created_at: 'desc' }],
      include: {
        stops: {
          include: {
            destination: {
              select: { id: true, name: true, country: true, image_url: true },
            },
          },
        },
        expenses: {
          select: { amount: true },
        },
      },
    });

    return trips.map((t) => {
      const totalExpenses = t.expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);
      const destinations = t.stops.map((s) => s.destination);

      return {
        ...t,
        total_budget: Number(t.total_budget),
        total_stops: t.stops.length,
        total_expenses: totalExpenses,
        destinations,
      };
    });
  }

  /**
   * Create a new trip using Prisma
   */
  static async createTrip(data: {
    userId: number;
    title: string;
    description?: string;
    coverImageUrl?: string;
    startDate: string;
    endDate: string;
    totalBudget: number;
    currency?: string;
    isPublic?: boolean;
    status?: string;
  }) {
    const randomSlug = Math.random().toString(36).substring(2, 8);
    const sanitizedTitle = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const shareCode = `${sanitizedTitle}-${randomSlug}`;

    const trip = await prisma.trip.create({
      data: {
        user_id: data.userId,
        title: data.title,
        description: data.description || '',
        cover_image_url:
          data.coverImageUrl ||
          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        start_date: new Date(data.startDate),
        end_date: new Date(data.endDate),
        total_budget: data.totalBudget || 2000.0,
        currency: data.currency || 'USD',
        is_public: data.isPublic !== undefined ? data.isPublic : true,
        share_code: shareCode,
        status: data.status || 'planning',
      },
    });

    return {
      ...trip,
      total_budget: Number(trip.total_budget),
    };
  }

  /**
   * Get full trip hierarchy: Trip + Stops (ordered) + Activities + Expenses using Prisma
   */
  static async getTripDetails(tripId: number, userId?: number) {
    const where: any = { id: tripId };
    if (userId) where.user_id = userId;

    const trip = await prisma.trip.findFirst({
      where,
      include: {
        stops: {
          orderBy: [{ stop_order: 'asc' }, { arrival_date: 'asc' }],
          include: {
            destination: true,
            activities: {
              orderBy: [{ activity_date: 'asc' }, { start_time: 'asc' }],
              include: {
                activity: true,
              },
            },
          },
        },
        expenses: {
          orderBy: [{ expense_date: 'asc' }, { id: 'asc' }],
        },
      },
    });

    if (!trip) return null;

    return {
      ...trip,
      total_budget: Number(trip.total_budget),
      stops: trip.stops.map((stop) => ({
        ...stop,
        city_name: stop.destination.name,
        country: stop.destination.country,
        continent: stop.destination.continent,
        city_image_url: stop.destination.image_url,
        cost_index: stop.destination.cost_index,
        avg_daily_cost: Number(stop.destination.avg_daily_cost),
        local_currency: stop.destination.currency,
        latitude: stop.destination.latitude ? Number(stop.destination.latitude) : null,
        longitude: stop.destination.longitude ? Number(stop.destination.longitude) : null,
        stay_cost_estimated: Number(stop.stay_cost_estimated),
        transport_cost_estimated: Number(stop.transport_cost_estimated),
        activities: stop.activities.map((ta) => ({
          ...ta,
          cost: Number(ta.cost),
          original_activity_name: ta.activity?.name,
          original_description: ta.activity?.description,
          original_image_url: ta.activity?.image_url,
          original_rating: ta.activity?.rating ? Number(ta.activity.rating) : null,
          original_duration: ta.activity?.duration_hours ? Number(ta.activity.duration_hours) : null,
        })),
      })),
      expenses: trip.expenses.map((exp) => ({
        ...exp,
        amount: Number(exp.amount),
      })),
    };
  }

  /**
   * Update Trip details using Prisma
   */
  static async updateTrip(
    tripId: number,
    userId: number,
    data: {
      title?: string;
      description?: string;
      coverImageUrl?: string;
      startDate?: string;
      endDate?: string;
      totalBudget?: number;
      currency?: string;
      isPublic?: boolean;
      status?: string;
    }
  ) {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.coverImageUrl !== undefined) updateData.cover_image_url = data.coverImageUrl;
    if (data.startDate !== undefined) updateData.start_date = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.end_date = new Date(data.endDate);
    if (data.totalBudget !== undefined) updateData.total_budget = data.totalBudget;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.isPublic !== undefined) updateData.is_public = data.isPublic;
    if (data.status !== undefined) updateData.status = data.status;

    const updated = await prisma.trip.updateMany({
      where: { id: tripId, user_id: userId },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return prisma.trip.findUnique({ where: { id: tripId } });
  }

  /**
   * Delete Trip using Prisma
   */
  static async deleteTrip(tripId: number, userId: number) {
    const deleted = await prisma.trip.deleteMany({
      where: { id: tripId, user_id: userId },
    });
    return deleted.count > 0;
  }

  /**
   * Add a Stop to a Trip using Prisma
   */
  static async addStop(data: {
    tripId: number;
    cityId: number;
    arrivalDate: string;
    departureDate: string;
    stayCostEstimated?: number;
    transportCostEstimated?: number;
    notes?: string;
  }) {
    const maxOrder = await prisma.tripStop.aggregate({
      where: { trip_id: data.tripId },
      _max: { stop_order: true },
    });

    const nextOrder = (maxOrder._max.stop_order || 0) + 1;

    const stop = await prisma.tripStop.create({
      data: {
        trip_id: data.tripId,
        city_id: data.cityId,
        stop_order: nextOrder,
        arrival_date: new Date(data.arrivalDate),
        departure_date: new Date(data.departureDate),
        stay_cost_estimated: data.stayCostEstimated || 0,
        transport_cost_estimated: data.transportCostEstimated || 0,
        notes: data.notes || '',
      },
    });

    return {
      ...stop,
      stay_cost_estimated: Number(stop.stay_cost_estimated),
      transport_cost_estimated: Number(stop.transport_cost_estimated),
    };
  }

  /**
   * Reorder stops using Prisma
   */
  static async reorderStops(tripId: number, stopOrders: { stopId: number; order: number }[]) {
    await prisma.$transaction(
      stopOrders.map((item) =>
        prisma.tripStop.updateMany({
          where: { id: item.stopId, trip_id: tripId },
          data: { stop_order: item.order },
        })
      )
    );
    return true;
  }

  /**
   * Delete a Stop using Prisma
   */
  static async deleteStop(stopId: number, tripId: number) {
    const deleted = await prisma.tripStop.deleteMany({
      where: { id: stopId, trip_id: tripId },
    });
    return deleted.count > 0;
  }

  /**
   * Add Activity to Stop using Prisma
   */
  static async addActivity(data: {
    tripStopId: number;
    activityId?: number;
    customTitle?: string;
    category?: string;
    activityDate: string;
    startTime?: string;
    endTime?: string;
    cost?: number;
    notes?: string;
  }) {
    const act = await prisma.tripActivity.create({
      data: {
        trip_stop_id: data.tripStopId,
        activity_id: data.activityId || null,
        custom_title: data.customTitle || null,
        category: data.category || 'sightseeing',
        activity_date: new Date(data.activityDate),
        start_time: data.startTime || '10:00',
        end_time: data.endTime || '12:00',
        cost: data.cost || 0,
        notes: data.notes || '',
      },
    });

    return {
      ...act,
      cost: Number(act.cost),
    };
  }

  /**
   * Delete scheduled activity using Prisma
   */
  static async deleteActivity(activityId: number) {
    const deleted = await prisma.tripActivity.deleteMany({
      where: { id: activityId },
    });
    return deleted.count > 0;
  }

  /**
   * Get public trip by share code using Prisma
   */
  static async getTripByShareCode(shareCode: string) {
    const trip = await prisma.trip.findUnique({
      where: { share_code: shareCode },
    });
    if (!trip) return null;
    return this.getTripDetails(trip.id);
  }

  /**
   * Clone an existing trip into a new user's account using Prisma
   */
  static async cloneTrip(shareCode: string, targetUserId: number) {
    const sourceTrip = await this.getTripByShareCode(shareCode);
    if (!sourceTrip) return null;

    const clonedTrip = await this.createTrip({
      userId: targetUserId,
      title: `Copy of ${sourceTrip.title}`,
      description: sourceTrip.description || '',
      coverImageUrl: sourceTrip.cover_image_url || undefined,
      startDate: sourceTrip.start_date.toISOString().split('T')[0],
      endDate: sourceTrip.end_date.toISOString().split('T')[0],
      totalBudget: sourceTrip.total_budget,
      currency: sourceTrip.currency,
      isPublic: true,
      status: 'planning',
    });

    for (const stop of sourceTrip.stops) {
      const newStop = await this.addStop({
        tripId: clonedTrip.id,
        cityId: stop.city_id,
        arrivalDate: stop.arrival_date.toISOString().split('T')[0],
        departureDate: stop.departure_date.toISOString().split('T')[0],
        stayCostEstimated: stop.stay_cost_estimated,
        transportCostEstimated: stop.transport_cost_estimated,
        notes: stop.notes || '',
      });

      for (const act of stop.activities) {
        await this.addActivity({
          tripStopId: newStop.id,
          activityId: act.activity_id || undefined,
          customTitle: act.custom_title || undefined,
          category: act.category,
          activityDate: act.activity_date.toISOString().split('T')[0],
          startTime: act.start_time,
          endTime: act.end_time,
          cost: act.cost,
          notes: act.notes || '',
        });
      }
    }

    return clonedTrip;
  }
}
