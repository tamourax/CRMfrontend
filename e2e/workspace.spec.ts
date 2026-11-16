import { expect, test } from '@playwright/test';

test('real PostgreSQL workspace: sign in, relationships, filters, AI state, logout, and isolation', async ({
  page,
  browser,
}, testInfo) => {
  test.setTimeout(60000);
  await page.goto('/');
  await page.getByLabel('Password', { exact: true }).fill('OrbitDemo!2026');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sales overview' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pipeline by stage' })).toBeVisible();
  const csrf = await page.request.post('http://localhost:8000/api/assistant/messages', {
    headers: { Origin: 'http://localhost:5173', Accept: 'application/json' },
    data: { question: 'Show my deals' },
  });
  expect(csrf.status()).toBe(419);
  await page.screenshot({ path: testInfo.outputPath('sales-overview.png'), fullPage: true });
  await page.getByRole('link', { name: 'Customers', exact: true }).click();
  await page.getByRole('link', { name: 'NileBridge Technologies', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'NileBridge Technologies', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Associated deals' })).toBeVisible();
  const customerUrl = page.url();
  const dealLink = page.locator('tbody a.strong-link').first();
  const dealTitle = await dealLink.textContent();
  await dealLink.click();
  await expect(page.getByRole('heading', { name: dealTitle!, exact: true, level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'NileBridge Technologies' })).toBeVisible();
  await page.getByRole('link', { name: 'Deals', exact: true }).click();
  await page.getByRole('button', { name: 'Negotiation', exact: true }).click();
  await expect(page.locator('tbody .badge').first()).toHaveText('Negotiation');
  await page.getByRole('link', { name: 'AI Assistant', exact: false }).first().click();
  await expect(page.getByRole('heading', { name: 'Your deal assistant' })).toBeVisible();
  const aiStatus = await page.request.get('http://localhost:8000/api/status', {
    headers: { Origin: 'http://localhost:5173', Accept: 'application/json' },
  });
  if (!(await aiStatus.json()).data.ai_configured) {
    await expect(page.getByText('AI is not configured yet', { exact: true })).toBeVisible();
    await page.getByLabel('Ask about your deals').fill('What are the highest-value open deals?');
    await page.getByRole('button', { name: 'Send question' }).click();
    await expect(page.getByRole('alert')).toContainText('AI is not configured');
  }
  const isolated = await browser.newContext();
  const otherPage = await isolated.newPage();
  await otherPage.goto('http://localhost:5173/');
  await otherPage.getByLabel('Work email').fill('nour@7bahmedtamer.example');
  await otherPage.getByLabel('Password', { exact: true }).fill('OrbitDemo!2026');
  await otherPage.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(otherPage.getByRole('heading', { name: 'Sales overview' })).toBeVisible();
  const foreignId = customerUrl.split('/').pop();
  const response = await isolated.request.get(`http://localhost:8000/api/customers/${foreignId}`, {
    headers: { Origin: 'http://localhost:5173', Accept: 'application/json' },
  });
  expect(response.status()).toBe(404);
  await isolated.close();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
});

test('mobile navigation and layout remain usable', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByLabel('Password', { exact: true }).fill('OrbitDemo!2026');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sales overview' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'High-value opportunities' })).toBeVisible();
  await page.locator('tbody tr').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  const layout = await page.evaluate(() => ({
    width: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflow: Array.from(document.querySelectorAll('body *'))
      .filter((element) => element.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 8)
      .map((element) => ({
        tag: element.tagName,
        className: element.className,
        right: element.getBoundingClientRect().right,
      })),
  }));
  expect(layout.scrollWidth, JSON.stringify(layout)).toBeLessThanOrEqual(layout.width);
  await page.screenshot({ path: testInfo.outputPath('mobile-overview.png'), fullPage: true });
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('link', { name: 'Customers', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Customers', exact: true })).toBeVisible();
});
