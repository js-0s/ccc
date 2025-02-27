import { test } from '@jest/globals';
import { createProtobufSignDocument } from './sign';
import { TxBody, AuthInfo } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

test('can create a signdoc', async () => {
  const debug = false;
  const result = await createProtobufSignDocument({
    chain: {
      chainId: 'regen-redwood-1',
      rpc: 'http://redwood.regen.network:26657/',
      currencies: [{ coinMinimalDenom: 'uregen' }],
    },
    publicKey: new Uint8Array(),
    senderAddress: 'regen19h0lmc3nksf8d68qzyhem83vqq02zcffxhcvmk',
    receiverAddress: 'regen19h0lmc3nksf8d68qzyhem83vqq02zcffxhcvmk',
    message: 'my message',
    amount: { denom: 'uregen', amount: '1000' },
    sequence: 84,
    accountNumber: '1234',
  });
  const decodedBody = TxBody.decode(result.bodyBytes);
  const decodedAuthInfo = AuthInfo.decode(result.authInfoBytes);
  if (debug) {
    console.log(
      JSON.stringify(
        { decodedBody, decodedAuthInfo },
        (key: unknown, value: unknown) =>
          typeof value === 'bigint' ? Number(value) : value,
        2,
      ),
    );
  }
  expect(decodedBody.messages.length).toEqual(1);
  expect(decodedBody.memo).toEqual('my message');
  expect(decodedAuthInfo.signerInfos.length).toEqual(1);
  expect(decodedAuthInfo.signerInfos[0].sequence).toEqual(84n);
  expect(decodedAuthInfo.signerInfos[0].modeInfo).toEqual({
    single: { mode: 1 },
  });
  expect(decodedAuthInfo.fee.amount[0].amount).toEqual('5000');
  expect(decodedAuthInfo.fee.gasLimit).toEqual(200000n);
});
