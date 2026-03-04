import { expect, test } from '@playwright/test';

test('home opens and lists project title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole('heading', { name: 'Toolkit fullstack para o dia a dia' }),
  ).toBeVisible();
});

test('json formatter works', async ({ page }) => {
  await page.goto('/tools/json-formatter');

  const input = page.locator('textarea').first();
  await input.fill('{"b":2,"a":1}');
  await page.getByRole('button', { name: 'Formatar' }).click();

  const output = page.locator('textarea').nth(1);
  await expect(output).toContainText('"b": 2');
});
