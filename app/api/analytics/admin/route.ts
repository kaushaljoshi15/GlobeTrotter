import { NextRequest } from 'next/server';
import { AnalyticsService } from '@/lib/services/analytics.service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const metrics = await AnalyticsService.getAdminMetrics();
    return apiSuccess(metrics, 'Admin analytics retrieved successfully');
  } catch (err: any) {
    console.error('Error fetching admin analytics:', err);
    return apiError('Failed to fetch admin metrics', 500, err);
  }
}
