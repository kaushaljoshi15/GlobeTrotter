import { query } from '@/lib/db';

export class TripService {
  /**
   * List all trips for a user with aggregated metadata (stop count, cities visited, expense totals)
   */
  static async getUserTrips(userId: number, filters?: { search?: string; status?: string }) {
    let sql = `
      SELECT 
        t.*,
        COUNT(DISTINCT s.id)::int as total_stops,
        COALESCE(SUM(e.amount), 0)::numeric(12, 2) as total_expenses,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('id', d.id, 'name', d.name, 'country', d.country, 'image_url', d.image_url)
          ) FILTER (WHERE d.id IS NOT NULL), '[]'
        ) as destinations
      FROM trips t
      LEFT JOIN trip_stops s ON t.id = s.trip_id
      LEFT JOIN destinations d ON s.city_id = d.id
      LEFT JOIN trip_expenses e ON t.id = e.trip_id
      WHERE t.user_id = $1
    `;
    const params: any[] = [userId];
    let paramIdx = 2;

    if (filters?.status && filters.status !== 'all') {
      sql += ` AND t.status = $${paramIdx}`;
      params.push(filters.status);
      paramIdx++;
    }

    if (filters?.search) {
      sql += ` AND (t.title ILIKE $${paramIdx} OR t.description ILIKE $${paramIdx})`;
      params.push(`%${filters.search}%`);
      paramIdx++;
    }

    sql += ` GROUP BY t.id ORDER BY t.start_date ASC, t.created_at DESC`;
    const res = await query(sql, params);
    return res.rows;
  }

  /**
   * Create a new trip
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

    const res = await query(
      `INSERT INTO trips 
        (user_id, title, description, cover_image_url, start_date, end_date, total_budget, currency, is_public, share_code, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        data.userId,
        data.title,
        data.description || '',
        data.coverImageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        data.startDate,
        data.endDate,
        data.totalBudget || 2000.00,
        data.currency || 'USD',
        data.isPublic !== undefined ? data.isPublic : true,
        shareCode,
        data.status || 'planning',
      ]
    );

    return res.rows[0];
  }

  /**
   * Get full trip hierarchy: Trip + Stops (ordered) + Activities + Expenses
   */
  static async getTripDetails(tripId: number, userId?: number) {
    // 1. Fetch Trip info
    const tripSql = userId
      ? 'SELECT * FROM trips WHERE id = $1 AND user_id = $2'
      : 'SELECT * FROM trips WHERE id = $1';
    const tripParams = userId ? [tripId, userId] : [tripId];
    const tripRes = await query(tripSql, tripParams);

    if (tripRes.rows.length === 0) return null;
    const trip = tripRes.rows[0];

    // 2. Fetch Stops with City information
    const stopsRes = await query(
      `SELECT 
        s.*,
        d.name as city_name,
        d.country,
        d.continent,
        d.image_url as city_image_url,
        d.cost_index,
        d.avg_daily_cost,
        d.currency as local_currency,
        d.latitude,
        d.longitude
      FROM trip_stops s
      JOIN destinations d ON s.city_id = d.id
      WHERE s.trip_id = $1
      ORDER BY s.stop_order ASC, s.arrival_date ASC`,
      [tripId]
    );

    const stops = stopsRes.rows;

    // 3. Fetch all scheduled activities for this trip's stops
    const activitiesRes = await query(
      `SELECT 
        ta.*,
        a.name as original_activity_name,
        a.description as original_description,
        a.image_url as original_image_url,
        a.rating as original_rating,
        a.duration_hours as original_duration
      FROM trip_activities ta
      LEFT JOIN activities a ON ta.activity_id = a.id
      WHERE ta.trip_stop_id IN (SELECT id FROM trip_stops WHERE trip_id = $1)
      ORDER BY ta.activity_date ASC, ta.start_time ASC`,
      [tripId]
    );

    // 4. Fetch expenses
    const expensesRes = await query(
      `SELECT * FROM trip_expenses WHERE trip_id = $1 ORDER BY expense_date ASC, id ASC`,
      [tripId]
    );

    // Group activities by stop_id
    const activitiesByStop: { [stopId: number]: any[] } = {};
    for (const act of activitiesRes.rows) {
      if (!activitiesByStop[act.trip_stop_id]) {
        activitiesByStop[act.trip_stop_id] = [];
      }
      activitiesByStop[act.trip_stop_id].push(act);
    }

    const stopsWithActivities = stops.map((stop) => ({
      ...stop,
      activities: activitiesByStop[stop.id] || [],
    }));

    return {
      ...trip,
      stops: stopsWithActivities,
      expenses: expensesRes.rows,
    };
  }

