import { expect, test } from '@playwright/test';

test('home opens and lists project title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole('heading', {
      name: 'Ferramentas essenciais para fluxo de desenvolvimento moderno',
    }),
  ).toBeVisible();
});

test('json formatter works', async ({ page }) => {
  await page.goto('/tools/json-formatter');
  await page.getByRole('button', { name: 'Gerar exemplo' }).click();

  const output = page.getByPlaceholder('Resultado formatado aparece aqui');
  await expect(output).toHaveValue(/"arr"/);
});
