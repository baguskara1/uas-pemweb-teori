import { test, expect, vi } from '@playwright/test';

// Mock Midtrans Snap token generation
const mockSnapToken = 'midtrans-snap-token-test-12345';
const mockSnapUrl = 'https://app.sandbox.midtrans.com/snap/v4/redirection/midtrans-snap-token-test-12345';

test.describe.configure({ retries: 1 });

test.describe('Cart Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Mock localStorage to persist cart
    await page.addInitScript(() => {
      window.localStorage.setItem('ryox-cart', JSON.stringify([]));
    });

    // Mock the Midtrans API endpoint
    await page.route('/api/payments/midtrans/multi-submit', async (route) => {
      // Validate request body
      const request = route.request();
      const body = await request.postDataJSON();
      
      expect(body).toHaveProperty('items');
      expect(body.items).toBeInstanceOf(Array);
      expect(body.items.length).toBeGreaterThanOrEqual(1);
      expect(body).toHaveProperty('payMethod');
      expect(body).toHaveProperty('start_date');
      expect(body).toHaveProperty('end_date');
      
      // Verify date format
      expect(body.start_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(body.end_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      
      // Verify end_date > start_date
      expect(new Date(body.end_date).getTime()).toBeGreaterThan(new Date(body.start_date).getTime());
      
      // Mock response
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

    // Mock camera API
    await page.route('/api/cameras**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'cam-001',
              name: 'Canon EOS R5',
              brand: 'Canon',
              type: 'Mirrorless',
              category: 'camera',
              price_per_day: 500000,
              image_url: 'https://example.com/canon-r5.jpg',
              is_available: true,
              stock: 5,
            },
            {
              id: 'cam-002',
              name: 'Sony A7 IV',
              brand: 'Sony',
              type: 'Mirrorless',
              category: 'camera',
              price_per_day: 450000,
              image_url: 'https://example.com/sony-a7iv.jpg',
              is_available: true,
              stock: 3,
            },
            {
              id: 'lens-001',
              name: 'RF 24-70mm f/2.8L',
              brand: 'Canon',
              type: 'Lens',
              category: 'lens',
              price_per_day: 200000,
              image_url: 'https://example.com/rf-24-70.jpg',
              is_available: true,
              stock: 10,
            },
          ],
          count: 3,
        }),
      });
    });
  });

  test('Complete cart flow: add 2 items → open cart → set dates → select payment → click Bayar → expect Midtrans Snap', async ({ page }) => {
    // Step 1: Navigate to cameras page
    await page.goto('/cameras');
    await page.waitForLoadState('networkidle');

    // Step 2: Add first item to cart (Canon EOS R5)
    const addToCartButton1 = page.locator('button:has-text("Sewa"), button[aria-label*="keranjang"], button:has-text("Add to Cart")').first();
    // Try multiple selectors for the add to cart button
    await expect(page.locator('text=Canon EOS R5').first()).toBeVisible();
    
    // Click the first camera card's add to cart button
    await page.locator('text=Canon EOS R5').first().locator('..').locator('..').locator('button').first().click();
    
    // Wait for toast/notification
    await page.waitForTimeout(500);

    // Step 3: Add second item to cart (Sony A7 IV or Lens)
    await expect(page.locator('text=Sony A7 IV').first()).toBeVisible();
    await page.locator('text=Sony A7 IV').first().locator('..').locator('..').locator('button').first().click();
    
    // Wait for toast/notification
    await page.waitForTimeout(500);

    // Step 4: Open cart modal - look for cart button
    const cartButton = page.locator('button[aria-label*="keranjang"], button[aria-label*="cart"], button:has(svg[data-testid="icon-shoppingcart"])').first();
    await expect(cartButton).toBeVisible();
    await cartButton.click();

    // Wait for cart modal to open
    await expect(page.locator('text=Keranjang').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=(2 item)')).toBeVisible();

    // Step 5: Set rental dates (start date = tomorrow, end date = day after tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const startDateStr = tomorrow.toISOString().split('T')[0];
    const endDateStr = dayAfterTomorrow.toISOString().split('T')[0];

    // Fill start date
    await page.locator('input[id="cart-start-date"]').fill(startDateStr);
    await page.locator('input[id="cart-start-date"]').press('Tab');
    
    // Fill end date
    await page.locator('input[id="cart-end-date"]').fill(endDateStr);
    await page.locator('input[id="cart-end-date"]').press('Tab');

    // Verify duration is calculated
    await expect(page.locator('text=× 2 hari').first()).toBeVisible({ timeout: 5000 });

    // Step 6: Select payment method (e.g., GoPay)
    await page.locator('input[type="radio"][value="gopay"]').click();
    await expect(page.locator('input[type="radio"][value="gopay"]')).toBeChecked();

    // Step 7: Click Bayar button
    const bayarButton = page.locator('button:has-text("Bayar")').first();
    await expect(bayarButton).toBeEnabled({ timeout: 5000 });
    await bayarButton.click();

    // Step 8: Verify Midtrans Snap redirect or modal
    // The CartModal does window.location.href = json.data.snapUrl
    // We need to wait for navigation to the mock Snap URL
    await expect(page).toHaveURL(/midtrans|snap/, { timeout: 10000 });
    
    // Verify we redirected to Midtrans Snap URL
    const currentUrl = page.url();
    expect(currentUrl).toContain('midtrans');
    expect(currentUrl).toContain(mockSnapToken);
  });

  test('Cart modal opens with empty state when no items', async ({ page }) => {
    await page.goto('/cameras');
    await page.waitForLoadState('networkidle');

    // Open cart modal
    const cartButton = page.locator('button[aria-label*="keranjang"], button[aria-label*="cart"], button:has(svg[data-testid="icon-shoppingcart"])').first();
    await cartButton.click();

    // Verify empty cart message
    await expect(page.locator('text=Keranjang masih kosong')).toBeVisible();
  });

  test('Can remove item from cart', async ({ page }) => {
    await page.goto('/cameras');
    await page.waitForLoadState('networkidle');

    // Add an item
    await page.locator('text=Canon EOS R5').first().locator('..').locator('..').locator('button').first().click();
    await page.waitForTimeout(500);

    // Open cart
    const cartButton = page.locator('button[aria-label*="keranjang"], button[aria-label*="cart"], button:has(svg[data-testid="icon-shoppingcart"])').first();
    await cartButton.click();

    // Verify item is in cart
    await expect(page.locator('text=Canon EOS R5')).toBeVisible();

    // Click remove button
    await page.locator('button[aria-label*="Hapus"], button[aria-label*="hapus"]').first().click();

    // Verify item is removed
    await expect(page.locator('text=Keranjang masih kosong')).toBeVisible({ timeout: 5000 });
  });

  test('Validates dates before enabling Bayar button', async ({ page }) => {
    await page.goto('/cameras');
    await page.waitForLoadState('networkidle');

    // Add an item
    await page.locator('text=Canon EOS R5').first().locator('..').locator('..').locator('button').first().click();
    await page.waitForTimeout(500);

    // Open cart
    const cartButton = page.locator('button[aria-label*="keranjang"], button[aria-label*="cart"], button:has(svg[data-testid="icon-shoppingcart"])').first();
    await cartButton.click();

    // Bayar button should be disabled without dates
    const bayarButton = page.locator('button:has-text("Bayar")').first();
    await expect(bayarButton).toBeDisabled();

    // Set only start date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startDateStr = tomorrow.toISOString().split('T')[0];
    await page.locator('input[id="cart-start-date"]').fill(startDateStr);
    
    // Should still be disabled without end date
    await expect(bayarButton).toBeDisabled();

    // Set end date
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const endDateStr = dayAfterTomorrow.toISOString().split('T')[0];
    await page.locator('input[id="cart-end-date"]').fill(endDateStr);
    
    // Now Bayar should be enabled
    await expect(bayarButton).toBeEnabled({ timeout: 5000 });
  });
});
