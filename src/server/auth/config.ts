import { type DefaultSession, type NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/server/db';

// UserRepository imports web3 code that is not working in middleware
// import * as UserRepository from '@/graphql/repository/User';
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
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: { username: string; password: string }) {
        try {
          if (!credentials?.username)
            throw new Error('"username" is required in credentials');
          if (!credentials?.password)
            throw new Error('"password" is required in credentials');

          let dbUser = await db.user.findUnique({
            where: { username: credentials.username },
          });
          if (!dbUser) {
            dbUser = await db.user.findUnique({
              where: { email: credentials.username.toLowerCase() },
            });
          }
          let isPasswordValid = true;
          if (!dbUser) {
            const salt: string = await bcrypt.genSalt(10);
            const hashedPassword: string = await bcrypt.hash(
              credentials.password,
              salt,
            );
            let email = `${hashedPassword}@local.host`.toLowerCase();
            if (credentials.username.indexOf('@') > 0) {
              email = credentials.username;
            }
            dbUser = await db.user.create({
              data: {
                name: credentials.username,
                username: credentials.username.toLowerCase(),
                createdAt: new Date(),
                email,
                password: hashedPassword,
                roles: ['user'],
              },
            });
          } else {
            isPasswordValid = await bcrypt.compare(
              credentials.password,
              dbUser.password,
            );
          }
          if (!isPasswordValid) {
            throw new Error('Invalid Password');
          }
          if (dbUser) {
            return dbUser;
          }
        } catch (error: unknown) {
          if (typeof error === 'string') {
            console.error(
              JSON.stringify({
                type: 'error',
                message: 'CredentialsProvider::authorize:' + error,
              }),
            );
          }
          if (error instanceof Error) {
            console.error(
              JSON.stringify({
                type: 'error',
                message: 'CredentialsProvider::authorize:' + error.message,
                origin: error,
              }),
            );
          }
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
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
    jwt: async ({ token, user }) => {
      if (user) {
        return { ...token, roles: user.roles };
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          roles: token.roles,
        },
      };
    },
  },
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig;
