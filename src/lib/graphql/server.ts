import { ApolloServer } from '@apollo/server';
import type { ApolloServerPlugin } from '@/apollo/server';
import { schema } from '@/graphql';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';

let plugins: [ApolloServerPlugin] = [];

if (process.env.NODE_ENV === 'production') {
  // dont expose what kind of server we use
  plugins = [ApolloServerPluginLandingPageDisabled()];
}

export const server = new ApolloServer({
  schema,
  plugins,
});
