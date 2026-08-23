import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'itspast.savedDiscoveries';
export function useSavedDiscoveries() {
  const [saved, setSaved] = useState<string[]>(() => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); }, [saved]);
  const toggle = useCallback((id: string) => setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]), []);
  return { saved, toggle, isSaved: (id: string) => saved.includes(id) };
}
