'use client';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export function SignInButtonClient({ session }) {
  if (session) {
    return (
      <Link
        href={'/dashboard'}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
          Dashboard
        </button>
      </Link>
    );
  }
  return (
    <form
      action={async () => {
        await signIn(undefined, { callbackUrl: '/dashboard' });
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8"
      >
        Sign in
      </button>
    </form>
  );
}
