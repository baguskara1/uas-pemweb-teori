# 🔒 Security Audit Report — Sewa Kamera Ryox (uas-pemweb-teori)

**Project:** Next.js 16 (App Router) + Supabase + Midtrans + OpenRouter AI  
**Live Demo:** http://16.78.107.139  
**Date:** 2025-07-13  
**Auditor:** Automated Code Review  

---

## 📊 Executive Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 **CRITICAL** | 3 | ⚠️ Fix before production |
| 🟠 **HIGH** | 4 | 🎯 Fix this sprint |
| 🟡 **MEDIUM** | 6 | 📅 Next sprint |
| 🟢 **LOW** | 5 | 📦 Backlog |
| 🔵 **INFO** | 3 | ✨ Nice-to-have |
| **TOTAL** | **21** | |

> **VERDICT: PRODUCTION-READY WITH CONDITIONS** — Strong security posture (RLS, CSP, rate-limiting, signature validation). Fix 3 CRITICAL items before go-live.

---

## 🔴 CRITICAL FINDINGS (Fix Immediately)

### C1. Production Secrets Committed to Repository
**File:** `.env.local` (tracked in git — 876B)  
**Exposed:**
- Supabase anon key (public, but still rotate)
- Midtrans **sandbox** keys (`Mid-client-[REDACTED]`, `Mid-server-[REDACTED]`)
- **Gemini API key** (`AIzaSy[REDACTED]`)
- **Anthropic API key** (`sk-ant-api03-[REDACTED]`)
- **OpenRouter API key** (`sk-or-v1-[REDACTED]`)
- EC2 public IP

**Risk:** API key abuse, quota exhaustion, cost overrun, potential model access.

**Fix:**
```bash
# 1. Rotate ALL keys immediately (Supabase, Midtrans, OpenRouter, Anthropic, Gemini)
# 2. Remove .env.local from git history
git filter-repo --invert-paths --path .env.local
# 3. Add to .gitignore (already there but was committed)
echo ".env.local" >> .gitignore
# 4. Use Vercel/AWS/EC2 environment variables for production
```

---

### C2. In-Memory Rate Limiter — Resets on Cold Start / Redeploy
**File:** `src/lib/rate-limit.ts:20`  
```typescript
const store = new Map<string, RateLimitEntry>();  // Lost on every restart
```
**Risk:** 
- Rate limit bypassed after each deploy/cold start
- No protection on serverless (Vercel) or multi-instance (PM2 cluster)
- DDoS / brute-force possible during deployment windows

**Fix:** Use Redis-backed rate limiter (Upstash / ioredis):
```bash
npm i @upstash/ratelimit @upstash/redis
```
```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '60 s'),
  analytics: true,
});

export async function checkRateLimit(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);
  // return headers + allowed boolean
}
```

---

### C3. Admin Role Check — Client-Side Redirect Only in Layout
**File:** `src/app/admin/layout.tsx:11-19`  
```typescript
if (!user) redirect('/login');           // OK
if (profile?.role !== 'admin') redirect('/dashboard');  // Client-side only!
```
**Risk:** Admin pages are **Server Components** but the redirect happens after user fetch. If RLS fails or middleware bypassed, non-admins could access `/admin/*` server-rendered content before redirect.

**Fix:** Move admin check to **middleware** (already partially done) AND keep layout guard as defense-in-depth:
```typescript
// src/middleware.ts - ADD to protectedPaths
const adminPaths = ['/admin'];
const isAdminPath = adminPaths.some(p => pathname.startsWith(p));
if (isAdminPath && user) {
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.redirect(new URL('/dashboard', request.url));
}
```

---

## 🟠 HIGH FINDINGS

### H1. AI Endpoint — No Input Sanitization / Prompt Injection Risk
**File:** `src/app/api/ai/gemini/route.ts:46-51`  
```typescript
const { prompt, systemPrompt } = await request.json();
// Directly passed to OpenRouter — no length limit, no sanitization
```
**Risk:** Prompt injection, token exhaustion, cost abuse, PII leakage.

**Fix:**
```typescript
const MAX_PROMPT_LEN = 2000;
if (prompt.length > MAX_PROMPT_LEN) return 400;
if (systemPrompt && systemPrompt.length > 500) return 400;
// Sanitize: strip <script>, <iframe>, potential injection patterns
const sanitized = prompt.replace(/<[^>]*>/g, '').slice(0, MAX_PROMPT_LEN);
```

---

