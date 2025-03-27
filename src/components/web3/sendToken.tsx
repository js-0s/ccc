'use client';
import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import { useWeb3Context } from '@/context';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useData as useUserData } from '@/components/user/data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { InputCurrency } from '@/components/input-currency';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { MutationError } from '@/components/mutation-error';
import { getChainSettings } from '@/lib/web3/chains';
import { isAddress } from '@/lib/web3/address';

import { createProtobufSignDocument } from '@/lib/web3/sign';

function parseLocaleNumber(stringNumber: string | number, locale: string) {
  if (typeof stringNumber === 'number') {
    return stringNumber;
  }
  const thousandSeparator = Intl.NumberFormat(locale)
    .format(11111)
    .replace(/\p{Number}/gu, '');
  const decimalSeparator = Intl.NumberFormat(locale)
    .format(1.1)
    .replace(/\p{Number}/gu, '');

  return parseFloat(
    stringNumber
      .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
      .replace(new RegExp('\\' + decimalSeparator), '.'),
  );
}
export const formSchema = z.object({
  amount: z.custom<number>((formattedNumber: string) => {
    return parseLocaleNumber(formattedNumber, 'en-US') > 0;
  }),

  receiverAddress: z.custom<string>(isAddress, 'Invalid Address'),
  modeCoin: z.boolean(),
  message: z.string(),
});
export const defaultValues: z.infer<typeof formSchema> = {
  amount: 1,
  receiverAddress: 'regen19h0lmc3nksf8d68qzyhem83vqq02zcffxhcvmk',
  modeCoin: true,
  message: 'ccc send token',
};
export function SendToken({
  actionLabel = 'Send Token',
  chainId,
  open,
  onOpenChange,
}: {
  showSummary: boolean;
  actionLabel: string | ReactNode;
  chainId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    checkKeplr,
    signDocument,
    getPublicKey,
    chains,
    isSelectedWallet,
    selectedKey,
  } = useWeb3Context();
  const {
    user,
    requestAccountNumberAndSequence,
    broadcastChainSignedTransaction,
    refreshUserChains,
    refetch,
  } = useUserData();

  const [isUpdating, setIsUpdating] = useState(false);
  const [correctWallet, setCorrectWallet] = useState(false);
  const chain = useMemo(() => {
    for (const chain of user.chains) {
      if (chain.id === chainId) {
        return chain;
      }
    }
    return null;
  }, [chainId, user]);
  const chainSettings = useMemo(() => {
    if (typeof chain?.chainId !== 'string') {
      return null;
    }
    try {
      return getChainSettings({ chains, chainId: chain.chainId });
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [chain, chains]);
  const denom = useMemo(() => {
    return chainSettings?.currencies?.at(0)?.coinDenom ?? 'ETH';
  }, [chainSettings]);
  const minDenom = useMemo(() => {
    return chainSettings?.currencies?.at(0)?.coinMinimalDenom ?? 'wei';
  }, [chainSettings]);
  const coinDecimals = useMemo(() => {
    return chainSettings?.currencies?.at(0)?.coinDecimals ?? 18;
  }, [chainSettings]);
  const denomFormat = useMemo(() => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: minDenom,
        minimumFractionDigits: coinDecimals,
        maximumFractionDigits: coinDecimals,
      });
    } catch {
      return new Intl.NumberFormat('en-US', {
        //style: 'currency',
        //currency: denom,
        minimumFractionDigits: coinDecimals,
        maximumFractionDigits: coinDecimals,
      });
    }
  }, [minDenom, coinDecimals]);
  const minDenomFormat = useMemo(() => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: denom,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    } catch {
      return new Intl.NumberFormat('en-US', {
        //style: 'currency',
        //currency: denom,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
  }, [denom]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const watchModeCoin = form.watch('modeCoin');
  useEffect(() => {
    const amount = parseLocaleNumber(form.getValues('amount'), 'en-US');
    if (amount === defaultValues.amount && watchModeCoin) {
      form.setValue('amount', denomFormat.format(amount));
      return;
    }
    let convertedAmount = amount;
    let formatter = minDenomFormat;
    if (watchModeCoin) {
      // use denom
      convertedAmount = amount / Math.pow(10, coinDecimals);
      formatter = denomFormat;
    } else {
      // use minDenom
      convertedAmount = amount * Math.pow(10, coinDecimals);
      formatter = minDenomFormat;
    }
    if (isNaN(convertedAmount)) {
      form.setValue('amount', denomFormat.format(defaultValues.amount));
      form.setValue('mode', defaultValues.modeCoin);
      return;
    }
    form.setValue('amount', formatter.format(convertedAmount));
  }, [form, watchModeCoin, coinDecimals, minDenomFormat, denomFormat]);
  useEffect(() => {
    isSelectedWallet(chain?.chainId, chain?.publicKey)
      .then(selected => {
        setCorrectWallet(selected);
      })
      .catch(error => console.error);
  }, [isSelectedWallet, chain?.publicKey, selectedKey]);

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        setIsUpdating(true);
        if (!(await checkKeplr())) {
          throw new Error('Keplr needs to be installed');
        }
        const amount = parseLocaleNumber(form.getValues('amount'), 'en-US');
        let convertedAmount = amount;
        if (values.modeCoin) {
          convertedAmount = amount * Math.pow(10, coinDecimals);
        } else {
          convertedAmount = amount;
        }
        // ask the backend to create a sign-document that contains sequence and
        // accountNumber from rpc
        const signDoc = await requestAccountNumberAndSequence({
          args: {
            chainId: chain.chainId,
            senderAddress: chain.address,
          },
        });
        // ask keplr for the public key as uint8Array
        const publicKey = await getPublicKey({ chainId: chain.chainId });
        const chainSettings = getChainSettings({
          chains,
          chainId: chain.chainId,
        });
        // compile the protoDocument
        const protoDoc = await createProtobufSignDocument({
          chain: chainSettings,
          publicKey,
          senderAddress: chain.address,
          receiverAddress: values.receiverAddress,
          message: values.message,
          amount: convertedAmount,
          sequence: signDoc.sequence,
          accountNumber: signDoc.accountNumber,
        });
        // ask keplr to sign the document
        const signedDocument = await signDocument(chain, protoDoc);

        const signedTransactionBase64 = btoa(JSON.stringify(signedDocument));
        // ask the backend to send the transaction
        await broadcastChainSignedTransaction({
          args: {
            chainId: chain.chainId,
            signedTransactionBase64,
          },
        });
        await refreshUserChains({ args: { chainIdList: [] } });
        await refetch();
        form.reset();
        onOpenChange(false);
        setIsUpdating(false);
      } catch (error: unknown) {
        if (typeof error === 'string') {
          form.setError('root.server', { type: 'error', message: error });
        }
        if (error instanceof Error) {
          form.setError('root.server', {
            type: 'error',
            message: error.message,
          });
        }
      }
      setIsUpdating(false);
    },
    [
      form,
      onOpenChange,
      checkKeplr,
      signDocument,
      getPublicKey,
      refetch,
      refreshUserChains,
      broadcastChainSignedTransaction,
      requestAccountNumberAndSequence,
      chain,
      chains,
      coinDecimals,
    ],
  );
  const onOpenChangeIntern = useCallback(
    (open: boolean) => {
      if (!open) {
        setIsUpdating(false);
        form.reset();
      }
      if (typeof onOpenChange === 'function') {
        onOpenChange(open);
      }
    },
    [form, setIsUpdating, onOpenChange],
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChangeIntern}>
        {!open && (
          <DialogTrigger asChild>
            {typeof actionLabel === 'string' ? (
              <Button>{actionLabel}</Button>
            ) : (
              actionLabel
            )}
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Token</DialogTitle>
            <DialogDescription>
              Send Tokens to a different address. Sign the transaction using the
              keplr-wallet and broadcast the signed transaction in the backend.
            </DialogDescription>
          </DialogHeader>
          {correctWallet ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <InputCurrency
                            type="currency"
                            {...field}
                            currencyFormat={
                              watchModeCoin ? denomFormat : minDenomFormat
                            }
                            decimals={watchModeCoin ? coinDecimals : 0}
                          />
                        </FormControl>
                        <FormDescription>
                          Amount ({watchModeCoin ? denom : minDenom})
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="modeCoin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Format Amount</FormLabel>
                        <FormDescription>
                          Switch Input between {minDenom} and {denom}.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receiverAddress"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Receiver</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Public Key of the Receiver
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />{' '}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Message to store in wallet app
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <MutationError
                  error={
                    form.formState.errors?.root?.server?.type === 'error' &&
                    form.formState.errors.root.server.message
                  }
                />
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && <Loader2 className="animate-spin" />}Send
                </Button>
              </form>
            </Form>
          ) : (
            <MutationError
              title="Wrong Wallet Account"
              error={`You need to switch to the wallet that manages ${chain?.chainId} with address ${chain?.publicKey}`}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
