import { NextRequest, NextResponse } from 'next/server';
import { GET as getCompanion, POST as postCompanion } from '@/bff/companions/handleCompanionBFF';

export async function GET(req: NextRequest): Promise<NextResponse> {
  return await getCompanion(req);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return await postCompanion(req);
}