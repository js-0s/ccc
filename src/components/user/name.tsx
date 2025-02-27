'use client';
import { useState, useCallback } from 'react';
import { useData } from './data';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signOut } from 'next-auth/react';

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
  name: z.string().min(2),
});

export function UserName() {
  const { user, updateUserName, isUpdating } = useData();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: { name: user.name },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        if (values.name === user.name) {
          setOpen(false);
          form.reset();
          return;
        }
        await updateUserName({
          args: { name: values.name },
        });
        setOpen(false);
        await signOut({ redirectTo: '/' });
        form.reset();
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
    [updateUserName, form, user?.name],
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
        <Button>{user.name}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen" tabIndex={undefined}>
        <DialogHeader>
          <DialogTitle>Modify User Name</DialogTitle>
          <DialogDescription>
            Change the name of your User that is displayed to others. In order
            to fully populate the change, you are getting signed out and need to
            signin.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>Name for your user account.</FormDescription>
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
