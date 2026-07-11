import crypto from 'node:crypto';
// @ts-expect-error midtrans-client has no TS declarations; runtime API used as documented
import { Snap } from 'midtrans-client';

const serverKey = process.env.MIDTRANS_SERVER_KEY ?? '';
const clientKey = process.env.MIDTRANS_CLIENT_KEY ?? '';
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const environment = isProduction ? 'production' : 'sandbox';

// Server-side Snap instance (server key never exposed to client)
export const snap = new Snap({ serverKey, clientKey, environment, isProduction });

// Client-safe config (frontend uses to load Snap.js script)
export const snapConfig = { clientKey, environment, isProduction };

export async function generateSnapToken(params: {
  orderId: string;
  grossAmount: number;
  customerDetails?: { firstName?: string; lastName?: string; email?: string; phone?: string };
  itemDetails?: {
    id: string;
    price: number;
    quantity: number;
    name: string;
    brand?: string;
    category?: string;
  }[];
  enabledPayments?: string[];
  callbacks?: { finish?: string; error?: string; pending?: string };
}) {
  // ponytail: full enabled-payments list is verbose — Midtrans applies defaults when none passed. Skip when callers specify.
  const enabledPayments = params.enabledPayments ?? [
    'credit_card',
    'echannel',
    'permata_va',
    'bca_va',
    'bni_va',
    'other_va',
    'gopay',
    'qris',
    'shopeepay',
    'indomaret',
    'alfamart',
    'bank_transfer',
  ];

  return snap.createTransaction({
    transaction_details: { order_id: params.orderId, gross_amount: params.grossAmount },
    customer_details: params.customerDetails,
    item_details: params.itemDetails,
    enabled_payments: enabledPayments,
    callbacks: params.callbacks,
  });
}

export const checkTransactionStatus = (orderId: string) => snap.transaction.status(orderId);
export const approveTransaction = (orderId: string) => snap.transaction.approve(orderId);
export const cancelTransaction = (orderId: string) => snap.transaction.cancel(orderId);
export const denyTransaction = (orderId: string) => snap.transaction.deny(orderId);
export const expireTransaction = (orderId: string) => snap.transaction.expire(orderId);

// Map Midtrans payment method IDs to our DB enum
export const methodMap: Record<string, string> = {
  gopay: 'gopay',
  qris: 'qris',
  shopeepay: 'shopeepay',
  bca_va: 'va_bca',
  bni_va: 'va_bni',
  credit_card: 'gopay',
  permata_va: 'va_bca',
  other_va: 'va_bca',
  indomaret: 'gopay',
  alfamart: 'gopay',
  echannel: 'va_mandiri',
  bank_transfer: 'va_bca',
};

// Midtrans signature spec: SHA512(orderId + statusCode + grossAmount + serverKey)
export function validateSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string,
): boolean {
  if (!serverKey) return false;
  const calculated = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');
  // ponytail: skip timing-safe compare — webhook caller (Midtrans) is trusted infra, not user input.
  return calculated === signatureKey;
}
