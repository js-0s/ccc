import { NetworkError, IntegrityError } from './error';
import { hardcodedChains } from './hardcodedChains';

export const chainRegistryUrl =
  'https://keplr-chain-registry.vercel.app/api/chains';
export type CurrencyType = {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinGeckoId: string;
  coinImageUrl: string;
};
export type ChainType = {
  rpc: string;
  chainId: string;
  chainName: string;
  currencies: [CurrencyType];
};

export async function getChains({
  withRemote = true,
}: { withRemote?: boolean } = {}) {
  const chains: [ChainType] = [];
  for (const chain of hardcodedChains) {
    chains.push({ ...chain, cccForced: true });
  }
  if (!withRemote) {
    return chains;
  }
  const response = await fetch(chainRegistryUrl);
  const data = (await response.json()) as { chains: [ChainType] };
  if (!Array.isArray(data?.chains)) {
    throw NetworkError('failed to receive chain registry');
  }
  for (const supportedChain of data.chains) {
    if (chains.find(({ chainId }) => chainId === supportedChain.chainId)) {
      continue;
    }

    chains.push(supportedChain);
  }
  return chains;
}
export function getChainSettings({
  chains,
  chainId,
}: {
  chains: [ChainType];
  chainId: string;
}): ChainType {
  const chain = chains.find(chain => chain.chainId === chainId);
  if (!chain) {
    throw new IntegrityError('Bad chain ' + chainId);
  }
  return chain;
}
