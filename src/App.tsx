import { ErrorState, Loading } from './components';
import { isUnauthorized, sessionExpiredEvent } from './lib/api';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { LoginPage } from './features/auth/LoginPage';
import { authKeys, useCurrentUser } from './features/auth/authQueries';
import { WorkspaceRoutes } from './routes/WorkspaceRoutes';

export function App() {
  const client = useQueryClient();
  useEffect(() => {
    const expire = () => {
      void client.cancelQueries();
      client.removeQueries({ predicate: (query) => query.queryKey[0] !== authKeys.user[0] });
      client.setQueryData(authKeys.user, null);
    };
    window.addEventListener(sessionExpiredEvent, expire);
    return () => window.removeEventListener(sessionExpiredEvent, expire);
  }, [client]);
  const user = useCurrentUser();
  if (user.isPending) return <Loading />;
  if (user.isError && !isUnauthorized(user.error))
    return <ErrorState error={user.error} retry={() => void user.refetch()} />;
  if (!user.data) return <LoginPage />;
  return <WorkspaceRoutes user={user.data} />;
}
