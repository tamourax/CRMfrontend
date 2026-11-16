import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { Customer, Page } from '../../types';

interface CustomerFilters {
  search: string;
  status: string;
  page: number;
}

export const customerKeys = {
  list: (filters: CustomerFilters) => ['customers', filters] as const,
  detail: (id: string | undefined) => ['customer', id] as const,
};

export function useCustomers(filters: CustomerFilters) {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: async ({ signal }) =>
      (await api.get<Page<Customer>>('/api/customers', { params: filters, signal })).data,
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: async ({ signal }) =>
      (await api.get<{ data: Customer }>('/api/customers/' + id, { signal })).data.data,
  });
}
