import { ExternalServiceError } from '../../shared/errors/AppError';

interface AIModelConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
}

export class AIService {
  private config: AIModelConfig;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_GROQ_BASE;

    if (!apiKey || !baseUrl) {
      throw new Error('AI service configuration is missing');
    }

    this.config = {
      apiKey,
      baseUrl,
      model: 'openai/gpt-oss-safeguard-20b',
      temperature: 0.7,
      maxTokens: 1024,
    };
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ExternalServiceError('Groq API', errorText);
      }

      const data = await response.json();
      
      const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text;

      if (!content) {
        throw new ExternalServiceError('Groq API', 'Empty response received');
      }

      return {
        content,
        model: this.config.model,
      };
    } catch (error) {
      if (error instanceof ExternalServiceError) {
        throw error;
      }
      throw new ExternalServiceError('Groq API', error);
    }
  }

  async generateResponse(
    systemPrompt: string,
    conversationHistory: AIMessage[],
    userMessage: string
  ): Promise<string> {
    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const response = await this.chat(messages);
    return response.content;
  }

  setTemperature(temperature: number): void {
    this.config.temperature = temperature;
  }

  setMaxTokens(maxTokens: number): void {
    this.config.maxTokens = maxTokens;
  }
}

let aiServiceInstance: AIService | null = null;

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService();
  }
  return aiServiceInstance;
}