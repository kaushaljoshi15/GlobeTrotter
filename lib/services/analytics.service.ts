import { query } from '@/lib/db';

export class AnalyticsService {
  /**
   * Platform-wide Admin Metrics and Insights
   */
  static async getAdminMetrics() {
    // 1. Core KPIs
    const usersCount = await query('SELECT COUNT(id)::int as count FROM users');
    const tripsCount = await query('SELECT COUNT(id)::int as count FROM trips');
    const stopsCount = await query('SELECT COUNT(id)::int as count FROM trip_stops');
    const activitiesCount = await query('SELECT COUNT(id)::int as count FROM trip_activities');
    const budgetTotal = await query('SELECT COALESCE(SUM(total_budget), 0)::numeric(12, 2) as total FROM trips');
    const expensesTotal = await query('SELECT COALESCE(SUM(amount), 0)::numeric(12, 2) as total FROM trip_expenses');

    // 2. Top Visited Destinations
    const topDestinations = await query(`
      SELECT d.name, d.country, d.image_url, COUNT(s.id)::int as trip_count
      FROM destinations d
      JOIN trip_stops s ON d.id = s.city_id
      GROUP BY d.id
      ORDER BY trip_count DESC
      LIMIT 6
    `);

    // 3. Activity Category Popularity
    const categoryStats = await query(`
      SELECT COALESCE(category, 'sightseeing') as category, COUNT(id)::int as count
      FROM trip_activities
      GROUP BY category
      ORDER BY count DESC
    `);

    // 4. Trip Status Breakdown
    const statusStats = await query(`
      SELECT status, COUNT(id)::int as count
      FROM trips
      GROUP BY status
    `);

    // 5. Recent Trips created across platform
    const recentTrips = await query(`
      SELECT t.id, t.title, t.start_date, t.end_date, t.total_budget, t.created_at, u.name as user_name, u.email as user_email
      FROM trips t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 8
    `);

    return {
      kpis: {
        totalUsers: usersCount.rows[0]?.count || 0,
        totalTrips: tripsCount.rows[0]?.count || 0,
        totalStops: stopsCount.rows[0]?.count || 0,
        totalActivitiesScheduled: activitiesCount.rows[0]?.count || 0,
        totalBudgetPlanned: parseFloat(budgetTotal.rows[0]?.total || '0'),
        totalExpensesLogged: parseFloat(expensesTotal.rows[0]?.total || '0'),
      },
      topDestinations: topDestinations.rows,
      categoryStats: categoryStats.rows,
      statusStats: statusStats.rows,
      recentTrips: recentTrips.rows,
    };
  }
}
