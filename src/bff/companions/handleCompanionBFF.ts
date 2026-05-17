import { NextResponse } from 'next/server';
import { getCharacterService } from '@/services/ai/CharacterService';
import { successResponse, errorResponse } from '@/shared/response/ApiResponse';
import { validateRequired } from '@/shared/validation/Validator';
import { NotFoundError } from '@/shared/errors/AppError';

export interface CompanionBFFRequest {
  characterId: string;
}

export interface CompanionBFFResponse {
  companion: {
    id: string;
    name: string;
    description: string;
    language?: string;
  };
}

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const characterId = url.pathname.split('/').pop();

    if (!characterId) {
      throw new NotFoundError('Companion ID not provided');
    }

    const characterService = getCharacterService();
    const companion = characterService.getCompanionById(characterId);

    if (!companion) {
      throw new NotFoundError(`Companion not found: ${characterId}`);
    }

    const response: CompanionBFFResponse = {
      companion: {
        id: companion.id,
        name: companion.id,
        description: `Companion with prompt key: ${companion.promptKey}`,
        language: companion.language,
      },
    };

    return successResponse(response, 200);

  } catch (error) {
    return errorResponse(error instanceof Error ? error : new Error('Unknown error'));
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: CompanionBFFRequest = await req.json();
    const characterId = validateRequired(body.characterId, 'characterId');

    const characterService = getCharacterService();
    const companion = characterService.getCompanionById(characterId);

    if (!companion) {
      throw new NotFoundError(`Companion not found: ${characterId}`);
    }

    const response: CompanionBFFResponse = {
      companion: {
        id: companion.id,
        name: companion.id,
        description: `Companion with prompt key: ${companion.promptKey}`,
        language: companion.language,
      },
    };

    return successResponse(response, 200);

  } catch (error) {
    return errorResponse(error instanceof Error ? error : new Error('Unknown error'));
  }
}
