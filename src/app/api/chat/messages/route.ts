import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseService } from '@/services/database/DatabaseService';
import { successResponse, errorResponse } from '@/shared/response/ApiResponse';
import { getAuthUserId } from '@/lib/auth';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const authUserId = await getAuthUserId();

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');
    const userId = searchParams.get('userId');

    if (!chatId) {
      return errorResponse(new Error('chatId is required'));
    }

    const db = getDatabaseService();

    const chat = await db.getChatById(chatId);
    if (!chat) {
      return errorResponse(new Error('Chat not found'));
    }

    const effectiveUserId = authUserId || userId;
    if (effectiveUserId && chat.user_id !== effectiveUserId) {
      return errorResponse(new Error('Forbidden'));
    }

    const messages = await db.listMessages(chatId);

    return successResponse(messages);
  } catch (error) {
    console.error('List messages error:', error);
    return errorResponse(error instanceof Error ? error : new Error('Internal server error'));
  }
}
