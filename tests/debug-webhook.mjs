import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

const BASE = 'http://localhost:3000';
const WEBHOOK = `${BASE}/api/payments/midtrans/callback`;
const envFile = readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envFile.split('\n').filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => l.split('=', 2)),
);
const SERVER_KEY = env.MIDTRANS_SERVER_KEY;

function sign(orderId, statusCode, grossAmount) {
  return crypto.createHash('sha512').update(`${orderId}${statusCode}${grossAmount}${SERVER_KEY}`).digest('hex');
}

const knownOrderId = 'camera-rental-test-fixture';
const grossAmount = '150000.00';
const sig = sign(knownOrderId, '200', grossAmount);
const payload = {
  order_id: knownOrderId,
  transaction_status: 'settlement',
  status_code: '200',
  gross_amount: grossAmount,
  transaction_id: 'tx-test-1',
  payment_type: 'qris',
  fraud_status: 'accept',
};

const res = await fetch(WEBHOOK, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-signature': sig },
  body: JSON.stringify(payload),
});

const body = await res.json();
console.log('STATUS:', res.status);
console.log('BODY:', JSON.stringify(body, null, 2));
console.log('SIG LEN:', sig.length, 'first16:', sig.slice(0, 16));
console.log('SERVER_KEY empty?', !SERVER_KEY);
console.log('SERVER_KEY Starts:', SERVER_KEY?.slice(0, 3));
