/**
 * In-memory rate limiter (single-instance).
 * Keyed by userId (from getUser) or IP (x-forwarded-for / x-real-ip).
 * Window: 60 seconds, Max: 20 requests.
 * Returns 429 if exceeded.
 *
 * Trade-off: In-memory works for single-instance deployments (Vercel/Node single process).
 * For multi-instance / horizontal scaling, replace Map with Redis (e.g., @upstash/ratelimit)
 * so counters are shared across instances. Current impl resets on cold start / redeploy.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 60 detik
const MAX_REQUESTS = 20;

function getKey(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  return `ip:${ip}`;
}

function cleanup(key: string, now: number) {
  const entry = store.get(key);
  if (entry && now > entry.resetAt) {
    store.delete(key);
  }
}

export async function checkRateLimit(request: NextRequest): Promise<{
  allowed: boolean;
  key: string;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}> {
  // Try to get user from Supabase auth
  let userId: string | undefined;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
  } catch {
    // ignore auth errors, fall back to IP
  }

  const key = getKey(request, userId);
  const now = Date.now();
  cleanup(key, now);

  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    const resetAt = now + WINDOW_MS;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, key, remaining: MAX_REQUESTS - 1, resetAt };
  }

  if (entry.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return {
      allowed: false,
      key,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter,
    };
  }

  entry.count += 1;
  return { allowed: true, key, remaining: MAX_REQUESTS - entry.count, resetAt: entry.resetAt };
}

export function withRateLimit(
  handler: (
    req: NextRequest,
    ctx: { params: Promise<Record<string, string>> },
  ) => Promise<NextResponse>,
) {
  return async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
    const result = await checkRateLimit(req);

    if (!result.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
          error: 'RATE_LIMIT_EXCEEDED',
          retryAfter: result.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(result.retryAfter ?? Math.ceil(WINDOW_MS / 1000)),
            'X-RateLimit-Limit': String(MAX_REQUESTS),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
          },
        },
      );
    }

    const response = await handler(req, ctx);

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', String(MAX_REQUESTS));
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));

    return response;
  };
}
