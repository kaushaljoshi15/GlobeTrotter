import { NextRequest } from 'next/server';
import { AIGeneratorService } from '@/lib/services/ai-generator.service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return apiError('Please provide a travel prompt (e.g., "I have ₹30,000 and 5 days. Suggest mountains.")', 400);
    }

    const itinerary = AIGeneratorService.generateItinerary(prompt);

    return apiSuccess(itinerary, 'AI Itinerary generated successfully');
  } catch (err: any) {
    console.error('Error generating AI itinerary:', err);
    return apiError('Failed to generate AI itinerary', 500, err);
  }
}
