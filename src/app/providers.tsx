'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';
import { Web3ContextProvider, AppKitProvider } from '@/context';

import { AlertDialogProvider } from '@/components/alert';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({
  cookies,
  children,
}: {
  cookies: string;
  children: ReactNode;
}) {
  return (
    <UIProviders>
      <SessionProvider>
        <WithSessionProviders>
          <AppKitProvider cookies={cookies}>{children}</AppKitProvider>
        </WithSessionProviders>
      </SessionProvider>
    </UIProviders>
  );
}
export function WithSessionProviders({ children }: { children: ReactNode }) {
  return <Web3ContextProvider>{children}</Web3ContextProvider>;
}
export function UIProviders({ children }: { children: ReactNode }) {
  return (
    <AlertDialogProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </AlertDialogProvider>
  );
}
