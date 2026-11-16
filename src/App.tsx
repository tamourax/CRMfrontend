import { ErrorState, Loading } from './components';
import { isUnauthorized } from './lib/api';
import { LoginPage } from './features/auth/LoginPage';
import { useCurrentUser } from './features/auth/queries';
import { WorkspaceRoutes } from './routes/WorkspaceRoutes';

export function App() {
  const user = useCurrentUser();
  if (user.isPending) return <Loading />;
  if (user.isError && !isUnauthorized(user.error))
    return <ErrorState error={user.error} retry={() => void user.refetch()} />;
  if (!user.data) return <LoginPage />;
  return <WorkspaceRoutes user={user.data} />;
}
