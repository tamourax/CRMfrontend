import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on',
    ...devices['Desktop Chrome'],
  },
  webServer: [
    {
      command: 'php artisan serve --host=127.0.0.1 --port=8000 --no-reload',
      cwd: '../backend',
      url: 'http://127.0.0.1:8000/up',
      reuseExistingServer: !process.env.CI,
    },
    { command: 'npm run dev', url: 'http://127.0.0.1:5173', reuseExistingServer: !process.env.CI },
  ],
});
