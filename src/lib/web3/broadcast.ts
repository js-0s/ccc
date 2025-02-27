import { StargateClient } from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { fromBase64 } from '@cosmjs/encoding';
import type { ChainType } from './chains';

export async function broadcastTransaction({
  chain,
  signedTransactionBase64,
}: {
  chain: ChainType;
  signedTransactionBase64: string;
}): Promise<{ transactionHash: string }> {
  const signedTransaction = JSON.parse(atob(signedTransactionBase64)) as {
    signed: { authInfoBytes: string; bodyBytes: string };
    signature: { signature: string };
  };

  const client = await StargateClient.connect(chain.rpc);
  // convert to tx
  const signatureBuffer: Uint8Array = fromBase64(
    signedTransaction.signature.signature,
  );
  const txJSON = {
    bodyBytes: new Uint8Array(
      Buffer.from(signedTransaction.signed.bodyBytes, 'base64'),
    ),
    authInfoBytes: new Uint8Array(
      Buffer.from(signedTransaction.signed.authInfoBytes, 'base64'),
    ),
    signatures: [signatureBuffer],
  };

  const txRaw = TxRaw.fromPartial(txJSON);
  const txBytes = TxRaw.encode(txRaw).finish();

  // broadcast
  try {
    const result = await client.broadcastTx(txBytes);

    // Check if the transaction was successful
    if (result.code !== undefined && result.code !== 0) {
      return { error: 'Transaction failed', details: result };
    }

    return { transactionHash: result.transactionHash };
  } catch (error) {
    client.disconnect();
    throw error;
  }
}
