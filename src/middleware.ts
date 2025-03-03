import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth/middleware';

export default async function middleware(req: NextRequest) {
  const isAuthenticated = await auth();
  if (!isAuthenticated) {
    const returnUrl = new URL(req.nextUrl.pathname, process.env.NEXTAUTH_URL);
    return NextResponse.redirect(
      new URL(
        '/api/auth/signin?callbackUrl=' + encodeURIComponent(returnUrl),
        req.nextUrl,
      ),
    );
  }
  return NextResponse.next();
}

// Routes Middleware should run on
export const config = {
  matcher: ['/dashboard', '/setup', '/account'],
  unstable_allowDynamic: [
    'node_modules/**', // use a glob to allow anything in the function-bind 3rd party module
  ],
};
