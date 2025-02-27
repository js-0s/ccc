'use client';
import { useEffect, useState, useCallback } from 'react';
import { useWeb3Context } from '@/context';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { MutationError } from '@/components/mutation-error';
import { getChainSettings, type ChainType } from '@/lib/web3/chains';

export const formSchema = z.object({
  chain: z.string().min(2),
  json: z.string(),
});
export const defaultValues: z.infer<typeof formSchema> = {
  chain: 'regen-redwood-1',
  json: '',
};
export function SuggestChain() {
  const { suggestChain, checkKeplr, chains, sortedChains } = useWeb3Context();
  const [open, setOpen] = useState(false);
  const [customChain, setCustomChain] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

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
        let suggestChainJSON: ChainType | undefined = undefined;
        if (values.chain === 'custom') {
          suggestChainJSON = JSON.parse(values.json) as ChainType;
        } else {
          suggestChainJSON = getChainSettings({
            chains,
            chainId: values.chain,
          });
        }
        if (!(await checkKeplr())) {
          throw new Error('Keplr needs to be installed');
          return;
        }
        const start = Date.now();
        await suggestChain(suggestChainJSON);
        const done = Date.now();
        if (done - start < 500) {
          toast({
            title: 'Chain already available in wallet',
            description: `Your wallet already has ${suggestChainJSON.chainName} enabled`,
          });
        }
        setOpen(false);
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
    },
    [form, setOpen, checkKeplr, chains, suggestChain, toast],
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Suggest</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suggest a Chain to your Keplr wallet</DialogTitle>
          <DialogDescription>
            Select from the available chains or paste a suggest json
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
                    <FormDescription>Preconfigured Chains</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {customChain && (
              <FormField
                control={form.control}
                name="json"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>JSON</FormLabel>
                      <FormControl>
                        <Textarea placeholder="JSON" {...field} />
                      </FormControl>
                      <FormDescription>
                        Paste custom JSON for the keplr-suggest feature
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
              {isUpdating && <Loader2 className="animate-spin" />}Add
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
