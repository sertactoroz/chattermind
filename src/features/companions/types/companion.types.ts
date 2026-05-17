export type Companion = {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  description?: string;
  promptKey: string;
  systemPrompt?: string;
  language?: string;
};

export type CompanionMap = Record<string, Companion>;
