import { expect, test } from '@playwright/test';

test('live configured AI returns the same negotiation total as the report', async ({ page }) => {
  test.skip(process.env.RUN_LIVE_AI !== '1', 'Opt-in only: uses the backend provider quota.');
  test.setTimeout(90000);
  await page.goto('/');
  await page.getByLabel('Password', { exact: true }).fill('OrbitDemo!2026');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sales overview' })).toBeVisible();
  const reportResponse = await page.request.get('http://localhost:8000/api/reports/sales', {
    headers: { Origin: 'http://localhost:5173', Accept: 'application/json' },
  });
  const report = (await reportResponse.json()).data;
  const negotiation = report.stages.find(
    (stage: { stage: string }) => stage.stage === 'negotiation',
  );
  await page.getByRole('link', { name: 'AI Assistant', exact: false }).first().click();
  await page
    .getByLabel('Ask about your deals')
    .fill('What is the total value of deals in the Negotiation stage?');
  const pending = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/assistant/messages') && response.request().method() === 'POST',
    { timeout: 65000 },
  );
  await page.getByRole('button', { name: 'Send question' }).click();
  const response = await pending;
  const body = await response.json();
  expect(response.status(), body.message).toBe(200);
  expect(body.data.facts.total_value).toBe(negotiation.value);
  expect(body.data.facts.deal_count).toBe(negotiation.count);
  await expect(page.getByText('Grounded in your CRM records', { exact: true })).toBeVisible();
});
