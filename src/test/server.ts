import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import type { AiResult, Customer, Deal, SalesReport, User } from '../types';

export const user: User = { id: 1, name: 'Alex Morgan', email: 'alex@orbit.example' };
export const customer: Customer = {
  id: 1,
  name: 'Morgan Reed',
  email: 'morgan@atlas.example',
  phone: null,
  company: 'Atlas Industries',
  industry: 'Manufacturing',
  status: 'active',
  notes: 'Security review pending.',
  deals_count: 1,
};
export const deal: Deal = {
  id: 1,
  customer_id: 1,
  title: 'Platform rollout',
  value: '12500.25',
  stage: 'negotiation',
  expected_close_date: '2026-11-30',
  customer,
};
export const result: AiResult = {
  sections: [
    { title: 'Negotiation overview', content: 'The recorded negotiation value is USD 12500.25.' },
  ],
  facts: { total_value: '12500.25', deal_count: 1 },
  sources: [{ type: 'deal', id: 1, label: 'Platform rollout' }],
  generated_at: '2026-11-16T12:00:00+02:00',
  mode: 'live',
  limitations: [],
};
export const report: SalesReport = {
  total_deals: 1,
  total_value: '12500.25',
  pipeline_value: '12500.25',
  open_count: 1,
  won_count: 0,
  won_value: '0.00',
  lost_count: 0,
  lost_value: '0.00',
  closing_this_month_count: 1,
  closing_this_month_value: '12500.25',
  overdue_count: 0,
  stages: ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].map((stage) => ({
    stage: stage as Deal['stage'],
    count: stage === 'negotiation' ? 1 : 0,
    value: stage === 'negotiation' ? '12500.25' : '0.00',
  })),
  top_customers: [
    {
      id: 1,
      company: customer.company,
      name: customer.name,
      deal_count: 1,
      total_value: '12500.25',
    },
  ],
  as_of: '2026-11-16T12:00:00+02:00',
  timezone: 'Africa/Cairo',
  currency: 'USD',
};
export const page = <T>(data: T[]) => ({
  data,
  meta: { current_page: 1, last_page: 1, total: data.length, per_page: 10 },
});

export const server = setupServer(
  http.get('http://localhost:8000/api/user', () => HttpResponse.json({ data: user })),
  http.get('http://localhost:8000/api/status', () =>
    HttpResponse.json({ data: { ai_configured: true } }),
  ),
  http.get('http://localhost:8000/api/customers', () => HttpResponse.json(page([customer]))),
  http.get('http://localhost:8000/api/customers/1', () =>
    HttpResponse.json({ data: { ...customer, deals: [deal] } }),
  ),
  http.get('http://localhost:8000/api/deals', () => HttpResponse.json(page([deal]))),
  http.get('http://localhost:8000/api/deals/1', () => HttpResponse.json({ data: deal })),
  http.get('http://localhost:8000/api/reports/sales', () => HttpResponse.json({ data: report })),
  http.get(
    'http://localhost:8000/sanctum/csrf-cookie',
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.post('http://localhost:8000/login', () => HttpResponse.json({ data: user })),
  http.post('http://localhost:8000/logout', () => HttpResponse.json({ message: 'Signed out.' })),
  http.post('http://localhost:8000/api/customers/1/ai-summary', () =>
    HttpResponse.json({ data: result }),
  ),
  http.post('http://localhost:8000/api/assistant/messages', () =>
    HttpResponse.json({ data: result }),
  ),
);
