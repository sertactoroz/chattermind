import { NextRequest, NextResponse } from 'next/server';
import { handleChatBFF } from '@/bff/chat/handleChatBFF';

export async function POST(req: NextRequest): Promise<NextResponse> {
  return await handleChatBFF(req);
}