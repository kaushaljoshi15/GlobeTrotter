import prisma from '@/lib/prisma';

export class ExpenseService {
  /**
   * Add an itemized expense using Prisma
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
    const expense = await prisma.tripExpense.create({
      data: {
        trip_id: data.tripId,
        trip_stop_id: data.tripStopId || null,
        category: data.category,
        title: data.title,
        amount: data.amount,
        expense_date: new Date(data.expenseDate),
        payment_method: data.paymentMethod || 'Card',
      },
    });

    return {
      ...expense,
      amount: Number(expense.amount),
    };
  }

  /**
   * Delete an expense using Prisma
   */
  static async deleteExpense(expenseId: number, tripId: number) {
    const deleted = await prisma.tripExpense.deleteMany({
      where: { id: expenseId, trip_id: tripId },
    });
    return deleted.count > 0;
  }

  /**
   * Get financial analytics & category breakdown for a trip using Prisma
   */
  static async getTripFinancials(tripId: number) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        expenses: {
          orderBy: { expense_date: 'asc' },
        },
      },
    });

    if (!trip) return null;

    const totalBudget = Number(trip.total_budget);

    // Group expenses by category
    const categoryMap: { [cat: string]: { total_amount: number; count: number } } = {};
    let totalSpent = 0;

    for (const exp of trip.expenses) {
      const amt = Number(exp.amount);
      totalSpent += amt;
      if (!categoryMap[exp.category]) {
        categoryMap[exp.category] = { total_amount: 0, count: 0 };
      }
      categoryMap[exp.category].total_amount += amt;
      categoryMap[exp.category].count += 1;
    }

    const categories = Object.keys(categoryMap).map((cat) => ({
      category: cat,
      total_amount: categoryMap[cat].total_amount,
      count: categoryMap[cat].count,
    }));

    // Group expenses by daily timeline
    const dailyMap: { [dateStr: string]: number } = {};
    for (const exp of trip.expenses) {
      const dStr = exp.expense_date.toISOString().split('T')[0];
      dailyMap[dStr] = (dailyMap[dStr] || 0) + Number(exp.amount);
    }

    const dailyTimeline = Object.keys(dailyMap)
      .sort()
      .map((date) => ({
        date,
        amount: dailyMap[date],
      }));

    // Trip duration calculation
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const durationDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const dailyBudgetAllowance = totalBudget / durationDays;
    const avgDailySpent = totalSpent / durationDays;

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
      categories,
      dailyTimeline,
    };
  }
}
