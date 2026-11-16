import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { Deal, Page } from '../../types';

interface DealFilters {
  stage?: string;
  page?: number;
  search?: string;
  sort?: string;
  customer_id?: string;
  closing?: string;
  per_page?: number;
}

export const dealKeys = {
  list: (filters: DealFilters) => ['deals', filters] as const,
  detail: (id: string | undefined) => ['deal', id] as const,
};

export function useDeals(filters: DealFilters) {
  return useQuery({
    queryKey: dealKeys.list(filters),
    queryFn: async ({ signal }) =>
      (await api.get<Page<Deal>>('/api/deals', { params: filters, signal })).data,
  });
}

export function useDeal(id: string | undefined) {
  return useQuery({
    queryKey: dealKeys.detail(id),
    queryFn: async ({ signal }) =>
      (await api.get<{ data: Deal }>('/api/deals/' + id, { signal })).data.data,
  });
}

export function usePriorityDeals() {
  return useDeals({ stage: 'open', per_page: 5, sort: 'value_desc' });
}
