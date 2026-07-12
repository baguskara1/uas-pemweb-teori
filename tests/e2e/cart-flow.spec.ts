import { expect, test } from '@playwright/test';

const mockSnapToken = 'midtrans-snap-token-test-12345';
const mockSnapUrl =
  'https://app.sandbox.midtrans.com/snap/v4/redirection/midtrans-snap-token-test-12345';

test.describe.configure({ retries: 1 });

test.beforeEach(async ({ page }) => {
  test.setTimeout(30000);
});

async function clickKameraFilter(page: import('@playwright/test').Page) {
  await page
    .locator('button:has-text("Kamera")')
    .first()
    .evaluate((el) => (el as HTMLElement).click());
  await page.waitForTimeout(300);
}

function setReactInputValue(
  page: import('@playwright/test').Page,
  selector: string,
  value: string,
) {
  return page.evaluate(
    ({ selector, value }) => {
      const el = document.querySelector(selector) as HTMLInputElement | null;
      if (!el) return;
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      nativeSetter?.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { selector, value },
  );
}

test.describe('Cart Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('ryox-cart', JSON.stringify([]));
    });

    await page.route('/api/payments/midtrans/multi-submit', async (route) => {
      const request = route.request();
      const body = await request.postDataJSON();

      expect(body).toHaveProperty('items');
      expect(body.items).toBeInstanceOf(Array);
      expect(body.items.length).toBeGreaterThanOrEqual(1);
      expect(body).toHaveProperty('payMethod');
      expect(body).toHaveProperty('start_date');
      expect(body).toHaveProperty('end_date');

      expect(body.start_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(body.end_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(body.end_date).getTime()).toBeGreaterThan(
        new Date(body.start_date).getTime(),
      );

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Multi-item payment initialized',
          data: {
            paymentId: 'pay-test-123',
            orderId: 'camera-rental-multi-test-123',
            snapToken: mockSnapToken,
            snapUrl: mockSnapUrl,
            amount: 1400000,
            midtransConfig: {
              clientKey: 'SB-Mid-client-test-key',
              environment: 'sandbox',
              isProduction: false,
            },
          },
        }),
      });
    });
  });

  test('Complete cart flow: add 2 items → open cart → set dates → select payment → click Bayar → expect Midtrans Snap', async ({
    page,
  }) => {
    await page.goto('/cameras');
    await page.waitForLoadState('load');

    await clickKameraFilter(page);

    await expect(page.locator('a[href^="/cameras/"]').first()).toBeVisible({ timeout: 10000 });

    const firstCard = page
      .locator('a[href^="/cameras/"]')
      .filter({ hasText: 'Fujifilm X-T5' })
      .first();
    await firstCard
      .locator('button:has-text("Tambah")')
      .evaluate((el) => (el as HTMLElement).click());
    await page.waitForTimeout(500);

    const secondCard = page
      .locator('a[href^="/cameras/"]')
      .filter({ hasText: 'Canon EOS R6' })
      .first();
    await secondCard
      .locator('button:has-text("Tambah")')
      .evaluate((el) => (el as HTMLElement).click());
    await page.waitForTimeout(500);

    const cartButton = page.locator('button[aria-label="Keranjang"]').first();
    await expect(cartButton).toBeVisible();
    await cartButton.evaluate((el) => (el as HTMLElement).click());

    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const startDate = tomorrow.toISOString().split('T')[0];
    const endDate = threeDaysLater.toISOString().split('T')[0];

    await setReactInputValue(page, '#cart-start-date', startDate);
    await page.waitForTimeout(300);

    await setReactInputValue(page, '#cart-end-date', endDate);
    await page.waitForTimeout(300);

    await expect(page.locator('text=× 2 hari').first()).toBeVisible({ timeout: 5000 });

    await page
      .locator('input[type="radio"][name="payment-method"][value="gopay"]')
      .evaluate((el) => (el as HTMLElement).click());
    await expect(
      page.locator('input[type="radio"][name="payment-method"][value="gopay"]'),
    ).toBeChecked();

    const bayarButton = page.locator('button:has-text("Bayar")').first();
    await expect(bayarButton).toBeEnabled({ timeout: 5000 });
    await bayarButton.evaluate((el) => (el as HTMLElement).click());

    await expect(page).toHaveURL(/midtrans|snap/, { timeout: 10000 });

    expect(page.url()).toContain(mockSnapToken);
  });

  test('Cart modal opens with empty state when no items', async ({ page }) => {
    await page.goto('/cameras');
    await page.waitForLoadState('load');

    const cartButton = page.locator('button[aria-label="Keranjang"]').first();
    await expect(cartButton).toBeVisible();
    await cartButton.evaluate((el) => (el as HTMLElement).click());
    await page.waitForTimeout(1000);

    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
    await expect(
      page.locator('[role="dialog"]').locator('text=Keranjang masih kosong'),
    ).toBeVisible();
  });

  test('Can remove item from cart', async ({ page }) => {
    await page.goto('/cameras');
    await page.waitForLoadState('load');

    await clickKameraFilter(page);

    const firstCard = page
      .locator('a[href^="/cameras/"]')
      .filter({ hasText: 'Fujifilm X-T5' })
      .first();
    await firstCard
      .locator('button:has-text("Tambah")')
      .evaluate((el) => (el as HTMLElement).click());
    await page.waitForTimeout(500);

    const cartButton = page.locator('button[aria-label="Keranjang"]').first();
    await cartButton.evaluate((el) => (el as HTMLElement).click());

    await expect(page.locator('[role="dialog"]').locator('text=Fujifilm X-T5')).toBeVisible();

    await page
      .locator('button[aria-label^="Hapus"]')
      .first()
      .evaluate((el) => (el as HTMLElement).click());

    await expect(page.locator('text=Keranjang masih kosong')).toBeVisible({ timeout: 5000 });
  });

  test('Validates dates before enabling Bayar button', async ({ page }) => {
    await page.goto('/cameras');
    await page.waitForLoadState('load');

    await clickKameraFilter(page);

    const firstCard = page
      .locator('a[href^="/cameras/"]')
      .filter({ hasText: 'Fujifilm X-T5' })
      .first();
    await firstCard
      .locator('button:has-text("Tambah")')
      .evaluate((el) => (el as HTMLElement).click());
    await page.waitForTimeout(500);

    const cartButton = page.locator('button[aria-label="Keranjang"]').first();
    await cartButton.evaluate((el) => (el as HTMLElement).click());

    const checkoutButton = page
      .locator('button')
      .filter({ hasText: /Atur jadwal sewa|Bayar/ })
      .first();
    await expect(checkoutButton).toBeVisible();
    await expect(checkoutButton).toBeDisabled();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await setReactInputValue(page, '#cart-start-date', tomorrow.toISOString().split('T')[0]);
    await page.waitForTimeout(200);

    await expect(checkoutButton).toBeDisabled();

    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    await setReactInputValue(page, '#cart-end-date', dayAfterTomorrow.toISOString().split('T')[0]);
    await page.waitForTimeout(200);

    await expect(page.locator('button:has-text("Bayar")').first()).toBeEnabled({ timeout: 5000 });
  });
});
