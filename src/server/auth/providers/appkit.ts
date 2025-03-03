import CredentialsProvider from 'next-auth/providers/credentials';
import {
  /* verifySignature, */
  getChainIdFromMessage,
  getAddressFromMessage,
} from '@reown/appkit-siwe';
import { createPublicClient, http } from 'viem';
import { db } from '@/server/db';
import { projectId } from '@/lib/appkit/config';

export function AppKit() {
  return CredentialsProvider({
    name: 'appkit',
    id: 'appkit',
    credentials: {
      message: {
        label: 'Message',
        type: 'text',
        placeholder: '0x0',
      },
      signature: {
        label: 'Signature',
        type: 'text',
        placeholder: '0x0',
      },
    },
    async authorize(credentials: { message: string; signature: string }) {
      try {
        if (!credentials?.message) {
          throw new Error('SiweMessage is undefined');
        }
        const { message, signature } = credentials;
        const address = getAddressFromMessage(message);
        const chainId = getChainIdFromMessage(message);

        // for the moment, the verifySignature is not working with social logins and emails  with non deployed smart accounts
        /*  const isValid = await verifySignature({
              address,
              message,
              signature,
              chainId,
              projectId,
            }); */
        // we are going to use https://viem.sh/docs/actions/public/verifyMessage.html
        const publicClient = createPublicClient({
          transport: http(
            `https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${projectId}`,
          ),
        });
        const isValid = await publicClient.verifyMessage({
          message,
          address: address as `0x${string}`,
          signature: signature as `0x${string}`,
        });
        // end o view verifyMessage

        if (!isValid) {
          throw new Error('Invalid Signature');
        }
        const userEmail = `${chainId}:${address}`.toLowerCase();
        let dbUser = await db.user.findUnique({
          where: { email: userEmail },
        });
        if (!dbUser) {
          dbUser = await db.user.create({
            data: {
              name: userEmail,
              username: userEmail,
              createdAt: new Date(),
              email: userEmail,
              password: null,
              roles: ['user'],
            },
          });
        } else {
          if (dbUser.password) {
            throw new Error(
              'a user already signed up with ${userEmail} and set a password',
            );
          }
        }
        if (dbUser) {
          return dbUser;
        }
      } catch (error: unknown) {
        if (typeof error === 'string') {
          console.error(
            JSON.stringify({
              type: 'error',
              message: 'AppKitProvider::authorize:' + error,
            }),
          );
        }
        if (error instanceof Error) {
          console.error({ error });
          console.error(
            JSON.stringify({
              type: 'error',
              message: 'AppKitProvider::authorize:' + error.message,
              origin: error,
            }),
          );
        }
      }
      return null;
    },
  });
}
