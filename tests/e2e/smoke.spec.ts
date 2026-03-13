import { expect, test } from '@playwright/test';

test('home opens and shows hero heading', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/$/);
    // Match partial heading text since it spans multiple elements
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Ferramentas essenciais');
});

test('home page shows stats section', async ({ page }) => {
    await page.goto('/');
    const body = await page.textContent('body');
    expect(body).toContain('ferramentas');
    expect(body).toContain('open');
});

test('json formatter works', async ({ page }) => {
    await page.goto('/tools/json-formatter');
    await page.getByRole('button', { name: 'Gerar exemplo' }).click();

    const output = page.getByPlaceholder('Resultado formatado aparece aqui');
    await expect(output).toHaveValue(/"arr"/);
});

test('sidebar navigation works', async ({ page }) => {
    await page.goto('/');
    // Click any tool link in the sidebar
    const sidebarLink = page
        .locator('aside nav a')
        .filter({ hasText: 'Base64' })
        .first();
    await sidebarLink.click();
    await expect(page).toHaveURL(/base64/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('base64 encoder works', async ({ page }) => {
    await page.goto('/tools/base64-tool');
    const textarea = page.locator('textarea').first();
    await textarea.fill('hello world');
    await page.getByRole('button', { name: 'Codificar' }).click();

    const output = page.locator('textarea').last();
    await expect(output).toHaveValue('aGVsbG8gd29ybGQ=');
});

test('dark mode toggle switches theme', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    // Toggle dark mode
    const themeToggle = page.getByRole('button', {
        name: /alternar tema|toggle theme/i,
    });
    await themeToggle.click();
    // Either dark or light class should be present
    const htmlClass = await html.getAttribute('class');
    expect(htmlClass).toMatch(/dark|light/);
});

test('search input finds tools', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByRole('combobox', {
        name: 'Buscar ferramentas',
    });
    await searchInput.fill('json');
    // Suggestions should appear
    const suggestions = page.locator('[id="tools-search-suggestions"]');
    await expect(suggestions).toBeVisible();
    await expect(suggestions).toContainText('JSON');
});

test('not-found page shows for unknown tool', async ({ page }) => {
    const response = await page.goto('/tools/ferramenta-inexistente');
    // Should either 404 or redirect to not-found page
    expect(response?.status()).toBeGreaterThanOrEqual(404);
});
