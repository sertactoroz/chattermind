import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseService } from '@/services/database/DatabaseService';
import { successResponse, errorResponse } from '@/shared/response/ApiResponse';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return errorResponse(new Error('chatId is required'));
    }

    const db = getDatabaseService();
    const messages = await db.listMessages(chatId);

    return successResponse(messages);
  } catch (error) {
    console.error('List messages error:', error);
    return errorResponse(error instanceof Error ? error : new Error('Internal server error'));
  }
}
