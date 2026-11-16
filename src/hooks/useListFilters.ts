import { useState } from 'react';

export function useListFilters<T extends Record<string, string>>(initialFilters: T) {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);

  function setFilter<K extends keyof T>(key: K, value: T[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  return { filters, page, setPage, setFilter };
}
