import prisma from '@/lib/prisma';

export class DestinationService {
  /**
   * Search and filter destinations with optional continent, cost index, and search query using Prisma.
   */
  static async getDestinations(filters?: {
    search?: string;
    continent?: string;
    cost_index?: string;
    limit?: number;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { country: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.continent && filters.continent !== 'all') {
      where.continent = { equals: filters.continent, mode: 'insensitive' };
    }

    if (filters?.cost_index && filters.cost_index !== 'all') {
      where.cost_index = filters.cost_index;
    }

    const destinations = await prisma.destination.findMany({
      where,
      orderBy: { popularity_score: 'desc' },
      take: filters?.limit || undefined,
      include: {
        _count: {
          select: { activities: true },
        },
      },
    });

    return destinations.map((d) => ({
      ...d,
      avg_daily_cost: Number(d.avg_daily_cost),
      latitude: d.latitude ? Number(d.latitude) : null,
      longitude: d.longitude ? Number(d.longitude) : null,
      total_activities: d._count.activities,
    }));
  }

  /**
   * Get single destination with full curated activities using Prisma.
   */
  static async getDestinationById(id: number) {
    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: [{ rating: 'desc' }, { cost: 'asc' }],
        },
      },
    });

    if (!destination) return null;

    return {
      ...destination,
      avg_daily_cost: Number(destination.avg_daily_cost),
      latitude: destination.latitude ? Number(destination.latitude) : null,
      longitude: destination.longitude ? Number(destination.longitude) : null,
      activities: destination.activities.map((a) => ({
        ...a,
        cost: Number(a.cost),
        duration_hours: Number(a.duration_hours),
        rating: Number(a.rating),
      })),
    };
  }

  /**
   * Search activities across all or specific city using Prisma.
   */
  static async getActivities(filters?: {
    city_id?: number;
    category?: string;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.city_id) {
      where.city_id = filters.city_id;
    }

    if (filters?.category && filters.category !== 'all') {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        destination: {
          select: {
            name: true,
            country: true,
            currency: true,
          },
        },
      },
      orderBy: [{ rating: 'desc' }, { name: 'asc' }],
    });

    return activities.map((a) => ({
      ...a,
      cost: Number(a.cost),
      duration_hours: Number(a.duration_hours),
      rating: Number(a.rating),
      city_name: a.destination.name,
      country: a.destination.country,
      currency: a.destination.currency,
    }));
  }
}
