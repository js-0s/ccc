'use client';
import { useConfirm } from '@/components/alert';
import { useState, useCallback, useMemo } from 'react';
import { useWeb3Context } from '@/context';
import {
  Table,
  TableCaption,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useData as useUserData } from './data';
import { SignMessage, SendToken, SendTokenKeplr } from '@/components/web3';
import { getChainSettings } from '@/lib/web3/chains';
import { Trash, HandCoins, Signature } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export function UserChains() {
  const confirm = useConfirm();
  const [signMessageId, setSignMessageId] = useState<string | null>(null);
  const [sendTokenId, setSendTokenId] = useState<string | null>(null);
  const [sendTokenKeplrId, setSendTokenKeplrId] = useState<string | null>(null);
  const { chains } = useWeb3Context();
  const { user, removeUserChain, isUpdating, refetch } = useUserData();
  const titleRemove = 'Remove Chain';
  const titleSend = 'Send Coins using Cosmos and Keplr';
  const titleSendKeplr = 'Send Coins using Keplr only';
  const titleSign = 'Sign any message';
  const descriptionRemove =
    'Chain will be removed from app, you can easily re-add it.';
  const remove = useCallback(
    async (id: string) => {
      if (!(await confirm({ title: titleRemove, body: descriptionRemove }))) {
        return;
      }
      await removeUserChain({ args: { chainId: id } });
      await refetch();
    },
    [removeUserChain, refetch, confirm],
  );
  const send = useCallback(
    async (id: string) => {
      setSendTokenId(id);
    },
    [setSendTokenId],
  );
  const sendKeplr = useCallback(
    async (id: string) => {
      setSendTokenKeplrId(id);
    },
    [setSendTokenKeplrId],
  );
  const sign = useCallback(
    async (id: string) => {
      setSignMessageId(id);
    },
    [setSignMessageId],
  );
  const onSignMessageDone = useCallback(() => {
    setSignMessageId(null);
  }, [setSignMessageId]);
  const onSendTokenDone = useCallback(() => {
    setSendTokenId(null);
  }, [setSendTokenId]);
  const onSendTokenKeplrDone = useCallback(() => {
    setSendTokenKeplrId(null);
  }, [setSendTokenKeplrId]);
  const userChains = useMemo(() => {
    return user.chains.map(chain => {
      let chainName = chain.chainId;
      let displayBalance = chain.lastBalance;
      if (typeof chain.chainId === 'string') {
        try {
          const chainSettings = getChainSettings({
            chains,
            chainId: chain.chainId,
          });
          if (chainSettings) {
            chainName = chainSettings.chainName;
            const coinBalance =
              Math.round(
                (chain.lastBalance /
                  Math.pow(10, chainSettings.currencies[0].coinDecimals)) *
                  1000,
              ) / 1000;
            displayBalance = `${coinBalance} ${chainSettings.currencies[0].coinDenom}`;
          }
        } catch (error) {
          console.error(error);
        }
      }

      return {
        ...chain,
        chainName,
        displayBalance,
      };
    });
  }, [chains, user]);
  return (
    <>
      <Table>
        <TableCaption>Chains</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Chain</TableHead>
            <TableHead className="w-[100px]">Public Key</TableHead>
            <TableHead className="w-[100px]">Update Time</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userChains.map(chain => (
            <TableRow key={chain.id ?? 0}>
              <TableCell className="font-medium">{chain.chainName}</TableCell>
              <TableCell className="max-w-[100px] overflow-hidden">
                <span title={chain.address}>{chain.address}</span>
              </TableCell>
              <TableCell>
                {
                  <span title={chain.lastCheckAt?.toString()}>
                    {dayjs(chain.lastCheckAt).fromNow()}
                  </span>
                }
              </TableCell>
              <TableCell className="text-right">
                <span title={chain.lastBalance}>{chain.displayBalance}</span>
              </TableCell>
              <TableCell className="text-right">
                <ButtonGroup>
                  <Button
                    key="remove"
                    onClick={() => remove(chain.id)}
                    title={titleRemove}
                    disabled={isUpdating}
                  >
                    <Trash />
                  </Button>
                  <Button
                    key="send"
                    onClick={() => send(chain.id)}
                    title={titleSend}
                    disabled={isUpdating}
                  >
                    <HandCoins />
                  </Button>
                  <Button
                    key="send-keplr"
                    onClick={() => sendKeplr(chain.id)}
                    title={titleSendKeplr}
                    disabled={isUpdating}
                  >
                    <HandCoins />
                  </Button>
                  <Button
                    key="sign"
                    onClick={() => sign(chain.id)}
                    title={titleSign}
                    disabled={isUpdating}
                  >
                    <Signature />
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {signMessageId !== null && (
        <SignMessage
          chainId={signMessageId}
          open={signMessageId !== null}
          onOpenChange={onSignMessageDone}
        />
      )}
      {sendTokenId !== null && (
        <SendToken
          chainId={sendTokenId}
          open={sendTokenId !== null}
          onOpenChange={onSendTokenDone}
        />
      )}
      {sendTokenKeplrId !== null && (
        <SendTokenKeplr
          chainId={sendTokenKeplrId}
          open={sendTokenKeplrId !== null}
          onOpenChange={onSendTokenKeplrDone}
        />
      )}
    </>
  );
}
