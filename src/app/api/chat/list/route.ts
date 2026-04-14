import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseService } from '@/services/database/DatabaseService';
import { successResponse, errorResponse } from '@/shared/response/ApiResponse';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse(new Error('userId is required'));
    }

    const db = getDatabaseService();
    const chats = await db.listChats(userId);

    return successResponse(chats);
  } catch (error) {
    console.error('List chats error:', error);
    return errorResponse(error instanceof Error ? error : new Error('Internal server error'));
  }
}
