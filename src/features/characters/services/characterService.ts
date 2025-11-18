import charactersData from '@/features/characters/data/characters.json';
import type { Character } from '@/features/characters/types/character.types';

export function getAllCharacters(): Character[] {
  return charactersData as Character[];
}

export function getCharacterById(id: string): Character | undefined {
  return (charactersData as Character[]).find(c => c.id === id);
}

export function getCharacterMap(): Record<string, Character> {
  return Object.fromEntries(
    (charactersData as Character[]).map(c => [c.id, c])
  );
}
