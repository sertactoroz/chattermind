import { useEffect, useState, useCallback } from 'react';
import { fetchCompanions } from '../services/companionService';
import type { Companion } from '../types/companion.types';

export function useCompanions() {
  const [allCompanions, setAllCompanions] = useState<Companion[]>([]);
  const [companionMap, setCompanionMap] = useState<Record<string, Companion>>({});
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const comps = await fetchCompanions();
    setAllCompanions(comps);
    setCompanionMap(Object.fromEntries(comps.map(c => [c.id, c])));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchCompanions().then(comps => {
      if (!mounted) return;
      setAllCompanions(comps);
      setCompanionMap(Object.fromEntries(comps.map(c => [c.id, c])));
      setIsLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  return {
    allCompanions,
    companionMap,
    isLoading,
    refresh: load,
    getCompanionById: (id?: string | null) =>
      id ? companionMap[id] : undefined,
  };
}
