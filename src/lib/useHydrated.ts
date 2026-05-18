import { useEffect, useState } from 'react';

/**
 * Prevents SSR hydration mismatch when using zustand persist with localStorage.
 * Use this in any component that reads from a persisted store.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
