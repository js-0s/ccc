import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { server } from '@/lib/graphql/server';
import { context } from '@/graphql/repository/Context';
import { NextResponse } from 'next/server';
import type { NextRequest, NextResponse } from 'next/server';

// this promise is resolved on the first call to the handler, then reused
const getApolloServerHandler: Promise<
  (req: NextRequest, res: NextResponse) => Promise<NextResponse>
> = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest, res: NextResponse): NextResponse =>
    await context({ req, res }),
});

async function graphqlHandler(req: NextRequest): NextResponse {
  const res = new NextResponse();
  const handler = await getApolloServerHandler; // noop after first call
  return await handler(req, res);
}
export { graphqlHandler as GET, graphqlHandler as POST };
