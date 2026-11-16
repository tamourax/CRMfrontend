import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

await mkdir('docs/demo-capture', { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: 'docs/demo-capture', size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
page.setDefaultTimeout(65000);
const pause = () => page.waitForTimeout(1400);
const waitForAi = async (path, trigger) => {
  const pending = page.waitForResponse(
    (response) => response.url().includes(path) && response.request().method() === 'POST',
    { timeout: 65000 },
  );
  await trigger();
  const response = await pending;
  await page.locator('.ai-content, [role="alert"]').first().waitFor();
  if (!response.ok())
    console.log(
      'AI request returned HTTP ' +
        response.status() +
        '; the real error is visible in the recording.',
    );
  return response.ok();
};
await page.goto('http://localhost:5173');
await page.getByRole('heading', { name: 'Welcome back' }).waitFor();
await pause();
await page.getByLabel('Password', { exact: true }).fill('OrbitDemo!2026');
await page.getByRole('button', { name: 'Sign in', exact: true }).click();
await page.getByRole('heading', { name: 'Sales overview' }).waitFor();
await page.getByRole('heading', { name: 'High-value opportunities' }).waitFor();
const status = await page.request.get('http://localhost:8000/api/status', {
  headers: { Origin: 'http://localhost:5173', Accept: 'application/json' },
});
const liveAi = (await status.json()).data.ai_configured;
await mkdir('docs/images', { recursive: true });
await page.screenshot({ path: 'docs/images/overview.png', fullPage: true });
await pause();
await page.getByRole('heading', { name: 'Pipeline by stage' }).scrollIntoViewIfNeeded();
await pause();
await page.getByRole('heading', { name: 'The story behind your numbers' }).scrollIntoViewIfNeeded();
if (liveAi) {
  await waitForAi('/api/reports/sales/ai-summary', () =>
    page.getByRole('button', { name: 'Generate summary' }).click(),
  );
  await page.locator('.ai-content, [role="alert"]').first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'docs/images/sales-ai.png', fullPage: true });
}
await pause();
await page.getByRole('link', { name: 'Customers', exact: true }).click();
await page.getByRole('link', { name: 'Atlas Industries', exact: true }).waitFor();
await pause();
await page.getByRole('link', { name: 'Atlas Industries', exact: true }).click();
await page.getByRole('heading', { name: 'Associated deals' }).waitFor();
await pause();
await waitForAi('/ai-summary', () =>
  page.getByRole('button', { name: 'Generate summary' }).click(),
);
await page.locator('.ai-content, [role="alert"]').first().scrollIntoViewIfNeeded();
await page.screenshot({ path: 'docs/images/customer.png', fullPage: true });
await pause();
await page.locator('tbody a.strong-link').first().click();
await page.getByRole('heading', { name: 'Deal overview' }).waitFor();
await pause();
await page.getByRole('link', { name: 'Deals', exact: true }).click();
await page.getByRole('button', { name: 'Negotiation', exact: true }).click();
await page.locator('tbody .badge').first().waitFor();
await pause();
await page.getByRole('link', { name: 'AI Assistant', exact: false }).first().click();
if (!liveAi) await page.getByText('AI is not configured yet', { exact: true }).waitFor();
await pause();
await page.getByLabel('Ask about your deals').fill('What are the highest-value open deals?');
await waitForAi('/api/assistant/messages', () =>
  page.getByRole('button', { name: 'Send question' }).click(),
);
await page.screenshot({ path: 'docs/images/assistant.png', fullPage: true });
await pause();
await page.getByRole('button', { name: 'Sign out' }).click();
await page.getByRole('heading', { name: 'Welcome back' }).waitFor();
await pause();
const video = page.video();
await context.close();
await video.saveAs('docs/demo.webm');
await browser.close();
console.log(
  'Saved docs/demo.webm and screenshots using ' +
    (liveAi ? 'live AI responses' : 'the honest missing-key state') +
    '.',
);
