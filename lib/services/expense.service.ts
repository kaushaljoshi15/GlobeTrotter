import { query } from '@/lib/db';

export class ExpenseService {
  /**
   * Add an itemized expense
   */
  static async addExpense(data: {
    tripId: number;
    tripStopId?: number;
    category: string;
    title: string;
    amount: number;
    expenseDate: string;
    paymentMethod?: string;
  }) {
    const res = await query(
      `INSERT INTO trip_expenses 
        (trip_id, trip_stop_id, category, title, amount, expense_date, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.tripId,
        data.tripStopId || null,
        data.category,
        data.title,
        data.amount,
        data.expenseDate,
        data.paymentMethod || 'Card',
      ]
    );
    return res.rows[0];
  }

  /**
   * Delete an expense
   */
  static async deleteExpense(expenseId: number, tripId: number) {
    const res = await query('DELETE FROM trip_expenses WHERE id = $1 AND trip_id = $2 RETURNING id', [
      expenseId,
      tripId,
    ]);
    return res.rows.length > 0;
  }

  /**
   * Get financial analytics & category breakdown for a trip
   */
  static async getTripFinancials(tripId: number) {
    // 1. Get Trip budget & dates
    const tripRes = await query('SELECT total_budget, start_date, end_date, currency FROM trips WHERE id = $1', [tripId]);
    if (tripRes.rows.length === 0) return null;
    const trip = tripRes.rows[0];

    // 2. Category totals
    const catRes = await query(
      `SELECT category, SUM(amount)::numeric(10, 2) as total_amount, COUNT(id)::int as count
       FROM trip_expenses
       WHERE trip_id = $1
       GROUP BY category
       ORDER BY total_amount DESC`,
      [tripId]
    );

    // 3. Total expenses
    const totalSpentRes = await query(
      `SELECT COALESCE(SUM(amount), 0)::numeric(12, 2) as total_spent FROM trip_expenses WHERE trip_id = $1`,
      [tripId]
    );
    const totalSpent = parseFloat(totalSpentRes.rows[0].total_spent);
    const totalBudget = parseFloat(trip.total_budget);

    // 4. Daily spend breakdown
    const dailyRes = await query(
      `SELECT expense_date::text as date, SUM(amount)::numeric(10, 2) as amount
       FROM trip_expenses
       WHERE trip_id = $1
       GROUP BY expense_date
       ORDER BY expense_date ASC`,
      [tripId]
    );

    // 5. Calculate trip duration in days
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const durationDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const dailyBudgetAllowance = totalBudget / durationDays;
    const avgDailySpent = totalSpent / durationDays;

    // Overbudget alert check
    const isOverBudget = totalSpent > totalBudget;
    const remainingBudget = Math.max(0, totalBudget - totalSpent);
    const budgetUsagePercent = Math.round((totalSpent / (totalBudget || 1)) * 100);

    return {
      totalBudget,
      totalSpent,
      remainingBudget,
      budgetUsagePercent,
      isOverBudget,
      currency: trip.currency,
      durationDays,
      dailyBudgetAllowance: parseFloat(dailyBudgetAllowance.toFixed(2)),
      avgDailySpent: parseFloat(avgDailySpent.toFixed(2)),
      categories: catRes.rows,
      dailyTimeline: dailyRes.rows,
    };
  }
}
