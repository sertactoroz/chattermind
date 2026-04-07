export type Character = {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  description?: string;
  promptKey: string;
  systemPrompt?: string;
  openingMessage?: string;
};

export type CharacterMap = Record<string, Character>;
