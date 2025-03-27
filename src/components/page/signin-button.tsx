import Link from 'next/link';
import { signIn } from '@/server/auth';
import { hasProjectId } from '@/lib/appkit/config';

export function SignInButton({ session }) {
  if (session) {
    return (
      <>
        {hasProjectId && <appkit-button />}

        <Link
          href={'/dashboard'}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
            Dashboard
          </button>
        </Link>
      </>
    );
  }
  return (
    <>
      {hasProjectId && <appkit-button />}

      <form
        action={async () => {
          'use server';
          await signIn(undefined, { redirectTo: '/dashboard' });
        }}
      >
        <button
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8"
        >
          Sign in
        </button>
      </form>
    </>
  );
}
