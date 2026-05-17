import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseService } from '@/services/database/DatabaseService';
import { successResponse, errorResponse } from '@/shared/response/ApiResponse';
import { getAuthUserId } from '@/lib/auth';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const authUserId = await getAuthUserId();
    const body = await req.json();
    const { chatId, sender, content, metadata, userId } = body;

    if (!chatId || !sender || !content) {
      return errorResponse(new Error('chatId, sender, and content are required'));
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

    const message = await db.addMessage(chatId, sender, content, metadata);

    return successResponse(message);
  } catch (error) {
    console.error('Add message error:', error);
    return errorResponse(error instanceof Error ? error : new Error('Internal server error'));
  }
}
