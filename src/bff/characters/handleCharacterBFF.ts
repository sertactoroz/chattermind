import { NextResponse } from 'next/server';
import { getCharacterService } from '@/services/ai/CharacterService';
import { successResponse, errorResponse } from '@/shared/response/ApiResponse';
import { validateRequired } from '@/shared/validation/Validator';
import { NotFoundError } from '@/shared/errors/AppError';

export interface CharacterBFFRequest {
  characterId: string;
}

export interface CharacterBFFResponse {
  character: {
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
      throw new NotFoundError('Character ID not provided');
    }

    const characterService = getCharacterService();
    const character = characterService.getCharacterById(characterId);

    if (!character) {
      throw new NotFoundError(`Character not found: ${characterId}`);
    }

    const response: CharacterBFFResponse = {
      character: {
        id: character.id,
        name: character.id,
        description: `Character with prompt key: ${character.promptKey}`,
        language: character.language,
      },
    };

    return successResponse(response, 200);

  } catch (error) {
    return errorResponse(error instanceof Error ? error : new Error('Unknown error'));
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: CharacterBFFRequest = await req.json();
    const characterId = validateRequired(body.characterId, 'characterId');

    const characterService = getCharacterService();
    const character = characterService.getCharacterById(characterId);

    if (!character) {
      throw new NotFoundError(`Character not found: ${characterId}`);
    }

    const response: CharacterBFFResponse = {
      character: {
        id: character.id,
        name: character.id,
        description: `Character with prompt key: ${character.promptKey}`,
        language: character.language,
      },
    };

    return successResponse(response, 200);

  } catch (error) {
    return errorResponse(error instanceof Error ? error : new Error('Unknown error'));
  }
}