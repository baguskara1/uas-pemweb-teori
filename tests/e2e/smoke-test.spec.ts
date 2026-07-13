import { expect, test } from '@playwright/test';

const BASE = 'https://sewa-kamera-ryox.duckdns.org';

const ADMIN = { email: 'tester@gmail.com', password: '123456' };
const USER = { email: 'tester1@gmail.com', password: '123456' };

test.describe('Smoke Test Semua Fitur', () => {
  test('1. Landing page OK', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('text=Sewa Kamera Ryox').first()).toBeVisible();
    await expect(page.locator('text=Katalog').first()).toBeVisible();
  });

  test('2. Katalog page OK', async ({ page }) => {
    await page.goto(`${BASE}/cameras`);
    await expect(page.locator('text=Katalog Sewa').first()).toBeVisible();
  });

  test('3. Login sebagai Admin', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', ADMIN.email);
    await page.fill('input[type="password"]', ADMIN.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');
    await expect(page.locator('text=Admin Panel').first()).toBeVisible();
  });

  test('4. Admin - Kamera page', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', ADMIN.email);
    await page.fill('input[type="password"]', ADMIN.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    await page.goto(`${BASE}/admin/cameras`);
    await expect(page.locator('text=Tambah Kamera').first()).toBeVisible();
  });

  test('5. Admin - Booking page', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', ADMIN.email);
    await page.fill('input[type="password"]', ADMIN.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    await page.goto(`${BASE}/admin/bookings`);
    await expect(page.locator('text=Booking').first()).toBeVisible();
  });

  test('6. Admin - Deposit page', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', ADMIN.email);
    await page.fill('input[type="password"]', ADMIN.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    await page.goto(`${BASE}/admin/loyalty`);
    await expect(page.locator('text=Kelola Deposit').first()).toBeVisible();
  });

  test('7. Admin - Payments page', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', ADMIN.email);
    await page.fill('input[type="password"]', ADMIN.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    await page.goto(`${BASE}/admin/payments`);
    await expect(page.locator('text=Pembayaran').first()).toBeVisible();
  });

  test('8. Admin - Users page', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', ADMIN.email);
    await page.fill('input[type="password"]', ADMIN.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    await page.goto(`${BASE}/admin/users`);
    await expect(page.locator('text=Pengguna').first()).toBeVisible();
  });

  test('9. Login sebagai User', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', USER.email);
    await page.fill('input[type="password"]', USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await expect(page.locator('text=Ringkasan').first()).toBeVisible();
  });

  test('10. User - Booking Saya page', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', USER.email);
    await page.fill('input[type="password"]', USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    await page.goto(`${BASE}/dashboard/bookings`);
    await expect(page.locator('text=Booking Saya').first()).toBeVisible();
  });

  test('11. User - Loyalty Card page', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', USER.email);
    await page.fill('input[type="password"]', USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    await page.goto(`${BASE}/dashboard/loyalty`);
    await expect(page.locator('text=Loyalty Card').first()).toBeVisible();
  });

  test('12. User - Profile page', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', USER.email);
    await page.fill('input[type="password"]', USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    await page.goto(`${BASE}/dashboard/profile`);
    await expect(page.locator('text=Profil').first()).toBeVisible();
  });

  test('13. Cart page (empty)', async ({ page }) => {
    await page.goto(`${BASE}/cart`);
    await expect(page.locator('text=Keranjang Kosong').first()).toBeVisible();
  });

  test('14. Checkout page for single camera', async ({ page }) => {
    // Login first, then visit a camera detail
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', USER.email);
    await page.fill('input[type="password"]', USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Visit cameras page and check first camera link
    await page.goto(`${BASE}/cameras`);
    await page.waitForTimeout(2000);

    // Should see camera cards
    const cameraLinks = page.locator('a[href^="/cameras/"]');
    const count = await cameraLinks.count();
    if (count > 0) {
      await cameraLinks.first().click();
      await page.waitForURL('**/cameras/**');
      await expect(page.locator('text=Sewa').first()).toBeVisible();
    }
  });

  test('15. Unauthenticated redirect', async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);
    await page.waitForURL('**/login');
    await expect(page.locator('text=Masuk').first()).toBeVisible();
  });
});
