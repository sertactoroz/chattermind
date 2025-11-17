import { useEffect, useState } from 'react';
import { getAllCharacters, getCharacterMap } from '../services/characterService';
import type { Character } from '../types/character.types';

export function useCharacters() {
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [characterMap, setCharacterMap] = useState<Record<string, Character>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAllCharacters(getAllCharacters());
    setCharacterMap(getCharacterMap());
    setIsLoading(false);
  }, []);

  return {
    allCharacters,
    characterMap,
    isLoading,
    getCharacterById: (id?: string | null) =>
      id ? characterMap[id] : undefined,
  };
}
