import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { api } from './lib/api';
import type { User } from './types';
import { ErrorState, Loading } from './components';
import { LoginPage } from './features/auth/LoginPage';
import { WorkspaceRoutes } from './routes/WorkspaceRoutes';

export function App() {
  const client = useQueryClient();
  const user = useQuery({
    queryKey: ['user'],
    queryFn: async () => (await api.get<{ data: User }>('/api/user')).data.data,
    retry: false,
  });
  if (user.isPending) return <Loading />;
  if (user.isError && !(axios.isAxiosError(user.error) && user.error.response?.status === 401))
    return <ErrorState error={user.error} retry={() => void user.refetch()} />;
  if (!user.data) return <LoginPage onSuccess={(data) => client.setQueryData(['user'], data)} />;
  return <WorkspaceRoutes user={user.data} />;
}
