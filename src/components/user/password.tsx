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
  passwordCurrent: z.string().min(8),
  password: z.string().min(8),
  passwordRepeat: z.string().min(8),
});

export function UserPassword() {
  const { updateUserPassword, isUpdating } = useData();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passwordCurrent: '',
      password: '',
      passwordRepeat: '',
    },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        if (values.password !== values.passwordRepeat) {
          form.setError('passwordRepeat', {
            type: 'error',
            message: 'passwords do not match',
          });
          return;
        }
        await updateUserPassword({
          args: {
            currentPassword: values.passwordCurrent,
            password: values.password,
          },
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
    [updateUserPassword, form],
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
        <Button>Change Password</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen" tabIndex={undefined}>
        <DialogHeader>
          <DialogTitle>Modify Password</DialogTitle>
          <DialogDescription>Change the your password</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="passwordCurrent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>Your current password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />{' '}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>Your new password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />{' '}
            <FormField
              control={form.control}
              name="passwordRepeat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password Repeat</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>Your new password again.</FormDescription>
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
