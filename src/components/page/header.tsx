import { Menu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { SignInButton } from '@/components/page/signin-button';

export function Header({ session }: { session: { user: { id: string } } }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 hidden md:flex">
          <Link className="text-lg font-medium mr-16" href="/">
            <div className="flex items-center gap-x-2 cursor-pointer">
              <Image
                src="/logo/ccc.jpg"
                alt="CCC"
                className="h-8"
                width={32}
                height={32}
              />
              <h1 className="text-xl font-bold">CCC</h1>
            </div>
          </Link>
          <nav className="flex items-center space-x-6 text-sm">
            <Link href="/pricing">Pricing</Link>
            <Link href="/learn">Learn</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          <SignInButton session={session} />

          <div className="md:hidden w-full flex items-center gap-x-2">
            <Link className="text-lg font-medium mr-16" href="/">
              <div className="flex items-center gap-x-2 cursor-pointer">
                <Image
                  src="/logo/ccc.jpg"
                  alt="SBS"
                  className="h-8"
                  width={32}
                  height={32}
                />
                <h1 className="text-xl font-bold">CCC</h1>
              </div>
            </Link>
            <div className="flex-1"></div>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 md:hidden"
              type="button"
              id="radix-:r36:"
              aria-haspopup="menu"
              aria-expanded="false"
              data-state="closed"
            >
              <Menu />
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
