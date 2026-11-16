import { expect, test } from '@playwright/test';

test('real PostgreSQL workspace: sign in, relationships, filters, AI state, logout, and isolation', async ({ page, browser }, testInfo) => {
  await page.goto('/');
  await page.getByLabel('Password', { exact: true }).fill('OrbitDemo!2026');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sales overview' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pipeline by stage' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('sales-overview.png'), fullPage: true });
  await page.getByRole('link', { name: 'Customers', exact: true }).click();
  await page.getByRole('link', { name: 'Atlas Industries', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Atlas Industries', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Associated deals' })).toBeVisible();
  const customerUrl = page.url();
  const dealLink = page.locator('tbody a.strong-link').first();
  const dealTitle = await dealLink.textContent();
  await dealLink.click();
  await expect(page.getByRole('heading', { name: dealTitle!, exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Atlas Industries' })).toBeVisible();
  await page.getByRole('link', { name: 'Deals', exact: true }).click();
  await page.getByRole('button', { name: 'Negotiation', exact: true }).click();
  await expect(page.locator('tbody .badge').first()).toHaveText('Negotiation');
  await page.getByRole('link', { name: 'AI Assistant', exact: false }).first().click();
  await expect(page.getByRole('heading', { name: 'Your deal assistant' })).toBeVisible();
  if (await page.getByText('AI is not configured yet', { exact: true }).isVisible()) {
    await page.getByLabel('Ask about your deals').fill('What are the highest-value open deals?');
    await page.getByRole('button', { name: 'Send question' }).click();
    await expect(page.getByRole('alert')).toContainText('AI is not configured');
  }
  const isolated = await browser.newContext();
  const otherPage = await isolated.newPage();
  await otherPage.goto('http://localhost:5173/');
  await otherPage.getByLabel('Work email').fill('sarah@orbit.example');
  await otherPage.getByLabel('Password', { exact: true }).fill('OrbitDemo!2026');
  await otherPage.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(otherPage.getByRole('heading', { name: 'Sales overview' })).toBeVisible();
  const foreignId = customerUrl.split('/').pop();
  const response = await isolated.request.get(`http://localhost:8000/api/customers/${foreignId}`, { headers: { Origin: 'http://localhost:5173', Accept: 'application/json' } });
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
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.screenshot({ path: testInfo.outputPath('mobile-overview.png'), fullPage: true });
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('link', { name: 'Customers', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Customers', exact: true })).toBeVisible();
});
