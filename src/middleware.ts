import type { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "img-src 'self' data: blob: https://aomcdmeqykiiistciahw.supabase.co https://api.sandbox.midtrans.com https://api.midtrans.com",
    "script-src 'self' 'unsafe-inline' https://app.sandbox.midtrans.com https://app.midtrans.com",
    "connect-src 'self' https://aomcdmeqykiiistciahw.supabase.co wss://aomcdmeqykiiistciahw.supabase.co https://api.sandbox.midtrans.com https://api.midtrans.com",
    'frame-src https://app.sandbox.midtrans.com https://app.midtrans.com',
    "frame-ancestors 'none'",
    "style-src 'self' 'unsafe-inline'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};

function applySecurityHeaders(response: NextResponse, request: NextRequest) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
}

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  applySecurityHeaders(response, request);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
