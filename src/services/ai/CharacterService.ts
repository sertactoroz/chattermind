interface CompanionData {
  id: string;
  promptKey: string;
  language?: string;
}

import companionsData from '@/features/companions/data/companions.json';

export class CharacterService {
  private companions: CompanionData[];
  private initialPromptSignal = "Generate companion's opening message to start the conversation.";
  private brevityInstruction = `
STRICT RULE:
You are a conversational language partner, NOT a writing assistant.
Your replies MUST be maximum two short sentences long
and MUST end with a question relevant to user's previous statement.
Do NOT provide lengthy explanations, lists, or cultural notes.
`;

  constructor() {
    this.companions = companionsData as CompanionData[];
  }

  getCompanionById(id: string): CompanionData | undefined {
    return this.companions.find((comp) => comp.id === id);
  }

  getCompanionPrompt(companionId: string): string {
    const companion = this.getCompanionById(companionId);
    
    if (!companion?.promptKey) {
      return 'You are a helpful AI assistant. Keep replies concise and friendly.';
    }

    const prompt = process.env[companion.promptKey];
    
    if (!prompt) {
      console.warn(`⚠️ Missing env prompt for key: ${companion.promptKey}`);
      return 'You are a helpful AI assistant. Keep replies concise and friendly.';
    }

    return prompt;
  }

  buildSystemPrompt(
    companionId?: string | null,
    isInitialMessage: boolean = false
  ): string {
    let systemPrompt = this.getCompanionPrompt(companionId || '');
    
    systemPrompt += `\n${this.brevityInstruction}`;

    if (isInitialMessage) {
      systemPrompt += `
You must now initiate the conversation with your first message.
Be engaging and relevant to your role.
Do NOT include meta-commentary or explanations.
`;
    }

    if (companionId) {
      const companion = this.getCompanionById(companionId);
      if (companion?.language) {
        systemPrompt += `
FINAL LANGUAGE RULE (OVERRIDES ALL OTHER INSTRUCTIONS):
You MUST respond ONLY in ${companion.language}. Every single message, including your very first greeting, MUST be written in ${companion.language}. Never write in any other language.`;
      }
    }

    return systemPrompt;
  }

  isInitialPrompt(content: string): boolean {
    return content === this.initialPromptSignal;
  }

  getAllCompanions(): CompanionData[] {
    return this.companions;
  }
}

let characterServiceInstance: CharacterService | null = null;

export function getCharacterService(): CharacterService {
  if (!characterServiceInstance) {
    characterServiceInstance = new CharacterService();
  }
  return characterServiceInstance;
}
