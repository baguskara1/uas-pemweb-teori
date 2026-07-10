#!/usr/bin/env node
/**
 * Payment webhook test harness.
 * Tests the /api/payments/midtrans/callback endpoint with various payload shapes:
 *   - missing signature header
 *   - invalid signature
 *   - valid signature, unknown order_id
 *   - valid signature, existing payment -> midtrans settlement -> status paid
 *
 * Usage: node tests/webhook-test.mjs
 */
import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const WEBHOOK = `${BASE}/api/payments/midtrans/callback`;

// Load .env.local manually (no .env loader needed for these two vars)
const envFile = readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => l.split('=', 2)),
);
const SERVER_KEY = env.MIDTRANS_SERVER_KEY;

function sign(orderId, statusCode, grossAmount) {
  return crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${SERVER_KEY}`)
    .digest('hex');
}

async function hit(payload, { signature, withSigHeader = true } = {}) {
  const headers = { 'content-type': 'application/json' };
  if (withSigHeader && signature) headers['x-signature'] = signature;
  const res = await fetch(WEBHOOK, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  let body;
  try { body = await res.json(); } catch { body = '<no-json>'; }
  return { status: res.status, body };
}

const orderId = 'camera-rental-test-' + Date.now();
const grossAmount = '150000.00';

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`PASS ${name}`); }
  else      { fail++; console.log(`FAIL ${name}`); }
}

// 1. Missing signature header
{
  const { status, body } = await hit({ orderId, statusCode: '200', grossAmount }, { withSigHeader: false });
  check('missing-signature returns 403', status === 403);
  check('missing-signature message ok', body?.message === 'Missing signature');
}

// 2. Invalid signature
{
  const { status, body } = await hit(
    { orderId, statusCode: '200', grossAmount },
    { signature: 'a'.repeat(128) },
  );
  check('invalid-signature returns 403', status === 403);
  check('invalid-signature message ok', body?.message === 'Invalid signature');
}

// 3. Valid signature, unknown order_id
{
  const sig = sign(orderId, '200', grossAmount);
  const { status, body } = await hit(
    { orderId, transaction_status: 'settlement', statusCode: '200', grossAmount, transaction_id: 'tx-' + Date.now(), payment_type: 'qris', fraud_status: 'accept' },
    { signature: sig },
  );
  check('unknown-order returns 404', status === 404);
  check('unknown-order message ok', body?.message === 'Payment not found');
}

// 4. Valid signature, known order_id (depends on a payment record existing with this id)
{
  // User must have run scripts/seed-test-payment.sql first.
  const knownOrderId = process.env.TEST_ORDER_ID;
  if (!knownOrderId) {
    console.log('SKIP  valid-payment flow (TEST_ORDER_ID not set — run seed first)');
  } else {
    const sig = sign(knownOrderId, '200', grossAmount);
    const { status, body } = await hit(
      {
        order_id: knownOrderId, // Midtrans sends snake_case in webhook
        transaction_status: 'settlement',
        status_code: '200',
        gross_amount: grossAmount,
        transaction_id: 'tx-' + Date.now(),
        payment_type: 'qris',
        fraud_status: 'accept',
      },
      { signature: sig },
    );
    check('valid-payment returns 200', status === 200);
    check('valid-payment body ok', body?.success === true);
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
