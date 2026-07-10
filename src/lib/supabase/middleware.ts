import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Create fresh response for cookie updates (do NOT modify request.cookies)
          const newResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            newResponse.cookies.set(name, value, options);
          });
          // Attach the new response to the middleware chain
          supabaseResponse = newResponse;
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users away from protected routes
  const protectedPaths = ['/dashboard', '/admin', '/checkout', '/payment'];
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect non-admins away from /admin
  if (pathname.startsWith('/admin') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
