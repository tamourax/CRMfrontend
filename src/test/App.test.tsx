import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { App } from '../App';
import { LocaleProvider } from '../preferences/LocaleProvider';
import { server, page, result } from './server';

function mount(path = '/') {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <LocaleProvider><App /></LocaleProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('workspace integration', () => {
  it('renders authoritative sales statistics and deal links', async () => {
    mount();
    expect(await screen.findByRole('heading', { name: 'Sales overview' })).toBeVisible();
    expect(await screen.findByRole('link', { name: 'Platform rollout' })).toHaveAttribute(
      'href',
      '/deals/1',
    );
    expect(screen.getAllByText('$12,500.25').length).toBeGreaterThan(0);
  });

  it('signs in after retrieving a CSRF cookie', async () => {
    server.use(
      http.get('http://localhost:8000/api/user', () =>
        HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 }),
      ),
    );
    mount();
    const actor = userEvent.setup();
    await actor.type(await screen.findByLabelText('Password'), 'OrbitDemo!2026');
    await actor.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('heading', { name: 'Sales overview' })).toBeVisible();
  });

  it('handles login failures without entering the workspace', async () => {
    server.use(
      http.get('http://localhost:8000/api/user', () => HttpResponse.json({}, { status: 401 })),
      http.post('http://localhost:8000/login', () =>
        HttpResponse.json(
          { message: 'These credentials do not match our records.' },
          { status: 422 },
        ),
      ),
    );
    mount();
    const actor = userEvent.setup();
    await actor.type(await screen.findByLabelText('Password'), 'wrong');
    await actor.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('These credentials do not match');
    expect(screen.queryByRole('heading', { name: 'Sales overview' })).not.toBeInTheDocument();
  });

  it('shows a retryable API error instead of pretending the user is signed out', async () => {
    server.use(
      http.get('http://localhost:8000/api/user', () =>
        HttpResponse.json({ message: 'Service temporarily unavailable.' }, { status: 503 }),
      ),
    );
    mount();
    expect(await screen.findByRole('alert')).toHaveTextContent('Service temporarily unavailable');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
  });

  it('displays customers and follows the customer/deal relationship', async () => {
    mount('/customers');
    const actor = userEvent.setup();
    await actor.click(await screen.findByRole('link', { name: 'Atlas Industries' }));
    expect(await screen.findByRole('heading', { name: 'Atlas Industries' })).toBeVisible();
    expect(await screen.findByRole('link', { name: 'Platform rollout' })).toHaveAttribute(
      'href',
      '/deals/1',
    );
    expect(screen.getByText('Security review pending.')).toBeVisible();
  });

  it('handles an empty customer list', async () => {
    server.use(http.get('http://localhost:8000/api/customers', () => HttpResponse.json(page([]))));
    mount('/customers');
    expect(await screen.findByText('No customers found')).toBeVisible();
  });

  it('returns to login and removes private query data on logout', async () => {
    mount();
    const actor = userEvent.setup();
    await screen.findByRole('heading', { name: 'Sales overview' });
    await actor.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Sales overview' })).not.toBeInTheDocument();
  });

  it('sends the selected deal stage to the API', async () => {
    let selectedStage: string | null = null;
    server.use(
      http.get('http://localhost:8000/api/deals', ({ request }) => {
        selectedStage = new URL(request.url).searchParams.get('stage');
        return HttpResponse.json(page([]));
      }),
    );
    mount('/deals');
    const actor = userEvent.setup();
    await actor.click(await screen.findByRole('button', { name: 'Negotiation' }));
    await waitFor(() => expect(selectedStage).toBe('negotiation'));
    expect(await screen.findByText('No deals found')).toBeVisible();
  });

  it('renders an AI summary with facts and record citations', async () => {
    mount('/customers/1');
    const actor = userEvent.setup();
    await actor.click(await screen.findByRole('button', { name: 'Generate summary' }));
    expect(await screen.findByRole('heading', { name: 'Negotiation overview' })).toBeVisible();
    expect(screen.getByText('The recorded negotiation value is USD 12500.25.')).toBeVisible();
    expect(screen.getAllByRole('link', { name: 'Platform rollout' }).length).toBe(2);
  });

  it('shows missing AI configuration honestly without a fabricated summary', async () => {
    server.use(
      http.post('http://localhost:8000/api/customers/1/ai-summary', () =>
        HttpResponse.json({ message: 'AI is not configured.' }, { status: 503 }),
      ),
    );
    mount('/customers/1');
    const actor = userEvent.setup();
    await actor.click(await screen.findByRole('button', { name: 'Generate summary' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('AI is not configured');
    expect(screen.queryByText('Grounded in your CRM records')).not.toBeInTheDocument();
  });

  it('submits a chat question and displays a grounded answer', async () => {
    mount('/assistant');
    const actor = userEvent.setup();
    await actor.type(
      await screen.findByLabelText('Ask about your deals'),
      'What is the negotiation value?',
    );
    await actor.click(screen.getByRole('button', { name: 'Send question' }));
    expect(await screen.findByText('What is the negotiation value?')).toBeVisible();
    expect(await screen.findByRole('heading', { name: 'Negotiation overview' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Platform rollout' })).toHaveAttribute(
      'href',
      '/deals/1',
    );
  });

  it('reads deal filters from the router URL on initial navigation', async () => {
    let requested: URLSearchParams | undefined;
    server.use(
      http.get('http://localhost:8000/api/deals', ({ request }) => {
        requested = new URL(request.url).searchParams;
        return HttpResponse.json(page([]));
      }),
    );
    mount('/deals?stage=negotiation&closing=this_month&customer_id=1');
    await screen.findByText('No deals found');
    expect(requested?.get('stage')).toBe('negotiation');
    expect(requested?.get('closing')).toBe('this_month');
    expect(requested?.get('customer_id')).toBe('1');
  });

  it('prefills an assistant question from the router URL', async () => {
    mount('/assistant?question=Show%20details%20for%20deal%201');
    expect(await screen.findByLabelText('Ask about your deals')).toHaveValue(
      'Show details for deal 1',
    );
  });

  it('retries a failed chat message without duplicating the user question', async () => {
    let attempts = 0;
    server.use(
      http.post('http://localhost:8000/api/assistant/messages', () => {
        attempts++;
        return attempts === 1
          ? HttpResponse.json({ message: 'Provider temporarily unavailable.' }, { status: 503 })
          : HttpResponse.json({ data: result });
      }),
    );
    mount('/assistant');
    const actor = userEvent.setup();
    const question = 'What is the negotiation value?';
    await actor.type(await screen.findByLabelText('Ask about your deals'), question);
    await actor.click(screen.getByRole('button', { name: 'Send question' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Provider temporarily unavailable.');
    await actor.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('heading', { name: 'Negotiation overview' })).toBeVisible();
    expect(screen.getAllByText(question)).toHaveLength(1);
    expect(attempts).toBe(2);
  });

  it('displays loading state while waiting for customer records', async () => {
    let release: () => void = () => {};
    server.use(
      http.get('http://localhost:8000/api/customers', async () => {
        await new Promise<void>((resolve) => {
          release = resolve;
        });
        return HttpResponse.json(page([]));
      }),
    );
    mount('/customers');
    await screen.findByRole('heading', { name: 'Customers' });
    expect(screen.getByRole('status')).toHaveTextContent('Loading your workspace');
    release();
    expect(await screen.findByText('No customers found')).toBeVisible();
  });
});
