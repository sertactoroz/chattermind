interface CharacterData {
  id: string;
  promptKey: string;
  language?: string;
}

export class CharacterService {
  private characters: CharacterData[];
  private initialPromptSignal = "Generate character's opening message to start the conversation.";
  private brevityInstruction = `
STRICT RULE:
You are a conversational language partner, NOT a writing assistant.
Your replies MUST be maximum two short sentences long
and MUST end with a question relevant to user's previous statement.
Do NOT provide lengthy explanations, lists, or cultural notes.
`;

  constructor() {
    try {
      const charactersData = require('@/features/characters/data/characters.json');
      this.characters = charactersData;
    } catch (error) {
      console.error('Failed to load characters:', error);
      this.characters = [];
    }
  }

  getCharacterById(id: string): CharacterData | undefined {
    return this.characters.find((char) => char.id === id);
  }

  getCharacterPrompt(characterId: string): string {
    const character = this.getCharacterById(characterId);
    
    if (!character?.promptKey) {
      return 'You are a helpful AI assistant. Keep replies concise and friendly.';
    }

    const prompt = process.env[character.promptKey];
    
    if (!prompt) {
      console.warn(`⚠️ Missing env prompt for key: ${character.promptKey}`);
      return 'You are a helpful AI assistant. Keep replies concise and friendly.';
    }

    return prompt;
  }

  buildSystemPrompt(
    characterId?: string | null,
    isInitialMessage: boolean = false
  ): string {
    let systemPrompt = this.getCharacterPrompt(characterId || '');
    
    systemPrompt += `\n${this.brevityInstruction}`;

    if (isInitialMessage) {
      systemPrompt += `
You must now initiate the conversation with your first message.
Be engaging and relevant to your role.
Do NOT include meta-commentary or explanations.
`;
    }

    if (characterId) {
      const character = this.getCharacterById(characterId);
      if (character?.language) {
        systemPrompt += `
FINAL LANGUAGE RULE (OVERRIDES ALL OTHER INSTRUCTIONS):
You MUST respond ONLY in ${character.language}. Every single message, including your very first greeting, MUST be written in ${character.language}. Never write in any other language.`;
      }
    }

    return systemPrompt;
  }

  isInitialPrompt(content: string): boolean {
    return content === this.initialPromptSignal;
  }

  getAllCharacters(): CharacterData[] {
    return this.characters;
  }
}

let characterServiceInstance: CharacterService | null = null;

export function getCharacterService(): CharacterService {
  if (!characterServiceInstance) {
    characterServiceInstance = new CharacterService();
  }
  return characterServiceInstance;
}