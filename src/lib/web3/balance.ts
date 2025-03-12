import { type ChainType } from './chains';
import { NetworkError, IntegrityError } from './error';

import { regen } from '@regen-network/api';

import { createProtobufRpcClient, QueryClient } from '@cosmjs/stargate';
import { QueryClientImpl } from 'cosmjs-types/cosmos/bank/v1beta1/query';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';

export type BalanceType = {
  denom: string;
  amount: number;
  decimals: number;
};
export async function getBalance({
  chain,
  publicKey,
}: {
  chain: ChainType;
  publicKey: string;
}) {
  const { createRPCQueryClient } = regen.ClientFactory;
  const client = await createRPCQueryClient({ rpcEndpoint: chain.rpc });

  // now you can query the cosmos modules
  const balance = { denom: '', amount: 0 };
  try {
    balance.denom = chain.currencies[0].coinMinimalDenom;
    let sum = 0;
    let nextKey = publicKey;
    while (typeof nextKey === 'string' && nextKey.length) {
      const balances = await client.cosmos.bank.v1beta1.allBalances({
        address: nextKey,
      });
      for (const balance of balances.balances) {
        if (
          !chain.currencies
            .map(currency => currency.coinMinimalDenom)
            .includes(balance.denom)
        ) {
          console.log(`Received bad balance denom ${balance.denom}`);
          continue
        }
        sum += parseInt(balance.amount, 10); // ? BigInt
      }
      nextKey = balances.pagination.nextKey;
    }
    balance.amount = sum;
  } catch (error: unknown) {
    let message = undefined;
    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    }
    console.log(JSON.stringify({ type: 'error', message, error }));
    throw new NetworkError('failed to receive balance');
  }
  return balance;
}
export async function getCosmosBalance({
  chain,
  publicKey,
}: {
  chain: ChainType;
  publicKey: string;
}): Promise<BalanceType> {
  try {
    const tendermint = await Tendermint34Client.connect(chain.rpc);
    const queryClient = new QueryClient(tendermint);
    const rpcClient = createProtobufRpcClient(queryClient);
    const bankQueryService = new QueryClientImpl(rpcClient);

    const { balance } = await bankQueryService.Balance({
      address: publicKey,
      denom: chain.currencies[0].coinMinimalDenom,
    });
    return {
      amount: parseInt(balance.amount, 10),
      denom: balance.denom,
    };
  } catch (error: unknown) {
    let message = undefined;
    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    }
    console.log(JSON.stringify({ type: 'error', message, error }));
    throw new NetworkError('failed to receive balance');
  }
}
