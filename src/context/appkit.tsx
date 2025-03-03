'use client';

import { wagmiAdapter, projectId } from '@/lib/appkit/config';
import { siweConfig } from '@/lib/appkit/siwe-config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import {
  mainnet,
  arbitrum,
  avalanche,
  base,
  optimism,
  polygon,
} from '@reown/appkit/networks';
import React, { type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider } from 'wagmi';

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
  name: 'ccc',
  description: 'CCC Demo Application',
  url: process.env.NEXT_PUBLIC_URL,
  icons: ['/logo/ccc48.jpg'],
};

// // Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, avalanche, base, optimism, polygon],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true,
  },
  siweConfig,
});

export function AppKitProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);
  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
