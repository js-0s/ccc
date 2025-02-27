'use client';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { MutationError } from '@/components/mutation-error';

export const formSchema = z.object({
  chain: z.string().min(2),
  customChainId: z.string(),
});
export const defaultValues: z.infer<typeof formSchema> = {
  chain: 'regen-redwood-1',
  customChainId: '',
};
export function SelectChain({
  showSummary = false,
  disabled = false,
  actionLabel = 'Add Chain',
}: {
  showSummary: boolean;
  disabled: false;
  actionLabel: string;
}) {
  const { checkKeplr, selectChain, sortedChains } = useWeb3Context();
  const { user, refetch, addUserChain, refreshUserChains } = useUserData();

  const [open, setOpen] = useState(false);
  const [customChain, setCustomChain] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const watchChain = form.watch('chain');

  useEffect(() => {
    if (watchChain === 'custom') {
      setCustomChain(true);
    } else {
      setCustomChain(false);
    }
  }, [watchChain]);
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        setIsUpdating(true);
        let chainId: string | undefined = values.chain;
        if (values.chain === 'custom') {
          chainId = values.customChainId;
        }
        if (!(await checkKeplr())) {
          throw new Error('Keplr needs to be installed');
        }
        const selectedChainAddress = await selectChain(chainId);
        await addUserChain({
          args: { chainId, publicKey: selectedChainAddress },
        });
        await refreshUserChains({ args: { chainIdList: [] } });
        await refetch();
        form.reset();
        setOpen(false);
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
      setOpen,
      checkKeplr,
      selectChain,
      addUserChain,
      refetch,
      refreshUserChains,
    ],
  );
  const onOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      if (!open) {
        setIsUpdating(false);
        form.reset();
      }
    },
    [form, setIsUpdating, setOpen],
  );
  return (
    <>
      {showSummary && user.chains.length > 0 && (
        <>
          <p>You have {user.chains.length} chains configured.</p>
        </>
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button disabled={disabled}>{actionLabel}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a Chain to your Keplr wallet</DialogTitle>
            <DialogDescription>
              Select from the available chains or enter a dedicated chain-id
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="chain"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Chain</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a Chain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Chain</SelectLabel>
                              {sortedChains.map(({ chainId, chainName }) => (
                                <SelectItem key={chainId} value={chainId}>
                                  {chainName}
                                </SelectItem>
                              ))}
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Kepl-Chain-Registry Chains (some not working)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {customChain && (
                <FormField
                  control={form.control}
                  name="customChainId"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Chain ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Chain ID" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your custom chain id. (Find id in{' '}
                          <Link
                            href="https://github.com/chainapsis/keplr-chain-registry"
                            target="_blank"
                          >
                            Keplr Chain Registry
                          </Link>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}
              <MutationError
                error={
                  form.formState.errors?.root?.server?.type === 'error' &&
                  form.formState.errors.root.server.message
                }
              />
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="animate-spin" />}Select
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
