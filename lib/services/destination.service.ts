import { query } from '@/lib/db';

export class DestinationService {
  /**
   * Search and filter destinations with optional continent, cost index, and search query.
   */
  static async getDestinations(filters?: {
    search?: string;
    continent?: string;
    cost_index?: string;
    limit?: number;
  }) {
    let sql = `
      SELECT d.*, 
             COUNT(DISTINCT a.id)::int as total_activities,
             AVG(a.rating)::numeric(3, 2) as average_activity_rating
      FROM destinations d
      LEFT JOIN activities a ON d.id = a.city_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIdx = 1;

    if (filters?.search) {
      sql += ` AND (d.name ILIKE $${paramIdx} OR d.country ILIKE $${paramIdx} OR d.description ILIKE $${paramIdx})`;
      params.push(`%${filters.search}%`);
      paramIdx++;
    }

    if (filters?.continent && filters.continent !== 'all') {
      sql += ` AND d.continent ILIKE $${paramIdx}`;
      params.push(filters.continent);
      paramIdx++;
    }

    if (filters?.cost_index && filters.cost_index !== 'all') {
      sql += ` AND d.cost_index = $${paramIdx}`;
      params.push(filters.cost_index);
      paramIdx++;
    }

    sql += ` GROUP BY d.id ORDER BY d.popularity_score DESC`;

    if (filters?.limit) {
      sql += ` LIMIT $${paramIdx}`;
      params.push(filters.limit);
      paramIdx++;
    }

    const res = await query(sql, params);
    return res.rows;
  }

  /**
   * Get single destination with full curated activities
   */
  static async getDestinationById(id: number) {
    const destRes = await query('SELECT * FROM destinations WHERE id = $1', [id]);
    if (destRes.rows.length === 0) return null;

    const destination = destRes.rows[0];
    const activitiesRes = await query(
      'SELECT * FROM activities WHERE city_id = $1 ORDER BY rating DESC, cost ASC',
      [id]
    );

    return {
      ...destination,
      activities: activitiesRes.rows,
    };
  }

  /**
   * Search activities across all or specific city
   */
  static async getActivities(filters?: {
    city_id?: number;
    category?: string;
    search?: string;
  }) {
    let sql = `
      SELECT a.*, d.name as city_name, d.country, d.currency
      FROM activities a
      JOIN destinations d ON a.city_id = d.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIdx = 1;

    if (filters?.city_id) {
      sql += ` AND a.city_id = $${paramIdx}`;
      params.push(filters.city_id);
      paramIdx++;
    }

    if (filters?.category && filters.category !== 'all') {
      sql += ` AND a.category = $${paramIdx}`;
      params.push(filters.category);
      paramIdx++;
    }

    if (filters?.search) {
      sql += ` AND (a.name ILIKE $${paramIdx} OR a.description ILIKE $${paramIdx} OR d.name ILIKE $${paramIdx})`;
      params.push(`%${filters.search}%`);
      paramIdx++;
    }

    sql += ` ORDER BY a.rating DESC, a.name ASC`;
    const res = await query(sql, params);
    return res.rows;
  }
}
