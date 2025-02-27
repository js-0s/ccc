/**
 * /@/type {import("@gqty/cli").GQtyConfig}
 */
const config = {
  scalarTypes: { DateTime: 'string' },
  introspection: {
    endpoint: '/app/src/graphql/schema.graphql',
    headers: {},
  },
  endpoint: '/api/graphql',
  destination: '/app/src/lib/graphql/index.ts',
  subscriptions: false,
  javascriptOutput: false,
  enumsAsConst: false,
};

module.exports = config;
