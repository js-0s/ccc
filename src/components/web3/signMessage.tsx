'use client';
import { useAlert } from '@/components/alert';
import { useState, useCallback, useMemo, type ReactNode } from 'react';
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

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { MutationError } from '@/components/mutation-error';
export const formSchema = z.object({
  message: z.string(),
});
export const defaultValues: z.infer<typeof formSchema> = {
  message: '',
};
export function SignMessage({
  actionLabel = 'Sign Message',
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
  const { checkKeplr, signMessage } = useWeb3Context();
  const { user } = useUserData();
  const alert = useAlert();

  const [isUpdating, setIsUpdating] = useState(false);
  const chain = useMemo(() => {
    for (const chain of user.chains) {
      if (chain.id === chainId) {
        return chain;
      }
    }
    return null;
  }, [chainId, user]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        setIsUpdating(true);
        if (!(await checkKeplr())) {
          throw new Error('Keplr needs to be installed');
        }
        const signedMessage = await signMessage(
          chain.chainId,
          chain.address,
          values.message,
        );
        await alert({
          title: 'Your Signed Message',
          body: (
            <pre className="whitespace-pre">
              ==== Signed Message ====
              {'\n'}
              {values.message}
              {'\n'}==== Signature (Base64 encoded) ===={'\n'}
              {btoa(JSON.stringify(signedMessage)).replace(
                /([^\n]{1,56})/g,
                '$1\n',
              )}
              ==== Signature End ====
            </pre>
          ),
        });
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
    [form, onOpenChange, checkKeplr, signMessage, chain, alert],
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
        <DialogTrigger asChild>
          {typeof actionLabel === 'string' ? (
            <Button>{actionLabel}</Button>
          ) : (
            actionLabel
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Message</DialogTitle>
            <DialogDescription>
              Sign message with chain {chain?.chainId}/{chain?.address}. This
              is only useful to proof ownership of a wallet.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>Your Message to Sign</FormDescription>
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
                {isUpdating && <Loader2 className="animate-spin" />}Sign
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
