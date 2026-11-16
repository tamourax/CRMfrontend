import { expect, test } from '@playwright/test';

test('English and Arabic journeys fit phone and tablet viewports in both themes', async ({
  page,
}, testInfo) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  const assertFits = async () => {
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      await page.evaluate(() => innerWidth),
    );
  };
  await assertFits();
  await page.getByLabel('Password', { exact: true }).fill('OrbitDemo!2026');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.locator('.stats-grid')).toBeVisible();
  await page.goto('/customers');
  const customerLink = page.locator('tbody .strong-link').first();
  await customerLink.waitFor();
  const customerPath = await customerLink.getAttribute('href');
  await customerLink.click();
  const dealLink = page.locator('tbody .strong-link').first();
  await dealLink.waitFor();
  const dealPath = await dealLink.getAttribute('href');
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const locale of ['en', 'ar']) {
      if ((await page.locator('html').getAttribute('lang')) !== locale)
        await page.locator('.locale-toggle').click();
      await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
      for (const theme of ['light', 'dark']) {
        if ((await page.locator('html').getAttribute('data-theme')) !== theme)
          await page.locator('.preference-toggle').click();
        for (const path of ['/', '/customers', customerPath!, '/deals', dealPath!, '/assistant']) {
          await page.goto(path);
          await expect(page.locator('h1')).toBeVisible();
          await expect(page.locator('.state[role="status"]')).toHaveCount(0);
          await assertFits();
        }
      }
      if (width < 700) {
        await page.locator('.mobile-menu').click();
        await expect(page.locator('.sidebar')).toBeVisible();
        await expect
          .poll(async () => {
            const box = await page.locator('.sidebar').boundingBox();
            return Math.round(locale === 'ar' ? box!.x + box!.width : box!.x);
          })
          .toBe(locale === 'ar' ? width : 0);
        await page.screenshot({ path: testInfo.outputPath(`${width}-${locale}-drawer.png`) });
        await page
          .locator('.drawer-backdrop')
          .click({ position: { x: locale === 'ar' ? 10 : width - 10, y: 400 } });
        await expect(page.locator('.mobile-menu')).toHaveAttribute('aria-expanded', 'false');
      }
    }
  }
  await page.getByRole('button', { name: 'تسجيل الخروج', exact: true }).click();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.getByRole('button', { name: 'تسجيل الدخول', exact: true })).toBeVisible();
    await assertFits();
    await page.screenshot({ path: testInfo.outputPath(`${width}-arabic-login.png`) });
  }
});