  /**
   * Update Trip details
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
    const res = await query(
      `UPDATE trips
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           cover_image_url = COALESCE($3, cover_image_url),
           start_date = COALESCE($4, start_date),
           end_date = COALESCE($5, end_date),
           total_budget = COALESCE($6, total_budget),
           currency = COALESCE($7, currency),
           is_public = COALESCE($8, is_public),
           status = COALESCE($9, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [
        data.title,
        data.description,
        data.coverImageUrl,
        data.startDate,
        data.endDate,
        data.totalBudget,
        data.currency,
        data.isPublic,
        data.status,
        tripId,
        userId,
      ]
    );
    return res.rows[0] || null;
  }

  /**
   * Delete Trip
   */
  static async deleteTrip(tripId: number, userId: number) {
    const res = await query('DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id', [tripId, userId]);
    return res.rows.length > 0;
  }

  /**
   * Add a Stop (City) to a Trip
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
    // Determine next stop_order
    const maxOrderRes = await query(
      'SELECT COALESCE(MAX(stop_order), 0) + 1 as next_order FROM trip_stops WHERE trip_id = $1',
      [data.tripId]
    );
    const nextOrder = maxOrderRes.rows[0].next_order;

    const res = await query(
      `INSERT INTO trip_stops 
        (trip_id, city_id, stop_order, arrival_date, departure_date, stay_cost_estimated, transport_cost_estimated, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.tripId,
        data.cityId,
        nextOrder,
        data.arrivalDate,
        data.departureDate,
        data.stayCostEstimated || 0.00,
        data.transportCostEstimated || 0.00,
        data.notes || '',
      ]
    );

    return res.rows[0];
  }

  /**
   * Reorder stops
   */
  static async reorderStops(tripId: number, stopOrders: { stopId: number; order: number }[]) {
    for (const item of stopOrders) {
      await query(
        'UPDATE trip_stops SET stop_order = $1 WHERE id = $2 AND trip_id = $3',
        [item.order, item.stopId, tripId]
      );
    }
    return true;
  }

  /**
   * Delete a Stop
   */
  static async deleteStop(stopId: number, tripId: number) {
    const res = await query('DELETE FROM trip_stops WHERE id = $1 AND trip_id = $2 RETURNING id', [stopId, tripId]);
    return res.rows.length > 0;
  }

  /**
   * Add Activity to Stop
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
    const res = await query(
      `INSERT INTO trip_activities 
        (trip_stop_id, activity_id, custom_title, category, activity_date, start_time, end_time, cost, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        data.tripStopId,
        data.activityId || null,
        data.customTitle || null,
        data.category || 'sightseeing',
        data.activityDate,
        data.startTime || '10:00',
        data.endTime || '12:00',
        data.cost || 0.00,
        data.notes || '',
      ]
    );
    return res.rows[0];
  }

  /**
   * Toggle or delete scheduled activity
   */
  static async deleteActivity(activityId: number) {
    const res = await query('DELETE FROM trip_activities WHERE id = $1 RETURNING id', [activityId]);
    return res.rows.length > 0;
  }

  /**
   * Get public trip by share code
   */
  static async getTripByShareCode(shareCode: string) {
    const tripRes = await query('SELECT * FROM trips WHERE share_code = $1', [shareCode]);
    if (tripRes.rows.length === 0) return null;
    return this.getTripDetails(tripRes.rows[0].id);
  }

  /**
   * Clone an existing trip into a new user's account
   */
  static async cloneTrip(shareCode: string, targetUserId: number) {
    const sourceTrip = await this.getTripByShareCode(shareCode);
    if (!sourceTrip) return null;

    // 1. Create duplicate trip
    const clonedTrip = await this.createTrip({
      userId: targetUserId,
      title: `Copy of ${sourceTrip.title}`,
      description: sourceTrip.description,
      coverImageUrl: sourceTrip.cover_image_url,
      startDate: sourceTrip.start_date,
      endDate: sourceTrip.end_date,
      totalBudget: sourceTrip.total_budget,
      currency: sourceTrip.currency,
      isPublic: true,
      status: 'planning',
    });

    // 2. Clone stops & activities
    for (const stop of sourceTrip.stops) {
      const newStop = await this.addStop({
        tripId: clonedTrip.id,
        cityId: stop.city_id,
        arrivalDate: stop.arrival_date,
        departureDate: stop.departure_date,
        stayCostEstimated: stop.stay_cost_estimated,
        transportCostEstimated: stop.transport_cost_estimated,
        notes: stop.notes,
      });

      for (const act of stop.activities) {
        await this.addActivity({
          tripStopId: newStop.id,
          activityId: act.activity_id,
          customTitle: act.custom_title,
          category: act.category,
          activityDate: act.activity_date,
          startTime: act.start_time,
          endTime: act.end_time,
          cost: act.cost,
          notes: act.notes,
        });
      }
    }

    return clonedTrip;
  }
}
