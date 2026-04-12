import { NextResponse } from 'next/server';
import { AppError } from '../errors/AppError';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export function successResponse<T>(data: T, statusCode: number = 200): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: statusCode });
}

export function errorResponse(error: AppError | Error): NextResponse {
  const appError = error instanceof AppError ? error : {
    statusCode: 500,
    message: error.message || 'Internal server error',
    details: undefined,
  };

  const response: ApiResponse = {
    success: false,
    error: {
      message: appError.message,
      details: appError.details,
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: appError.statusCode });
}

export function jsonResponse(data: unknown, statusCode: number = 200): NextResponse {
  return NextResponse.json(data, { status: statusCode });
}