import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes - check authentication
  if (pathname.startsWith('/admin')) {
    // Allow login page without auth
    if (pathname === '/admin/login') {
      const token = await getToken({ req: request });
      if (token) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // Protect all other admin routes
    const token = await getToken({ req: request });
    // eslint-disable-next-line no-console
    console.log('[MW DEBUG]', pathname, {
      hasToken: !!token,
      cookieNames: request.cookies.getAll().map((c) => c.name),
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      nextauthUrl: process.env.NEXTAUTH_URL,
      xfProto: request.headers.get('x-forwarded-proto'),
    });
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  // API routes - skip intl middleware
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Public routes - apply intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(ka|en)/:path*', '/admin/:path*'],
};
