'use client';
/**
 * GQty: You can safely modify this file based on your needs.
 */
import initDebug from 'debug';

import { createReactClient } from '@gqty/react';
import { createClient as createSubscriptionsClient } from 'graphql-ws';
import {
  Cache,
  createClient,
  defaultResponseHandler,
  type QueryFetcher,
} from 'gqty';
import {
  generatedSchema,
  scalarsEnumsHash,
  type GeneratedSchema,
} from './schema.generated';
const debug = initDebug('graphql:library');
//initDebug.enable('graphql:library')
const queryFetcher: QueryFetcher = async function (
  { query, variables, operationName },
  fetchOptions,
) {
  // Modify "/api/graphql" if needed
  debug('queryFetcher', { query, variables, operationName, fetchOptions });
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
    mode: 'cors',
    ...fetchOptions,
  });
  return await defaultResponseHandler(response);
};

const subscriptionsClient =
  typeof window !== 'undefined'
    ? createSubscriptionsClient({
        lazy: true,
        url: () => {
          // Modify if needed
          const url = new URL('/api/graphql', window.location.href);
          url.protocol = url.protocol.replace('http', 'ws');
          return url.href;
        },
      })
    : undefined;

const cache = new Cache(
  undefined,
  /**
   * Default option is immediate cache expiry but keep it for 5 minutes,
   * allowing soft refetches in background.
   */
  {
    maxAge: 0,
    staleWhileRevalidate: 5 * 60 * 1000,
    normalization: true,
  },
);

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  suspense: false,
  cache,
  fetchOptions: {
    fetcher: queryFetcher,
    subscriber: subscriptionsClient,
  },
});

// Core functions
export const { resolve, subscribe, schema } = client;

// Legacy functions
export const {
  query,
  mutation,
  mutate,
  subscription,
  resolved,
  refetch,
  track,
} = client;

export const {
  graphql,
  useQuery,
  usePaginatedQuery,
  useTransactionQuery,
  useLazyQuery,
  useRefetch,
  useMutation,
  useMetaState,
  prepareReactRender,
  useHydrateCache,
  prepareQuery,
  useSubscription,
} = createReactClient<GeneratedSchema>(client, {
  defaults: {
    // Enable Suspense, you can override this option for each hook.
    suspense: false,
  },
});

export * from './schema.generated';
