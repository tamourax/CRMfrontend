import { useQuery, type QueryKey } from '@tanstack/react-query';
import { api } from '../lib/api';

interface ApiQueryOptions<TResponse, TData> {
  queryKey: QueryKey;
  endpoint: string;
  params?: object;
  select: (response: TResponse) => TData;
}

export function useApiQuery<TResponse, TData>({
  queryKey,
  endpoint,
  params,
  select,
}: ApiQueryOptions<TResponse, TData>) {
  return useQuery({
    queryKey,
    queryFn: async ({ signal }) =>
      select((await api.get<TResponse>(endpoint, { params, signal })).data),
  });
}

export function useResourceQuery<T>(queryKey: QueryKey, endpoint: string) {
  return useApiQuery<{ data: T }, T>({
    queryKey,
    endpoint,
    select: (response) => response.data,
  });
}

export function useListQuery<T>(queryKey: QueryKey, endpoint: string, params: object) {
  return useApiQuery<T, T>({ queryKey, endpoint, params, select: (response) => response });
}
