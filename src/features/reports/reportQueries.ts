import { useResourceQuery } from '../../hooks/useApiQuery';
import type { SalesReport } from '../../types';

export function useSalesReport() {
  return useResourceQuery<SalesReport>(['report'], '/api/reports/sales');
}
