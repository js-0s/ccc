import { getCsrfToken, signIn, signOut, getSession } from 'next-auth/react';
import type {
  SIWEVerifyMessageArgs,
  SIWECreateMessageArgs,
  SIWESession,
} from '@reown/appkit-siwe';
import { createSIWEConfig, formatMessage } from '@reown/appkit-siwe';
import { mainnet, sepolia } from '@reown/appkit/networks';

export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: typeof window !== 'undefined' ? window.location.host : '',
    uri: typeof window !== 'undefined' ? window.location.origin : '',
    chains: [mainnet.id, sepolia.id],
    statement: 'Please sign with your account',
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, address),
  getNonce: async () => {
    const nonce = await getCsrfToken();
    if (!nonce) {
      throw new Error('Failed to get nonce!');
    }

    return nonce;
  },
  getSession: async () => {
    const session: { user: { name: string; email: string } } =
      await getSession();
    if (!session) {
      return null;
    }
    // Validate address and chainId types
    if (
      session.user?.name === session.user?.email &&
      typeof session.user?.name === 'string' &&
      session.user.name.indexOf('0x') > 0
    ) {
      const possibleAppkitSession = session.user.name.split(':0x');
      if (possibleAppkitSession.length !== 2) {
        return null;
      }
      const address = `0x${possibleAppkitSession[1]}`;
      const chainId = Number(possibleAppkitSession[0].split(':')[1]) as string;
      return {
        address,
        chainId,
      } satisfies SIWESession;
    }
    return null;
  },
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      const success = await signIn('appkit', {
        message,
        redirect: false,
        signature,
        callbackUrl: '/dashboard',
      });
      // lets redirect the user to the dashboard
      // this has to be done async to avoid a appkit-error-message
      // that will be triggered when using next-auth redirect feature
      if (success?.ok && typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      }
      return Boolean(success?.ok);
    } catch (error: unknown) {
      if (typeof error === 'string') {
        console.error(
          JSON.stringify({
            type: 'error',
            message: 'sime-config::verifyMessage:' + error,
          }),
        );
      }
      if (error instanceof Error) {
        console.error(
          JSON.stringify({
            type: 'error',
            message: 'sime-config::verifyMessage:' + error.message,
            origin: error,
          }),
        );
      }
      return false;
    }
  },
  signOut: async () => {
    try {
      await signOut({
        redirect: false,
      });

      return true;
    } catch (error: unknown) {
      if (typeof error === 'string') {
        console.error(
          JSON.stringify({
            type: 'error',
            message: 'sime-config::signOut:' + error,
          }),
        );
      }
      if (error instanceof Error) {
        console.error(
          JSON.stringify({
            type: 'error',
            message: 'sime-config::signOut:' + error.message,
            origin: error,
          }),
        );
      }
      return false;
    }
  },
});
