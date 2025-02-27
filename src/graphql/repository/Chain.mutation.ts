import { getChains, getChainSettings } from '@/lib/web3/chains';
import { requestAccountNumberAndSequence } from '@/lib/web3/sign';
import { broadcastTransaction } from '@/lib/web3/broadcast';

export async function requestChainAccountNumberAndSequence({
  chainId,
  senderAddress,
}: {
  chainId: string;
  senderAddress: string;
}): Promise<{ json: { accountNumber: string; sequence: number } }> {
  const chains = await getChains({ withRemote: true });
  const chain = getChainSettings({ chains, chainId });
  return {
    json: await requestAccountNumberAndSequence({
      chain,
      senderAddress,
    }),
  };
}
export async function broadcastChainTransaction({
  chainId,
  signedTransactionBase64,
}: {
  chainId: string;
  signedTransactionBase64: string;
}) {
  const chains = await getChains({ withRemote: true });
  const chain = getChainSettings({ chains, chainId });

  return {
    json: await broadcastTransaction({ chain, signedTransactionBase64 }),
  };
}
