import { objectType, extendType, nonNull, stringArg } from 'nexus';
import * as ChainRepository from '@/graphql/repository/Chain';
import type { NexusGenArgTypes } from '@/graphql/schema-generated-types';
export const ChainType = objectType({
  name: 'Chain',
  description:
    'A Chain is connected to a user and stores the public key along with the' +
    ' latest acquired balance',
  definition(t) {
    t.id('id', {
      description: 'Unique persistent identifier of the Chain.',
    });
    t.date('lastCheckAt', {
      description: 'Date and time when this Chain was last synced.',
    });
    t.string('chainId', {
      description:
        'chain identifier, should be connected with the client-Chain.',
    });
    t.string('address', {
      description: 'Address as received from the client-Chain.',
    });
    t.string('lastBalance', {
      description: 'Last known balance of the Chain Address.',
      resolve(parent, args, context) {
        return `${parent.lastBalance}`;
      },
    });
  },
});

export const ChainMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('requestAccountNumberAndSequence', {
      type: 'JSONResult',
      description:
        'Request account number and sequence required to sign by the client-wallet',
      args: {
        chainId: nonNull(stringArg()),
        senderAddress: nonNull(stringArg()),
      },
      resolve(
        _root,
        args: NexusGenArgTypes['Mutation']['requestAccountNumberAndSequence'],
        _context: ContextType,
      ) {
        return ChainRepository.requestChainAccountNumberAndSequence({
          ...args,
        });
      },
    });
    t.field('broadcastChainSignedTransaction', {
      type: 'JSONResult',
      description: 'Broadcast a signed transaction to the network.',
      args: {
        chainId: nonNull(stringArg()),
        signedTransactionBase64: nonNull(stringArg()),
      },
      resolve(
        _root,
        args: NexusGenArgTypes['Mutation']['broadcastChainSignedTransaction'],
        _context: ContextType,
      ) {
        return ChainRepository.broadcastChainTransaction({
          ...args,
        });
      },
    });
  },
});
