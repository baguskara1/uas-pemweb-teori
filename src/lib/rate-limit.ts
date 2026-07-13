import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const WINDOW_MS = 60_000; // 60 detik
const MAX_REQUESTS = 20;

// Initialize Upstash Redis only if env vars are present
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit =
  redisUrl && redisToken
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(MAX_REQUESTS, '60 s'),
        analytics: true,
      })
    : null;

function getKey(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  return `ip:${ip}`;
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

  if (!ratelimit) {
    // Fallback if Redis is not configured
    if (process.env.NODE_ENV === 'production') {
      console.error('Upstash Redis not configured in production. Failing closed.');
      return { allowed: false, key, remaining: 0, resetAt: now + WINDOW_MS, retryAfter: 60 };
    }
    console.warn('Upstash Redis not configured. Rate limiting is disabled (allow all).');
    return { allowed: true, key, remaining: MAX_REQUESTS, resetAt: now + WINDOW_MS };
  }

  try {
    const { success, remaining, reset } = await ratelimit.limit(key);

    if (!success) {
      const retryAfter = Math.ceil((reset - now) / 1000);
      return {
        allowed: false,
        key,
        remaining: 0,
        resetAt: reset,
        retryAfter: retryAfter > 0 ? retryAfter : 1,
      };
    }

    return { allowed: true, key, remaining, resetAt: reset };
  } catch (error) {
    console.error('Rate limit error:', error);
    if (process.env.NODE_ENV === 'production') {
      return { allowed: false, key, remaining: 0, resetAt: now + WINDOW_MS, retryAfter: 60 };
    }
    // Fail open if Redis fails in dev
    return { allowed: true, key, remaining: MAX_REQUESTS, resetAt: now + WINDOW_MS };
  }
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
