# Task 4.7 — Payment Flow Testing

Hasil testing backend payment Midtrans (sandbox mode).

## Lingkup测试

Karena checkout page (Task 5) belum dibuat, testing difokuskan pada:
1. **Webhook signature validation** — SHA512 signature check
2. **Webhook callback flow** — status update payment + booking
3. **Multi-method payload acceptance** — BCA VA, Mandiri VA, QRIS

> Submit endpoint (`POST /api/payments/midtrans/submit`) butuh auth user + booking pending. Test end-to-end full submit→webhook menyusul setelah checkout page jadi.

## Test execution

```bash
# 1. Seed test data (user + booking + payment pending)
supabase db query --linked -f scripts/seed-test-fixture.sql

# 2. Run webhook validation tests
TEST_ORDER_ID=camera-rental-test-fixture node tests/webhook-test.mjs

# 3. Run multi-method signature tests
node tests/payment-methods-test.mjs
```

## Hasil

### 1. Webhook callback — `tests/webhook-test.mjs`

```
PASS missing-signature returns 403
PASS missing-signature message ok
PASS invalid-signature returns 403
PASS invalid-signature message ok
PASS unknown-order returns 404
PASS unknown-order message ok
PASS valid-payment returns 200
PASS valid-payment body ok

8 passed, 0 failed
```

### 2. Payment methods signature — `tests/payment-methods-test.mjs`

```
[TEST] BCA VA
  PASS BCA VA: signature accepted
[TEST] Mandiri VA
  PASS Mandiri VA: signature accepted
[TEST] QRIS
  PASS QRIS: signature accepted

3 passed, 0 passed
```

### 3. Booking status update setelah bayar

Setelah webhook `settlement` diterima untuk `midtrans_order_id='camera-rental-test-fixture'`:

| Tabel     | Field    | Sebelum  | Sesudah     |
|-----------|----------|----------|-------------|
| payments  | status   | pending  | **paid**    |
| payments  | paid_at  | null     | timestamp   |
| bookings  | status   | pending  | **confirmed** |

Verified via `supabase db query --linked`.

## Bug ditemukan & diperbaiki selama testing

| Bug | Fix |
|-----|-----|
| `body.orderId` (camelCase) — Midtrans kirim `order_id` (snake_case) | Baca `body.order_id ?? body.orderId` di callback |
| Webhook anon key tidak bisa SELECT/UPDATE payments (RLS) | Buat RPC `update_payment_from_webhook()` `SECURITY DEFINER` — anon role dapat EXECUTE only |

## File test

```
tests/
├── webhook-test.mjs           # 8 test: signature + webhook flow
└── payment-methods-test.mjs   # 3 test: BCA VA, Mandiri VA, QRIS
scripts/
└── seed-test-fixture.sql      # user + booking + payment test data
supabase/migrations/
└── 009_webhook_rpc.sql        # RPC untuk RLS-safe webhook update
```
