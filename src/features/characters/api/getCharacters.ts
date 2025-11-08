import characters from '@/features/characters/data/characters.json';

export function getCharacters() {
  return characters;
}

export function getCharacterById(id: string) {
  return characters.find(c => c.id === id);
}

