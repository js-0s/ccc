import { StargateClient } from '@cosmjs/stargate';
import type { ChainType } from './chains';
import { ParameterError } from './error';

import { Registry as SigningRegistry } from '@cosmjs/proto-signing';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { Tx, TxBody, AuthInfo } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

export async function requestAccountNumberAndSequence({
  chain,
  senderAddress,
}: {
  chain: ChainType;
  senderAddress: string;
}) {
  const client = await StargateClient.connect(chain.rpc);
  const account = await client.getAccount(senderAddress);
  if (!account) {
    throw new ParameterError('Bad sender address');
  }
  const { accountNumber, sequence } = account;

  const signDoc = {
    accountNumber: accountNumber.toString(),
    sequence: sequence.toString(),
  };
  return signDoc;
}

export async function createProtobufSignDocument({
  chain,
  publicKey,
  senderAddress,
  receiverAddress,
  message,
  amount,
  sequence,
  accountNumber,
}: {
  chain: ChainType;
  publicKey: Uint8Array;
  senderAddress: string;
  receiverAddress: string;
  message: string;
  amount: number;
  sequence: number;
  accountNumber: string;
}): Promise<{
  bodyBytes: Uint8Array;
  authInfoBytes: Uint8Array;
  chainId: string;
  accountNumber: number;
}> {
  const denom = chain.currencies[0].coinMinimalDenom;
  const msgSend: MsgSend = {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: senderAddress,
      toAddress: receiverAddress,
      amount: [
        {
          denom,
          amount: amount.toString(),
        },
      ],
    },
  };

  const txBody = {
    messages: [msgSend],
    memo: message,
  };
  const fee = {
    amount: [
      {
        denom,
        amount: '5000',
      },
    ],
    gasLimit: '200000',
  };

  const signerInfo = {
    publicKey: {
      typeUrl: '/cosmos.crypto.secp256k1.PubKey',
      value: publicKey,
    },
    modeInfo: {
      single: {
        mode: '1',
      },
    },
    sequence: sequence,
  };

  const authInfo = {
    signerInfos: [signerInfo],
    fee: fee,
  };

  const txBodyEncodeObject: EncodeObject = {
    typeUrl: '/cosmos.tx.v1beta1.TxBody',
    value: txBody,
  };

  const authInfoEncodeObject: EncodeObject = {
    typeUrl: '/cosmos.tx.v1beta1.AuthInfo',
    value: authInfo,
  };
  const registry = new SigningRegistry([
    ['/cosmos.bank.v1beta1.MsgSend', MsgSend],
    ['/cosmos.tx.v1beta1.TxBody', TxBody],
    ['/cosmos.tx.v1beta1.Tx', Tx],
    ['/cosmos.tx.v1beta1.AuthInfo', AuthInfo],
  ]) as { encode: (object: EncodeObject) => Uint8Array };
  const txBodyBytes = registry.encode(txBodyEncodeObject);
  const authInfoBytes = registry.encode(authInfoEncodeObject);

  // Create the sign doc
  const protoDoc = {
    bodyBytes: txBodyBytes,
    authInfoBytes: authInfoBytes,
    chainId: chain.chainId,
    accountNumber,
  };

  return protoDoc;
}
