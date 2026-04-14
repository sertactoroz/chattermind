import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseService } from '@/services/database/DatabaseService';
import { successResponse, errorResponse } from '@/shared/response/ApiResponse';
import { getAuthUserId } from '@/lib/auth';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const authUserId = await getAuthUserId();
    const body = await req.json();
    const { userId, characterId, title } = body;

    const effectiveUserId = authUserId || userId;
    if (!effectiveUserId || !characterId) {
      return errorResponse(new Error('userId and characterId are required'));
    }

    const db = getDatabaseService();
    const chat = await db.createChat(effectiveUserId, characterId, title || 'New chat');

    return successResponse(chat);
  } catch (error) {
    console.error('Create chat error:', error);
    return errorResponse(error instanceof Error ? error : new Error('Internal server error'));
  }
}
