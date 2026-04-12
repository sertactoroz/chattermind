import { NextRequest, NextResponse } from 'next/server';
import { GET as getCharacter, POST as postCharacter } from '@/bff/characters/handleCharacterBFF';

export async function GET(req: NextRequest): Promise<NextResponse> {
  return await getCharacter(req);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return await postCharacter(req);
}