### H2. Midtrans Callback — Idempotency Logic Has Edge Case
**File:** `src/app/api/payments/midtrans/callback/route.ts:58-62`  
```typescript
if (existingPayment && !existingPayment.status) {
  // status is null → proceed (OK)
} else if (existingPayment && terminalStatuses.includes(existingPayment.status)) {
  return 200; // idempotent
}
```
**Risk:** If `status` is `'pending'` (non-terminal) but webhook fires again with `'paid'`, it correctly proceeds. **BUT** if DB row exists with `status = null` and webhook fires `'paid'` → OK. Edge case: race condition between `existingPayment` check and RPC call (two parallel webhooks). The `FOR UPDATE` in RPC handles this, but the **pre-check is racy**.

**Fix:** Remove pre-check; rely solely on RPC `FOR UPDATE` + idempotency inside RPC:
```sql
-- In update_payment_from_webhook:
-- Add: IF p_status IN ('paid','failed','expired') AND status IS NOT NULL THEN RETURN id; END IF;
```

---

### H3. Multi-Submit Payment — Missing Auth on Camera Ownership Check
**File:** `src/app/api/payments/midtrans/multi-submit/route.ts:138-154`  
Cameras fetched by ID array, but **no verification that user owns/has access** — just checks camera exists. If user manipulates `items[]` with other users' camera IDs, they could book unavailable cameras.

**Fix:** Add availability check per camera (already done in RPC `create_booking_with_loyalty` via `FOR UPDATE` + stock check). Current code does this correctly in RPC, but API should also validate `is_available` before calling RPC to fail fast.

---

### H4. No Security Headers on API Routes (Only Middleware)
**File:** `src/middleware.ts` applies CSP/HSTS to all routes matching config.  
**Gap:** API routes under `/api/*` **are matched** (config excludes `_next/static`, `_next/image`, favicon, images). ✅ Actually covered.

**But:** No `Content-Security-Policy-Report-Only` for monitoring; no `Cross-Origin-Opener-Policy`, `Cross-Origin-Embedder-Policy`.

**Fix:** Add COOP/COEP headers in middleware:
```typescript
'Cross-Origin-Opener-Policy': 'same-origin',
'Cross-Origin-Embedder-Policy': 'require-corp',
```

---

## 🟡 MEDIUM FINDINGS

### M1. Supabase Service Role Key Used in Server Client (Optional but Risky)
**File:** `src/lib/supabase/server.ts:10`
```typescript
process.env.SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Risk:** If `SERVICE_ROLE_KEY` is set, server client bypasses **all RLS**. Should only be used for admin scripts, not request handlers.

**Fix:** Create separate admin client; default to anon key:
```typescript
export async function createAdminClient() { /* service role */ }
export async function createClient() { /* anon key only */ }
```

---

### M2. Midtrans Server Key Used in `chargeQris` — Direct API Call
**File:** `src/lib/midtrans.ts:66`  
```typescript
const auth = Buffer.from(`${serverKey}:`).toString('base64');
```
**Risk:** Server key exposed in Node process memory. OK for server-side, but ensure **never logged**.

**Fix:** Add redaction in logs; consider using Midtrans Snap for QRIS too (avoids raw server key usage).

---

### M3. QRIS QR String Returned Directly to Frontend
**File:** `src/app/api/payments/midtrans/multi-submit/route.ts:266-285`  
```typescript
qrString: qrisResponse.qrString  // Base64/URL returned to client
```
**Risk:** QR string contains payment payload; if intercepted, could be reused. Low risk (time-limited), but consider proxying QR image generation server-side.

**Fix:** Generate QR code on server (`qrcode` npm), return `data:image/png;base64,...` instead of raw string.

---

### M4. OpenRouter API Key in Request Header — No Rotation Strategy
**File:** `src/app/api/ai/gemini/route.ts:24`  
```typescript
Authorization: `Bearer ${apiKey}`
```
**Risk:** Long-lived key; if leaked, full model access.

**Fix:** 
- Rotate keys quarterly
- Use OpenRouter key per-environment (dev/staging/prod)
- Monitor usage via OpenRouter dashboard

---

### M5. Rate Limiter Keyed by IP (X-Forwarded-For) — Spoofable
**File:** `src/lib/rate-limit.ts:27-30`  
```typescript
const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
           request.headers.get('x-real-ip') || 'unknown';
```
**Risk:** Attacker can send arbitrary `X-Forwarded-For` to bypass per-IP limits.

**Fix:** Trust proxy header only from known proxy (Nginx/Cloudflare). In `next.config.ts`:
```typescript
// next.config.ts
async headers() {
  return [{ source: '/:path*', headers: [{ key: 'X-Forwarded-For', value: '' }] }];
}
// Better: use @vercel/edge or configure Nginx to set real IP
```

---

### M6. No Automated Dependency Scanning in CI
**Files:** `package.json` has no `npm audit` / `snyk` / `dependabot` config.

**Fix:** Add GitHub Actions workflow:
```yaml
# .github/workflows/security.yml
name: Security
on: [push, schedule]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm audit --audit-level=high
      - uses: github/codeql-action/init@v3
      - uses: github/codeql-action/analyze@v3
