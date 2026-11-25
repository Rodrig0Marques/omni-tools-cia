import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('lang')) localStorage.setItem('lang', 'en');
    if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'light');
  });
});

test('opens the global search with the keyboard and navigates to a tool', async ({
  page
}) => {
  await page.goto('/string/join');
  await expect(page.getByTestId('text-input')).toBeVisible();
  await page.keyboard.press('Control+k');
  const search = page.getByRole('dialog', { name: 'Search tools' });
  await expect(search).toBeVisible();
  await search.getByRole('combobox').fill('merge pdf');
  await search.getByRole('option').first().click();
  await expect(page).toHaveURL(/\/pdf\/merge-pdf$/);
  await expect(search).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('shows bookmarked tools in the favorites tab', async ({ page }) => {
  await page.goto('/string/join');
  await page
    .getByRole('button', { name: 'Add to favorites', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Remove from favorites', exact: true })
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('link', { name: 'Favorites', exact: true }).click();
  await expect(
    page.getByRole('tab', { name: 'Favorites (1)', exact: true })
  ).toHaveAttribute('aria-selected', 'true');
  await expect(
    page
      .getByRole('tabpanel')
      .getByRole('heading', { name: 'Join Text', exact: true })
  ).toBeVisible();
});

test('opens mobile navigation and changes the interface language', async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.getByRole('combobox', { name: 'Language', exact: true }).click();
  await page.getByRole('option', { name: 'Português', exact: true }).click();
  await page.getByRole('button', { name: 'Fechar menu', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Seu dia a dia,'
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
});

test('preserves the chosen dark theme across navigation and reloads', async ({
  page
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Theme: light', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Theme: dark', exact: true })
  ).toBeVisible();
  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    'rgb(16, 20, 28)'
  );
  await page.emulateMedia({ colorScheme: 'light' });
  await page.getByRole('link', { name: 'Favorites', exact: true }).click();
  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    'rgb(16, 20, 28)'
  );
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Theme: dark', exact: true })
  ).toBeVisible();
});

test('recovers from an empty category search', async ({ page }) => {
  await page.goto('/categories/string');
  await page
    .getByRole('textbox', { name: 'Search this category', exact: true })
    .fill('zzzxqnope');
  await expect(
    page.getByRole('heading', { name: 'No tools found', exact: true })
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Reset filters', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Join Text', exact: true })
  ).toBeVisible();
});

test('updates search results when the audience filter changes', async ({
  page
}) => {
  await page.goto('/');
  const search = page.getByRole('combobox', {
    name: 'Search all tools',
    exact: true
  });
  await search.fill('prettify json');
  await expect(page.getByRole('option').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await page
    .getByRole('button', { name: 'General users', exact: true })
    .click();
  await search.click();
  await expect(page.getByRole('option')).toHaveCount(0);
  await expect(page.getByText(/No results found/)).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Everyone', exact: true }).click();
  await search.click();
  await expect(page.getByRole('option').first()).toBeVisible();
});
