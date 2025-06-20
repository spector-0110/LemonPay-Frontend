import { NextResponse } from 'next/server';

export const AUTH_TOKEN_KEY = 'token';

export function middleware(req) {
  const token = req.cookies.get(AUTH_TOKEN_KEY)?.value;
  const { pathname } = req.nextUrl;

  // If user has token but is trying to access pages outside dashboard, redirect to dashboard
  if (token && !pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If user doesn't have token but is trying to access dashboard, redirect to home
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
