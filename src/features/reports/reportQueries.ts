import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { SalesReport } from '../../types';

export function useSalesReport() {
  return useQuery({
    queryKey: ['report'],
    queryFn: async ({ signal }) =>
      (await api.get<{ data: SalesReport }>('/api/reports/sales', { signal })).data.data,
  });
}
