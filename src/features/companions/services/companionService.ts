import companionsData from '@/features/companions/data/companions.json';
import type { Companion } from '@/features/companions/types/companion.types';
import { api } from '@/lib/api';

const staticFallback = companionsData as Companion[];

export async function fetchCompanions(): Promise<Companion[]> {
  try {
    const backendComps = await api.get<Companion[]>('/api/companions');
    return backendComps.map(c => ({
      ...c,
      promptKey: c.promptKey || c.id?.toUpperCase().replace(/[^A-Z0-9]/g, '_') + '_PROMPT',
    }));
  } catch {
    return staticFallback;
  }
}

export function getAllCompanions(): Companion[] {
  return staticFallback;
}

export function getCompanionById(id: string): Companion | undefined {
  return staticFallback.find(c => c.id === id);
}

export function getCompanionMap(): Record<string, Companion> {
  return Object.fromEntries(staticFallback.map(c => [c.id, c]));
}
