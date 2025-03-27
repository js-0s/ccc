// config/index.tsx

import { cookieStorage, createStorage } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;
export const hasProjectId = typeof projectId === 'string' && projectId.length;

export const networks = [mainnet, arbitrum];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = hasProjectId
  ? new WagmiAdapter({
      storage: createStorage({
        storage: cookieStorage,
      }),
      ssr: true,
      projectId,
      networks,
    })
  : null;

export const config = hasProjectId ? wagmiAdapter.wagmiConfig : null;
