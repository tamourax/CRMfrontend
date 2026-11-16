import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const baseUrl = 'http://localhost:5173';
const apiUrl = 'http://localhost:8000';
const outputPath = 'docs/demo.webm';

await mkdir('docs/demo-capture', { recursive: true });
await mkdir('docs/images', { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: 'docs/demo-capture', size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
page.setDefaultTimeout(65000);
const pause = (milliseconds = 1900) => page.waitForTimeout(milliseconds);

async function chapter(number, title, description) {
  await page.evaluate(
    ({ number, title, description }) => {
      document.getElementById('demo-chapter')?.remove();
      if (!document.getElementById('demo-chapter-style')) {
        const style = document.createElement('style');
        style.id = 'demo-chapter-style';
        style.textContent = `
          #demo-chapter { position: fixed; z-index: 2147483647; left: 28px; bottom: 28px;
            width: min(470px, calc(100vw - 56px)); padding: 15px 19px;
            border: 1px solid rgba(255,255,255,.18); border-radius: 14px;
            background: rgba(11, 38, 33, .96); box-shadow: 0 14px 40px rgba(0,0,0,.22);
            color: #f5f8f3; font: 14px/1.5 system-ui, sans-serif; direction: ltr; text-align: left;
            animation: demo-chapter-in .24s ease-out both; pointer-events: none; }
          #demo-chapter small { display: block; margin-bottom: 4px; color: #a9c89e;
            font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
          #demo-chapter strong { display: block; font-size: 18px; line-height: 1.3; }
          #demo-chapter span { display: block; margin-top: 4px; color: #c5d2ce; font-size: 12px; }
          @keyframes demo-chapter-in { from { opacity: 0; transform: translateY(7px); }
            to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.append(style);
      }
      const card = document.createElement('div');
      card.id = 'demo-chapter';
      const kicker = document.createElement('small');
      kicker.textContent = `7B AHMED TAMER  ·  ${number}`;
      const heading = document.createElement('strong');
      heading.textContent = title;
      const detail = document.createElement('span');
      detail.textContent = description;
      card.append(kicker, heading, detail);
      document.body.append(card);
    },
    { number, title, description },
  );
  await pause(2300);
  await page.evaluate(() => document.getElementById('demo-chapter')?.remove());
}

async function requestAi(path, trigger, resultSelector) {
  const responsePromise = page.waitForResponse(
    (response) => response.url().includes(path) && response.request().method() === 'POST',
    { timeout: 65000 },
  );
  await trigger();
  const response = await responsePromise;
  await page.locator(resultSelector).first().waitFor();
  console.log(`AI demonstration ${path}: HTTP ${response.status()}.`);
  return response.ok();
}

try {
  await page.goto(baseUrl);
  await page.getByRole('heading', { name: 'Welcome back' }).waitFor();
  await chapter(
    '01',
    'One workspace, clear next steps',
    'A quick tour of customers, deals, and grounded AI.',
  );
  await page.getByLabel('Password', { exact: true }).fill('OrbitDemo!2026');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('heading', { name: 'Sales overview' }).waitFor();
  await page.getByRole('heading', { name: 'High-value opportunities' }).waitFor();

  const statusResponse = await page.request.get(`${apiUrl}/api/status`, {
    headers: { Origin: baseUrl, Accept: 'application/json' },
  });
  if (!statusResponse.ok())
    throw new Error(`Could not read authenticated AI status (${statusResponse.status()}).`);
  const liveAi = (await statusResponse.json()).data.ai_configured === true;
  if (!liveAi)
    throw new Error('Configure the backend AI provider before recording the complete demo.');
  await chapter(
    '02',
    'Start with the real pipeline',
    'Metrics and report figures are calculated from your CRM records.',
  );
  await page.screenshot({ path: 'docs/images/overview.png', fullPage: true });
  await page.getByRole('heading', { name: 'Pipeline by stage' }).scrollIntoViewIfNeeded();
  await pause();
  await page
    .getByRole('heading', { name: 'The story behind your numbers' })
    .scrollIntoViewIfNeeded();
  await pause();
  if (liveAi) {
    const reportSummaryOk = await requestAi(
      '/api/reports/sales/ai-summary',
      () => page.getByRole('button', { name: 'Generate summary' }).click(),
      '.ai-content, .ai-panel [role="alert"]',
    );
    if (!reportSummaryOk)
      throw new Error('The live sales report summary did not pass backend verification.');
    await page.locator('.ai-content, .ai-panel [role="alert"]').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'docs/images/sales-ai.png', fullPage: true });
    await pause();
  }

  await page.getByRole('link', { name: 'Customers', exact: true }).click();
  const customerLink = page.getByRole('link', { name: 'NileBridge Technologies', exact: true });
  await customerLink.waitFor();
  await chapter(
    '03',
    'Get to know the customer',
    'Review Egyptian contact details, relationship notes, and associated opportunities.',
  );
  await customerLink.click();
  await page.getByRole('heading', { name: 'Associated deals' }).waitFor();
  await page.getByRole('heading', { name: 'Contact & company' }).waitFor();
  await pause();
  if (liveAi) {
    const customerSummaryOk = await requestAi(
      '/ai-summary',
      () => page.getByRole('button', { name: 'Generate summary' }).click(),
      '.ai-content, .ai-panel [role="alert"]',
    );
    if (!customerSummaryOk)
      throw new Error('The live customer summary did not pass backend verification.');
    await page.locator('.ai-content, .ai-panel [role="alert"]').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'docs/images/customer.png', fullPage: true });
    await pause();
  }

  await page.locator('tbody a.strong-link').first().click();
  await page.getByRole('heading', { name: 'Project scope' }).waitFor();
  await chapter(
    '04',
    'Follow a deal from relationship to project',
    'See its EGP value, stage, expected close, and delivery scope.',
  );
  await page.screenshot({ path: 'docs/images/deal.png', fullPage: true });
  await pause();
  await page.getByRole('link', { name: 'Deals', exact: true }).click();
  await page.getByRole('heading', { name: 'Deals', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Negotiation', exact: true }).click();
  await page.locator('tbody .badge').first().waitFor();
  await page.screenshot({ path: 'docs/images/deals.png', fullPage: true });
  await pause();

  await page.getByRole('link', { name: 'AI Assistant', exact: false }).first().click();
  await page.getByRole('heading', { name: 'Your deal assistant' }).waitFor();
  await chapter(
    '05',
    'Ask a question, verify the records',
    'The assistant answers from accessible deals and links back to its sources.',
  );
  await page
    .getByLabel('Ask about your deals')
    .fill('What is the total value of deals in the Negotiation stage?');
  const assistantAnswerOk = await requestAi(
    '/api/assistant/messages',
    () => page.getByRole('button', { name: 'Send question' }).click(),
    '.assistant-message .ai-content, .assistant-message [role="alert"]',
  );
  if (!assistantAnswerOk)
    throw new Error('The live deal assistant answer did not pass backend verification.');
  await page
    .locator('.assistant-message .ai-content, .assistant-message [role="alert"]')
    .first()
    .scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'docs/images/assistant.png', fullPage: true });
  await pause(2600);

  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await page.getByRole('heading', { name: 'Sales overview' }).waitFor();
  await page.locator('button.locale-toggle').click();
  await page.waitForFunction(() => document.documentElement.dir === 'rtl');
  await page.locator('button.preference-toggle').click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await chapter(
    '06',
    'Make the workspace yours',
    'Switch language, right-to-left layout, and appearance.',
  );
  await pause(1200);
  await page.locator('button.preference-toggle').click();
  await page.locator('button.locale-toggle').click();
  await page.waitForFunction(() => document.documentElement.dir === 'ltr');
  await pause(800);
  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.getByRole('heading', { name: 'Welcome back' }).waitFor();
  await chapter('07', 'A secure end to the journey', 'Sign out and keep each workspace private.');

  const video = page.video();
  await context.close();
  await video.saveAs(outputPath);
  console.log(`Saved ${outputPath} with verified live AI responses.`);
} finally {
  await context.close().catch(() => {});
  await browser.close();
}
