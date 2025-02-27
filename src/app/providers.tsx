'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Web3ContextProvider } from '@/context';

import { AlertDialogProvider } from '@/components/alert';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProviders>
      <SessionProvider>
        <WithSessionProviders>{children}</WithSessionProviders>
      </SessionProvider>
    </UIProviders>
  );
}
export function WithSessionProviders({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  return (
    <Web3ContextProvider session={session}>{children}</Web3ContextProvider>
  );
}
export function UIProviders({ children }: { children: ReactNode }) {
  return (
    <AlertDialogProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </AlertDialogProvider>
  );
}
