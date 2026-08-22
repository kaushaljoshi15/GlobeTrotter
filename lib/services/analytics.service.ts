import prisma from '@/lib/prisma';

export class AnalyticsService {
  /**
   * Platform-wide Admin Metrics and Insights using Prisma ORM
   */
  static async getAdminMetrics() {
    const [
      usersCount,
      tripsCount,
      stopsCount,
      activitiesCount,
      budgetAggregate,
      expenseAggregate,
      topDestinationsRaw,
      categoryStatsRaw,
      recentTrips,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.tripStop.count(),
      prisma.tripActivity.count(),
      prisma.trip.aggregate({ _sum: { total_budget: true } }),
      prisma.tripExpense.aggregate({ _sum: { amount: true } }),
      prisma.tripStop.groupBy({
        by: ['city_id'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 6,
      }),
      prisma.tripActivity.groupBy({
        by: ['category'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      prisma.trip.findMany({
        take: 8,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
    ]);

    // Fetch destination details for top destinations
    const cityIds = topDestinationsRaw.map((d) => d.city_id);
    const destinationDetails = await prisma.destination.findMany({
      where: { id: { in: cityIds } },
      select: { id: true, name: true, country: true, image_url: true },
    });

    const destinationMap = new Map(destinationDetails.map((d) => [d.id, d]));
    const topDestinations = topDestinationsRaw.map((d) => {
      const dest = destinationMap.get(d.city_id);
      return {
        name: dest?.name || 'Unknown',
        country: dest?.country || '',
        image_url: dest?.image_url || '',
        trip_count: d._count.id,
      };
    });

    const categoryStats = categoryStatsRaw.map((c) => ({
      category: c.category || 'sightseeing',
      count: c._count.id,
    }));

    return {
      kpis: {
        totalUsers: usersCount,
        totalTrips: tripsCount,
        totalStops: stopsCount,
        totalActivitiesScheduled: activitiesCount,
        totalBudgetPlanned: Number(budgetAggregate._sum.total_budget || 0),
        totalExpensesLogged: Number(expenseAggregate._sum.amount || 0),
      },
      topDestinations,
      categoryStats,
      recentTrips: recentTrips.map((t) => ({
        ...t,
        total_budget: Number(t.total_budget),
        user_name: t.user.name,
        user_email: t.user.email,
      })),
    };
  }
}
