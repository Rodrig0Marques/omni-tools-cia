import { expect, test } from '@playwright/test';
import path from 'node:path';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lang', 'en'));
});

test('saves a tool configuration across reloads and restores defaults without clearing input', async ({
  page
}) => {
  await page.goto('/string/join');
  const options = page
    .getByText('Tool options', { exact: true })
    .locator('..')
    .locator('..');
  await page.getByTestId('text-input').fill('one\ntwo');
  await options.getByPlaceholder('Join Character', { exact: true }).fill('|');
  await expect(page.getByTestId('text-result')).toHaveValue('one|two');
  await page
    .getByRole('button', { name: 'Save configuration', exact: true })
    .click();
  const dialog = page.getByRole('dialog', { name: 'Save configuration' });
  await dialog
    .getByRole('textbox', { name: 'Configuration name' })
    .fill('Pipes');
  await dialog.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(dialog).toBeHidden();

  const stored = await page.evaluate(() =>
    localStorage.getItem('omni-tools:presets:string/join')
  );
  expect(JSON.parse(stored!)).toEqual({
    version: 1,
    presets: [
      {
        name: 'Pipes',
        values: { joinCharacter: '|', deleteBlank: true, deleteTrailing: true }
      }
    ]
  });

  await page.reload();
  await expect(
    options.getByPlaceholder('Join Character', { exact: true })
  ).toHaveValue('');
  await page.getByTestId('text-input').fill('three\nfour');
  await page
    .getByRole('combobox', { name: 'Saved configurations' })
    .selectOption('Pipes');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(page.getByTestId('text-result')).toHaveValue('three|four');
  await page
    .getByRole('button', { name: 'Restore defaults', exact: true })
    .click();
  await expect(page.getByTestId('text-result')).toHaveValue('threefour');
  await expect(page.getByTestId('text-input')).toHaveValue('three\nfour');

  await page.goto('/list/sort');
  await expect(
    page.getByRole('combobox', { name: 'Saved configurations' })
  ).toBeDisabled();
});

test('saves image resize preferences without persisting uploaded files', async ({
  page
}) => {
  await page.goto('/image-generic/resize');
  await page.getByTestId('width-input').fill('1024');
  await page
    .getByRole('button', { name: 'Save configuration', exact: true })
    .click();
  const dialog = page.getByRole('dialog');
  await dialog
    .getByRole('textbox', { name: 'Configuration name' })
    .fill('Website images');
  await dialog.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(dialog).toBeHidden();
  await page.reload();
  const fileInput = page.locator('input[type="file"]');
  const sourceImage = page.getByRole('img', { name: 'test.jpg', exact: true });
  await expect(sourceImage).toHaveCount(0);
  await fileInput.setInputFiles(
    path.resolve('src/pages/tools/image/png/convert-jgp-to-png/test.jpg')
  );
  await expect(sourceImage).toBeVisible();
  await page
    .getByRole('combobox', { name: 'Saved configurations' })
    .selectOption('Website images');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(page.getByTestId('width-input')).toHaveValue('1024');
  await page
    .getByRole('button', { name: 'Restore defaults', exact: true })
    .click();
  await expect(page.getByTestId('width-input')).toHaveValue('800');
  await expect(sourceImage).toBeVisible();
  const stored = await page.evaluate(() =>
    localStorage.getItem('omni-tools:presets:image-generic/resize')
  );
  expect(JSON.parse(stored!).presets[0].values).toEqual({
    resizeMethod: 'pixels',
    dimensionType: 'width',
    width: '1024',
    height: '600',
    percentage: '50',
    maintainAspectRatio: true
  });
});
