import { Navigate, Route, Routes } from 'react-router-dom';
import { useT } from '../preferences/LocaleProvider';
import type { User } from '../types';
import { Empty } from '../components';
import { WorkspaceLayout } from '../layout/WorkspaceLayout';
import { CustomersPage } from '../features/customers/CustomersPage';
import { CustomerPage } from '../features/customers/CustomerPage';
import { DealsPage } from '../features/deals/DealsPage';
import { DealPage } from '../features/deals/DealPage';
import { ReportPage } from '../features/reports/ReportPage';
import { AssistantPage } from '../features/assistant/AssistantPage';

export function WorkspaceRoutes({ user }: { user: User }) {
  const t = useT();
  return (
    <Routes>
      <Route element={<WorkspaceLayout user={user} />}>
        <Route path="/" element={<ReportPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/deals/:id" element={<DealPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/login" element={<Navigate replace to="/" />} />
        <Route
          path="*"
          element={<Empty title={t('common.notFound')} description={t('details.notFoundHint')} />}
        />
      </Route>
    </Routes>
  );
}
