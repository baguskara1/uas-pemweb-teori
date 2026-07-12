export const BASE_URL = 'https://sewa-kamera-ryox.duckdns.org';

// Separate emails so test 1 (auth flow) and the setup don't conflict
const RUN_ID = Date.now();
export const SETUP_USER = {
  email: `qa-setup-${RUN_ID}@test.com`,
  password: 'Test123456!',
  name: 'QA Setup User',
  phone: '081234567890',
};

export const TEST_USER = {
  email: `qa-test-${RUN_ID}@test.com`,
  password: 'Test123456!',
  name: 'QA Test User',
  phone: '081234567890',
};
