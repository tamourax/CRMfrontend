import type { stages } from './lib/constants';

export type Stage = (typeof stages)[number];
export interface User {
  id: number;
  name: string;
  email: string;
}
export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string;
  industry: string;
  status: 'prospect' | 'active' | 'inactive';
  notes?: string | null;
  deals_count?: number;
  deals?: Deal[];
}
export interface Deal {
  id: number;
  customer_id: number;
  title: string;
  value: string;
  stage: Stage;
  expected_close_date: string | null;
  description?: string | null;
  lost_reason?: string | null;
  customer?: Pick<Customer, 'id' | 'name' | 'company'>;
}
export interface Page<T> {
  data: T[];
  meta: { current_page: number; last_page: number; total: number; per_page: number };
}
export interface StageMetric {
  stage: Stage;
  count: number;
  value: string;
}
export interface SalesReport {
  total_deals: number;
  total_value: string;
  pipeline_value: string;
  won_count: number;
  won_value: string;
  lost_count: number;
  lost_value: string;
  open_count: number;
  closing_this_month_count: number;
  closing_this_month_value: string;
  overdue_count: number;
  stages: StageMetric[];
  top_customers: {
    id: number;
    company: string;
    name: string;
    deal_count: number;
    total_value: string;
  }[];
  as_of: string;
  timezone: string;
  currency: string;
}
export interface Evidence {
  type: 'customer' | 'deal' | 'aggregate';
  id?: number;
  label: string;
}
export interface AiResult {
  sections: { title: string; content: string }[];
  facts: Record<string, unknown>;
  sources: Evidence[];
  generated_at: string;
  mode: 'live';
  limitations: string[];
}
