import { NextResponse } from 'next/server';
import { getAIService } from '@/services/ai/AIService';
import { getCharacterService } from '@/services/ai/CharacterService';
import { getDatabaseService } from '@/services/database/DatabaseService';
import { 
  validateRequired, 
  ValidationError 
} from '@/shared/validation/Validator';
import { AppError, ExternalServiceError } from '@/shared/errors/AppError';
import { successResponse, errorResponse } from '@/shared/response/ApiResponse';
import { AIMessage } from '@/services/ai/AIService';
import { getAuthUserId } from '@/lib/auth';

export interface ChatBFFRequest {
  chatId: string;
  userId?: string;
  content: string;
  characterId?: string | null;
}

export interface ChatBFFResponse {
  ai: string;
  warning?: string;
}

export async function handleChatBFF(req: Request): Promise<NextResponse> {
  try {
    const authUserId = await getAuthUserId();
    if (!authUserId) {
      return errorResponse(new Error('Unauthorized'));
    }

    const body: ChatBFFRequest = await req.json();

    const chatId = validateRequired(body.chatId, 'chatId');
    const content = validateRequired(body.content, 'content');
    const characterId = body.characterId;

    const characterService = getCharacterService();
    const isInitialMessage = characterService.isInitialPrompt(content);
    const systemPrompt = characterService.buildSystemPrompt(characterId, isInitialMessage);

    const databaseService = getDatabaseService();
    const recentMessages = await databaseService.getRecentMessages(chatId);
    
    const conversationHistory: AIMessage[] = recentMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    const aiService = getAIService();
    
    let finalMessages: AIMessage[];
    if (isInitialMessage) {
      finalMessages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
      ];
    } else {
      finalMessages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content },
      ];
    }

    const aiResponse = await aiService.chat(finalMessages);

    try {
      await databaseService.saveMessage(chatId, 'ai', aiResponse.content);
    } catch (dbError) {
      console.warn('Failed to save AI message:', dbError);
      const response: ChatBFFResponse = {
        ai: aiResponse.content,
        warning: 'AI message save failed',
      };
      return successResponse(response, 200);
    }

    const response: ChatBFFResponse = {
      ai: aiResponse.content,
    };
    
    return successResponse(response, 200);

  } catch (error) {
    if (error instanceof ValidationError) {
      return errorResponse(error);
    }

    if (error instanceof ExternalServiceError) {
      return errorResponse(error);
    }

    if (error instanceof AppError) {
      return errorResponse(error);
    }

    console.error('Chat BFF error:', error);
    const appError = new Error('Internal server error');
    return errorResponse(appError);
  }
}