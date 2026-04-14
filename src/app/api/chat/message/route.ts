import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseService } from '@/services/database/DatabaseService';
import { successResponse, errorResponse } from '@/shared/response/ApiResponse';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { chatId, sender, content, metadata } = body;

    if (!chatId || !sender || !content) {
      return errorResponse(new Error('chatId, sender, and content are required'));
    }

    const db = getDatabaseService();
    const message = await db.addMessage(chatId, sender, content, metadata);

    return successResponse(message);
  } catch (error) {
    console.error('Add message error:', error);
    return errorResponse(error instanceof Error ? error : new Error('Internal server error'));
  }
}
