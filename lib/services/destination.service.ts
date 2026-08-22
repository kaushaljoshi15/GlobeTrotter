import prisma from '@/lib/prisma';
import { ALL_CURATED_DESTINATIONS } from '@/lib/destinations-data';

export class DestinationService {
  /**
   * Search and filter destinations with optional continent, cost index, and search query using Prisma + master catalog.
   */
  static async getDestinations(filters?: {
    search?: string;
    continent?: string;
    cost_index?: string;
    limit?: number;
  }) {
    let dbDestinations: any[] = [];
    try {
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

      const found = await prisma.destination.findMany({
        where,
        orderBy: { popularity_score: 'desc' },
        take: filters?.limit || undefined,
        include: {
          _count: {
            select: { activities: true },
          },
        },
      });

      dbDestinations = found.map((d) => ({
        ...d,
        avg_daily_cost: Number(d.avg_daily_cost),
        latitude: d.latitude ? Number(d.latitude) : null,
        longitude: d.longitude ? Number(d.longitude) : null,
        total_activities: d._count.activities,
      }));
    } catch (e) {
      console.warn('Prisma getDestinations fallback to master dataset:', e);
    }

    // Helper to normalize city names for clean deduplication
    const norm = (str: string) => str.toLowerCase().replace(/[^a-z]/g, '');

    const existingNames = new Set(dbDestinations.map(d => norm(d.name)));
    const existingIds = new Set(dbDestinations.map(d => d.id));

    let masterFiltered = ALL_CURATED_DESTINATIONS.filter(d => {
      const n = norm(d.name);
      return !existingNames.has(n) && !Array.from(existingNames).some(ex => ex.includes(n) || n.includes(ex));
    });

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      masterFiltered = masterFiltered.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    }

    if (filters?.continent && filters.continent !== 'all') {
      masterFiltered = masterFiltered.filter(d => d.continent.toLowerCase() === filters.continent?.toLowerCase());
    }

    if (filters?.cost_index && filters.cost_index !== 'all') {
      masterFiltered = masterFiltered.filter(d => d.cost_index.toLowerCase() === filters.cost_index?.toLowerCase());
    }

    // Ensure strictly unique IDs across combined list
    let nextId = 500;
    const finalMaster = masterFiltered.map(d => {
      let uniqueId = d.id;
      while (existingIds.has(uniqueId)) {
        uniqueId = nextId++;
      }
      existingIds.add(uniqueId);
      return { ...d, id: uniqueId };
    });

    const combined = [...dbDestinations, ...finalMaster];
    return filters?.limit ? combined.slice(0, filters.limit) : combined;
  }

  /**
   * Get single destination with full curated activities using Prisma or master catalog.
   */
  static async getDestinationById(id: number) {
    try {
      const destination = await prisma.destination.findUnique({
        where: { id },
        include: {
          activities: {
            orderBy: [{ rating: 'desc' }, { cost: 'asc' }],
          },
        },
      });

      if (destination) {
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
    } catch (e) {}

    // Fallback to master dataset item
    const fallback = ALL_CURATED_DESTINATIONS.find(d => d.id === id) || ALL_CURATED_DESTINATIONS[0];
    return {
      ...fallback,
      activities: []
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
    try {
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
    } catch (e) {
      return [];
    }
  }
}
