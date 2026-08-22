import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const userId = user?.id || (searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : 1);

    const userRes = await query('SELECT id, name, email, avatar_url, role, preferred_currency, created_at FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) return apiError('User not found', 404);

    const userData = userRes.rows[0];

    // Get user trip stats
    const statsRes = await query(`
      SELECT 
        COUNT(DISTINCT t.id)::int as total_trips,
        COUNT(DISTINCT s.city_id)::int as total_cities_visited,
        COUNT(DISTINCT d.country)::int as total_countries_visited,
        COALESCE(SUM(t.total_budget), 0)::numeric(12, 2) as total_budget_planned,
        COALESCE(SUM(e.amount), 0)::numeric(12, 2) as total_spent
      FROM trips t
      LEFT JOIN trip_stops s ON t.id = s.trip_id
      LEFT JOIN destinations d ON s.city_id = d.id
      LEFT JOIN trip_expenses e ON t.id = e.trip_id
      WHERE t.user_id = $1
    `, [userId]);

    return apiSuccess({
      ...userData,
      stats: statsRes.rows[0],
    }, 'User profile retrieved');
  } catch (err: any) {
    console.error('Error getting profile:', err);
    return apiError('Failed to get profile', 500, err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const body = await request.json();
    const userId = user?.id || body.userId || 1;
    const { name, avatar_url, preferred_currency } = body;

    const res = await query(
      `UPDATE users
       SET name = COALESCE($1, name),
           avatar_url = COALESCE($2, avatar_url),
           preferred_currency = COALESCE($3, preferred_currency)
       WHERE id = $4
       RETURNING id, name, email, avatar_url, role, preferred_currency, created_at`,
      [name, avatar_url, preferred_currency, userId]
    );

    return apiSuccess(res.rows[0], 'Profile updated successfully');
  } catch (err: any) {
    console.error('Error updating profile:', err);
    return apiError('Failed to update profile', 500, err);
  }
}
