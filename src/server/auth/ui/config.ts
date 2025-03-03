import { type NextAuthConfig } from 'next-auth';
import { Credentials } from '@/server/auth/providers';
export const authConfig = {
  providers: [Credentials()],
} satisfies NextAuthConfig;
