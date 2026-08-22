import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const userId = user?.id || (searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : 1);

    const res = await query(`
      SELECT d.*, usd.created_at as saved_at
      FROM user_saved_destinations usd
      JOIN destinations d ON usd.destination_id = d.id
      WHERE usd.user_id = $1
      ORDER BY usd.created_at DESC
    `, [userId]);

    return apiSuccess(res.rows, 'Saved destinations retrieved');
  } catch (err: any) {
    console.error('Error fetching saved destinations:', err);
    return apiError('Failed to fetch saved destinations', 500, err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const body = await request.json();
    const userId = user?.id || body.userId || 1;
    const { destinationId } = body;

    if (!destinationId) return apiError('Destination ID is required', 400);

    await query(
      `INSERT INTO user_saved_destinations (user_id, destination_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [userId, parseInt(destinationId)]
    );

    return apiSuccess({ destinationId }, 'Destination saved to wishlist', 201);
  } catch (err: any) {
    console.error('Error saving destination:', err);
    return apiError('Failed to save destination', 500, err);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const userId = user?.id || (searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : 1);
    const destinationId = searchParams.get('destinationId');

    if (!destinationId) return apiError('Destination ID is required', 400);

    await query(
      `DELETE FROM user_saved_destinations WHERE user_id = $1 AND destination_id = $2`,
      [userId, parseInt(destinationId)]
    );

    return apiSuccess({ destinationId: parseInt(destinationId) }, 'Destination removed from wishlist');
  } catch (err: any) {
    console.error('Error removing saved destination:', err);
    return apiError('Failed to remove destination', 500, err);
  }
}
