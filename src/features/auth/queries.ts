import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import type { User } from '../../types';

export const authKeys = { user: ['user'] as const };

interface Credentials {
  email: string;
  password: string;
}

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: authKeys.user,
    queryFn: async ({ signal }) =>
      (await api.get<{ data: User }>('/api/user', { signal })).data.data,
    retry: false,
  });
}

export function useLogin() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: Credentials) => {
      await api.get('/sanctum/csrf-cookie');
      return (await api.post<{ data: User }>('/login', credentials)).data.data;
    },
    onSuccess: (user) => client.setQueryData(authKeys.user, user),
  });
}

export function useLogout() {
  const client = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      await api.get('/sanctum/csrf-cookie');
      return api.post('/logout');
    },
    onSuccess: async () => {
      await client.cancelQueries();
      client.removeQueries({ predicate: (query) => query.queryKey[0] !== authKeys.user[0] });
      client.setQueryData<User | null>(authKeys.user, null);
      navigate('/login');
    },
  });
}
