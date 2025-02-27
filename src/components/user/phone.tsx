'use client';
import { useState, useCallback } from 'react';
import { useData } from './data';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
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

import { MutationError } from '@/components/mutation-error';
export const formSchema = z.object({
  phone: z.string().min(2),
});

export function UserPhone() {
  const { user, updateUserPhone, isUpdating, refetch } = useData();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: { phone: user.phone },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        if (values.phone === user.phone) {
          setOpen(false);
          form.reset();
          return;
        }
        await updateUserPhone({
          args: { phone: values.phone },
        });
        setOpen(false);
        form.reset();
        await refetch();
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
    [updateUserPhone, form, refetch, user?.phone],
  );
  const onOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      if (!open) {
        form.reset();
      }
    },
    [setOpen, form],
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>{user.phone ?? 'Phone'}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen" tabIndex={undefined}>
        <DialogHeader>
          <DialogTitle>Modify Phone</DialogTitle>
          <DialogDescription>
            Change contact detail. Provide a phone-number or a messenger-id. The
            contact may be used by others to contact you if there are questions
            about your orders.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone" {...field} />
                  </FormControl>
                  <FormDescription>
                    Phone, Messenger-id, Bird-mark
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <MutationError
                error={
                  form.formState.errors?.root?.server?.type === 'error' &&
                  form.formState.errors.root.server.message
                }
              />
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="animate-spin" />}Submit
              </Button>{' '}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
