import NextAuth from 'next-auth';
import type { NextRequest, NextResponse } from 'next/server';
import { cache } from 'react';

import { authConfig as authConfigActive } from './active/config';
import { authConfig as authConfigUi } from './ui/config';

const nextAuthActive = NextAuth(authConfigActive);
const nextAuthUi = NextAuth(authConfigUi);
const {
  auth: uncachedAuth,
  handlers: authHandlers,
  signIn,
  signOut,
} = nextAuthActive;

const auth = cache(uncachedAuth);

function handleUiGET(req: NextRequest, res: NextResponse) {
  const requestUrl = new URL(req.url);
  if (requestUrl.pathname === '/api/auth/signin') {
    return nextAuthUi.handlers.GET(req, res);
  }
  return nextAuthActive.handlers.GET(req, res);
}
const handlers = {
  POST: authHandlers.POST,
  GET: handleUiGET,
};
export { auth, handlers, signIn, signOut };
