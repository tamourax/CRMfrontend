import { useListQuery, useResourceQuery } from '../../hooks/useApiQuery';
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
  return useListQuery<Page<Customer>>(customerKeys.list(filters), '/api/customers', filters);
}

export function useCustomer(id: string | undefined) {
  return useResourceQuery<Customer>(customerKeys.detail(id), '/api/customers/' + id);
}
