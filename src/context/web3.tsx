'use client';
import {
  useMemo,
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from 'react';
import { useAlert } from '@/components/alert';
import Link from 'next/link';

import { hardcodedChains } from '@/lib/web3/hardcodedChains';
import { getChains, getChainSettings, type ChainType } from '@/lib/web3/chains';
import type { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';
import { SigningStargateClient } from '@cosmjs/stargate';

const Web3Context = createContext();
const getKeplrFromWindow = async (): Promise<Keplr> => {
  if ((window as KeplrWindow).keplr) {
    return (window as KeplrWindow).keplr;
  }

  if (document.readyState === 'complete') {
    return (window as KeplrWindow).keplr;
  }

  return new Promise(resolve => {
    const documentStateChange = (event: ProgressEvent<Document>) => {
      if (event.target && event.target.readyState === 'complete') {
        resolve((window as KeplrWindow).keplr);
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
export function Web3ContextProvider({ children }) {
  const [selectedKey, setSelectedKey] = useState<string | undefined>();
  const [chains, setChains] = useState<[ChainType]>(hardcodedChains);
  const [lastChainId, setLastChainId] = useState<string | undefined>();
  const alert = useAlert();
  const changeHandler = useCallback(async () => {
    // reset/requery any keys and states. user changed the wallet in the ui
    setSelectedKey(undefined);
    try {
      const keplr = await getKeplrFromWindow();
      const key = await keplr.getKey(lastChainId);
      setSelectedKey(key.bech32Address);
    } catch {
      // keep key undefined
    }
  }, [setSelectedKey, lastChainId]);
  useEffect(() => {
    window.addEventListener('keplr_keystorechange', changeHandler);
    return () => {
      removeEventListener('keplr_keystorechange', changeHandler);
    };
  }, [changeHandler]);
  useEffect(() => {
    // allow any kepl-supported chain to be selected
    getChains({ withRemote: true })
      .then(chains => {
        setChains(chains);
      })
      .catch(error => console.error(error));
  }, []);

  const checkKeplr = useCallback(async () => {
    const keplr = await getKeplrFromWindow();
    if (keplr) {
      return true;
    }
    await alert({
      title: 'Keplr Wallet Missing',
      body: (
        <>
          <>You need to install the kepl wallet</>
          <br />
          <Link href="https://www.keplr.app/" target="_blank">
            Keprl Website
          </Link>{' '}
          <Link
            href="https://chromewebstore.google.com/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap"
            target="_blank"
          >
            Keplr Chrome Extension
          </Link>
        </>
      ),
    });
    return false;
  }, [alert]);
  const suggestChain = useCallback(async (chainJSON: ChainType) => {
    try {
      const keplr = await getKeplrFromWindow();

      await keplr.experimentalSuggestChain(chainJSON);
    } catch (error: unknown) {
      console.error('context/web3/suggestChain:', { error });
      throw error;
    }
  }, []);
  const selectChain = useCallback(async (chainId: string) => {
    try {
      const keplr = await getKeplrFromWindow();
      const key = await keplr.getKey(chainId);
      setSelectedKey(key.bech32Address);
      setLastChainId(chainId);
      return key.bech32Address;
    } catch (error: unknown) {
      console.error('context/web3/selectChain:', { error });
      throw error;
    }
  }, []);
  const signMessage = useCallback(
    async (chainId: string, publicKey: string, message: string) => {
      setLastChainId(chainId);
      try {
        const keplr = await getKeplrFromWindow();
        const signedMessage = await keplr.signArbitrary(
          chainId,
          publicKey,
          message,
        );
        return signedMessage;
      } catch (error: unknown) {
        console.error('context/web3/signMessage:', { error });
        throw error;
      }
    },
    [],
  );
  const signDocument = useCallback(
    async (chain: ChainType, signDocument: unknown) => {
      try {
        setLastChainId(chain.chainId);
        const offlineSigner = (window as KeplrWindow).getOfflineSigner(
          chain.chainId,
        );
        const accounts = await offlineSigner.getAccounts();

        // Sign the transaction using Keplr
        const signedTx = await offlineSigner.signDirect(
          accounts[0].address,
          signDocument,
        );
        // convert what keplr produces into a serializable structure
        const encodedSignedTx = {
          signed: {
            ...signedTx.signed,
            bodyBytes: Buffer.from(signedTx.signed.bodyBytes).toString(
              'base64',
            ),
            authInfoBytes: Buffer.from(signedTx.signed.authInfoBytes).toString(
              'base64',
            ),
          },
          signature: signedTx.signature,
        };
        return encodedSignedTx;
      } catch (error: unknown) {
        console.error('context/web3/signMessage:', { error });
        throw error;
      }
    },
    [],
  );
  const sendToken = useCallback(
    async (
      chainId: string,
      publicKey: string,
      amount: number,
      receiverPublicKey: string,
      message: string,
    ) => {
      setLastChainId(chainId);
      try {
        const offlineSigner = (window as KeplrWindow).getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();

        const chain = getChainSettings({ chains, chainId });
        const client = await SigningStargateClient.connectWithSigner(
          chain.rpc,
          offlineSigner,
        );

        const amountFinal = {
          denom: chain.currencies[0].coinMinimalDenom, // Replace with the correct token denomination
          amount: amount.toString(),
        };

        const fee = {
          amount: [
            {
              denom: chain.currencies[0].coinMinimalDenom, // Replace with the correct token denomination
              amount: '5000', // Adjust the fee amount as necessary
            },
          ],
          gas: '200000', // Adjust the gas limit as necessary
        };

        const result = await client.sendTokens(
          accounts[0].address,
          receiverPublicKey,
          [amountFinal],
          fee,
          message,
        );
        return result;
      } catch (error: unknown) {
        console.error('context/web3/sendToken:', { error });
        throw error;
      }
    },
    [chains],
  );
  const getPublicKey = useCallback(async ({ chainId }: { chainId: string }) => {
    setLastChainId(chainId);
    try {
      const offlineSigner = (window as KeplrWindow).getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      const account = accounts[0];

      const prefix = Buffer.from([10, 0x21]); // 10 for Ed25519, 0x21 for length
      const publicKey = Buffer.concat([prefix, account.pubkey]);
      return publicKey;
    } catch (error: unknown) {
      console.error('context/web3/getPublicKey:', { error });
      throw error;
    }
  }, []);
  const sortedChains = useMemo(() => {
    if (!Array.isArray(chains)) {
      return [];
    }
    const sortedChains = [...chains];
    return sortedChains.sort((a, b) => {
      return a.chainName > b.chainName ? 1 : -1;
    });
  }, [chains]);
  const isSelectedWallet = useCallback(
    async (chainId: string, address: string) => {
      setLastChainId(chainId);
      try {
        const keplr = await getKeplrFromWindow();
        const key = await keplr.getKey(chainId);
        if (key.bech32Address === address) {
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [selectedKey],
  );

  const value = useMemo(() => {
    return {
      checkKeplr,
      selectChain,
      suggestChain,
      selectedKey,
      signMessage,
      signDocument,
      sendToken,
      getPublicKey,
      chains,
      sortedChains,
      isSelectedWallet,
    };
  }, [
    checkKeplr,
    selectChain,
    selectedKey,
    suggestChain,
    signMessage,
    signDocument,
    sendToken,
    getPublicKey,
    chains,
    sortedChains,
    isSelectedWallet,
  ]);

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export const useWeb3Context = (): {
  checkKeplr: () => Promise<boolean>;
  selectChain: (chainId: string) => Promise<string>;
  suggestChain: (chainJSON: { chainId: string }) => Promise<void>;

  signMessage: (chainId: string, message: string) => Promise<string>;
  signDocument: (
    chainId: string,
    signDocument: unknown,
  ) => Promise<{
    signed: { bodyBytes: Uint8Array; authInfoBytes: Uint8Array };
    signature: { pub_key: { type: string; value: string }; signature: string };
  }>;
  sendToken: (
    chainId: string,
    publicKey: string,
    amount: number,
    receiverPublicKey: string,
  ) => Promise<string>;
  getPublicKey: ({ chainId: string }) => Promise<Uint8Array>;
  isSelectedWallet: ({ chainId: string, address: string }) => Promise<boolean>;
  chains: [ChainType];
  sortedChains: [ChainType];
} => useContext(Web3Context);