```

---

## 🟢 LOW FINDINGS

| ID | Issue | Fix |
|----|-------|-----|
| L1 | `console.log` in production API routes (`multi-submit:43`) | Remove or guard with `process.env.NODE_ENV !== 'production'` |
| L2 | Error messages leak stack traces in 500 responses | Standardize error responses: `{ error: 'INTERNAL_ERROR' }` only |
| L3 | `create_booking_with_loyalty` RPC — `SECURITY DEFINER` with `auth.uid()` | Safe (uses invoker's auth), but document why SD needed |
| L4 | No `Content-Type: application/json; charset=utf-8` enforcement | Add `headers.set('Content-Type', 'application/json')` in API routes |
| L5 | Test files use `vi.stubGlobal('localStorage', ...)` — brittle | Use `@testing-library/user-event` + `jsdom` default localStorage |

---

## 🔵 INFO / BEST PRACTICE

| ID | Recommendation |
|----|----------------|
| I1 | **Enable Supabase PITR** (Point-in-Time Recovery) for production DB |
| I2 | **Add `helmet`-equivalent** via middleware (already have CSP, add COOP/COEP) |
| I3 | **Implement request signing** for webhook endpoints (Midtrans does HMAC — ✅ done) |
| I4 | **Add audit logging** for admin actions (bookings, payments, users) |
| I5 | **Run `npm audit` + `npm outdated` weekly** via scheduled workflow |

---

## ✅ WHAT'S DONE WELL (Strengths)

| Area | Implementation |
|------|----------------|
| **Auth** | Supabase Auth (email/password), SSR session via `@supabase/ssr`, middleware refresh |
| **Authorization** | RLS on **all tables** (profiles, cameras, bookings, payments, loyalty) |
| **Admin Guard** | Server-side `verifyAdmin()` + middleware redirect + layout guard (defense in depth) |
| **Payments** | Midtrans signature validation (HMAC-SHA512, timing-safe), idempotent webhook, SECURITY DEFINER RPC |
| **Rate Limiting** | Per-user/IP, 20 req/60s, proper 429 + `Retry-After` headers |
| **Security Headers** | CSP (strict), HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| **SQL Safety** | Parameterized queries via Supabase client, no raw SQL in app code |
| **File Upload** | Supabase Storage (server-side signed URLs), not handled in this codebase |
| **AI Proxy** | OpenRouter key only on server, rate-limited endpoint |

---

## 🛠️ REMEDIATION ROADMAP

### Phase 0 — TODAY (Before Deploy)
- [ ] **Rotate ALL keys** in `.env.local` (Supabase, Midtrans, OpenRouter, Anthropic, Gemini)
- [ ] **Purge `.env.local` from git history** (`git filter-repo` or BFG)
- [ ] **Move admin check to middleware** (C3)

### Phase 1 — THIS SPRINT
- [ ] Replace in-memory rate limiter with **Upstash Redis** (C2)
- [ ] Add **prompt sanitization + length limits** to AI endpoint (H1)
- [ ] Fix Midtrans idempotency edge case in RPC (H2)
- [ ] Remove `console.log` from production APIs (L1)

### Phase 2 — NEXT SPRINT
- [ ] Add **COOP/COEP headers** (H4)
- [ ] **QRIS QR code generation server-side** (M3)
- [ ] **Dependabot / CodeQL / npm audit** in CI (M6)
- [ ] Standardize error responses (L2)

### Phase 3 — HARDENING
- [ ] Enable **Supabase PITR** + backup retention (I1)
- [ ] **Audit logging** for admin mutations (I4)
- [ ] **Penetration test** (staging) before go-live
- [ ] Document **incident response** for payment webhook failures

---

## 🔍 VERIFICATION CHECKLIST (Run Before Release)

```bash
# 1. No secrets in repo
git log --all --full-history -- .env.local   # should be empty

# 2. Rate limiter uses Redis
grep -r "Upstash\|ioredis" src/lib/rate-limit.ts

# 3. Admin check in middleware
grep -A5 "adminPaths" src/middleware.ts

# 4. AI input validation
grep -A10 "MAX_PROMPT_LEN" src/app/api/ai/gemini/route.ts

# 5. Security headers present
curl -I https://your-domain.com | grep -i "content-security-policy\|strict-transport-security\|cross-origin"

# 6. Dependencies clean
npm audit --audit-level=high

# 7. RLS enabled on all tables
psql $DATABASE_URL -c "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public';"
```

---

## 📞 CONTACT
For questions on specific findings, reference finding ID (C1, H3, M2, etc.) and I'll provide detailed remediation code.

**End of Report**
