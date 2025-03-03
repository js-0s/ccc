import { type DefaultSession, type NextAuthConfig } from 'next-auth';
import { Credentials, AppKit } from '@/server/auth/providers';
import { db } from '@/server/db';
import { jwt } from '@/server/auth/jwt';
import { session } from '@/server/auth/session';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      roles: [string];
    } & DefaultSession['user'];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [Credentials(), AppKit()],
  events: {
    signIn: async ({ user }) => {
      const instance = await db.user.findUnique({ where: { id: user.id } });
      if (instance.lastSigninAt) {
        await db.user.update({
          where: { id: user.id },
          data: { prevSigninAt: instance.lastSigninAt },
        });
      }
      await db.user.update({
        where: { id: user.id },
        data: { lastSigninAt: new Date() },
      });
      // importing UserRepository causes middleware issues
      // await UserRepository.updateSignin({
      //   db,
      //   session: { user },
      // });
    },
    signOut: async ({ token }: { token: { sub: string } }) => {
      await db.user.update({
        where: { id: token.sub },
        data: { lastSignoutAt: new Date() },
      });
    },
  },
  callbacks: {
    jwt,
    session,
  },
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig;
