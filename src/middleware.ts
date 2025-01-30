// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard');

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

// Optionally configure middleware matcher
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
