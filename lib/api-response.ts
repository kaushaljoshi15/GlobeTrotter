import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  error?: string | null;
}

export function apiSuccess<T>(data: T, message: string = 'Success', status: number = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

export function apiError(message: string, status: number = 400, errorDetail?: any) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      data: null,
      message,
      error: typeof errorDetail === 'string' ? errorDetail : (errorDetail?.message || undefined),
    },
    { status }
  );
}
