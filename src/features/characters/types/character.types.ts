export type Character = {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  description?: string;
  systemPrompt: string;
};

export type CharacterMap = Record<string, Character>;
