import { expect, test } from '@playwright/test';
import path from 'path';

const imagePath = path.resolve(
  'src/pages/tools/image/png/convert-jgp-to-png/test.jpg'
);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('lang', 'en');
    localStorage.setItem('theme', 'dark');
  });
});

test('clears text output, preserves input/options and computes the next edit', async ({
  page
}) => {
  await page.goto('/string/join');
  await page.getByTestId('text-input').fill('alpha\nbeta');
  await expect(page.getByTestId('text-result')).toHaveValue('alphabeta');
  await page.getByRole('button', { name: 'Clear output', exact: true }).click();
  await expect(page.getByTestId('text-result')).toHaveValue('');
  await expect(page.getByTestId('text-input')).toHaveValue('alpha\nbeta');
  await expect(
    page.getByRole('button', { name: 'Download', exact: true })
  ).toBeDisabled();
  await page.getByTestId('text-input').fill('gamma\ndelta');
  await expect(page.getByTestId('text-result')).toHaveValue('gammadelta');
});

test('downloads a valid file even when its preview is immediately cleared', async ({
  page
}) => {
  await page.goto('/png/convert-jgp-to-png');
  await page.locator('input[type=file]').setInputFiles(imagePath);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download', exact: true }).click();
  await page.getByRole('button', { name: 'Clear output', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('test.png');
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const bytes = Buffer.concat(chunks);
  expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(await download.failure()).toBeNull();
  await expect(
    page.getByRole('img', { name: 'Result', exact: true })
  ).toHaveCount(0);
  await expect(
    page.getByRole('img', { name: 'Preview', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Download', exact: true })
  ).toBeDisabled();
  await page.locator('input[type=file]').setInputFiles(imagePath);
  await expect(
    page.getByRole('button', { name: 'Download', exact: true })
  ).toBeEnabled();
});

test('clears a batch and its ZIP while keeping the imported images', async ({
  page
}) => {
  await page.goto('/image-generic/resize');
  await page.locator('input[type=file]').setInputFiles([imagePath, imagePath]);
  await expect(
    page.getByRole('button', { name: 'Download all as ZIP', exact: true })
  ).toBeEnabled();
  await page.getByRole('button', { name: 'Clear output', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Download all as ZIP', exact: true })
  ).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Download', exact: true })
  ).toBeDisabled();
  await expect(page.locator('input[type=file]')).toBeAttached();
  await expect(
    page.getByRole('img', { name: 'test.jpg', exact: true })
  ).toHaveCount(2);
});

test('keeps the interface responsive during simulated worker processing and clears the output', async ({
  context,
  page
}) => {
  await context.route(/background-removal\.worker/, (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `self.onmessage = ({data: {id, file}}) => {
      self.postMessage({id, type:'progress', progress:{key:'compute:inference',current:1,total:4}});
      setTimeout(() => {
        const until = performance.now() + 2500;
        while (performance.now() < until) { /* simulate CPU inference in worker */ }
        self.postMessage({id, type:'complete', blob:file});
      }, 100);
    };`
    })
  );
  await page.goto('/image-generic/remove-background');
  await page.locator('input[type=file]').setInputFiles(imagePath);
  await expect(page.getByRole('progressbar')).toBeVisible();
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog', { name: 'Search tools' })).toBeVisible({
    timeout: 1000
  });
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Download', exact: true })
  ).toBeEnabled();
  await page.getByRole('button', { name: 'Clear output', exact: true }).click();
  await expect(
    page.getByRole('img', { name: 'Result', exact: true })
  ).toHaveCount(0);
  await expect(
    page.getByRole('img', { name: 'Preview', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Clear output', exact: true })
  ).toBeDisabled();
});
