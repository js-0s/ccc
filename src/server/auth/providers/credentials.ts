import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/server/db';

export function Credentials() {
  return CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Credentials',
    id: 'credentials',
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
  });
}
