/**
 * Minimal config for middleware.ts / await auth to work
 */
import { type DefaultSession, type NextAuthConfig } from 'next-auth';
import { jwt } from '@/server/auth/jwt';
import { session } from '@/server/auth/session';
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      roles: [string];
    } & DefaultSession['user'];
  }
}

export const authConfig = {
  providers: [],
  events: {},
  callbacks: {
    jwt,
    session,
  },
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig;
