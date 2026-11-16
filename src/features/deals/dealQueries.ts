import { useListQuery, useResourceQuery } from '../../hooks/useApiQuery';
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
  return useListQuery<Page<Deal>>(dealKeys.list(filters), '/api/deals', filters);
}

export function useDeal(id: string | undefined) {
  return useResourceQuery<Deal>(dealKeys.detail(id), '/api/deals/' + id);
}

export function usePriorityDeals() {
  return useDeals({ stage: 'open', per_page: 5, sort: 'value_desc' });
}
