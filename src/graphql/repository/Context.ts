/**
 * GraphQL Context
 *
 * The exported context function is called for each graphql request. it returns
 * a populated  context with the current user and her permissions.
 * This method should be evaluated for performance and only expose values relevant
 * for all resolvers.
 *
 * Read more about the context:
 * https://www.apollographql.com/docs/apollo-server/data/resolvers/#the-context-argument
 */
import { auth } from '@/server/auth';
import initDebug from 'debug';
import { db } from '@/server/db';
import { getSessionUser } from '@/graphql/repository/User';
import type { PrismaClient } from '@prisma/client';
import { defineAbilityFor, getAbilitySubject } from '@/lib/auth';

const debug = initDebug('repository:Context');
// initDebug.enable('repository:Context');

export type SessionUserType = {
  id: string;
  disabled: boolean;
  email: string;
  name: string;
  roles: [string];
};
export type SessionInternalTokenType = {
  roles: [string];
};
export type SessionType = {
  user: SessionUserType;
  internalToken: SessionInternalTokenType;
  roles: [string];
};
export type AbilityType = {
  can: (verb: string | [string], instance: { id: string }) => boolean;
  subject: (
    subjectTypeName: string,
    instance: { id: string },
  ) => { id: string };
};
export type ContextType = {
  db: PrismaClient;
  session: SessionType;
  ability: AbilityType;
};

// this is the collection of flags that can be changed during development
// or for migrations and cli-scripts. The default is not to set them, so
// the disable* flags are enabled by default and the noqueue* flags as well
const developmentFlags = debug
  ? {
      debug: true,
      debugPerformance: true,
    }
  : {
      // default is empty. if the default is changed, also check the
      // worker defaults.
    };
const locale = process.env.LOCALE;
export const context = async () => {
  const session: SessionType = await auth();
  if (typeof session?.user?.email !== 'string' || !session.user.email.length) {
    // no session, context has access to DB
    debug('Context::context no token');
    const ability = defineAbilityFor(null);
    ability.subject = getAbilitySubject;
    return {
      session: null,
      db,
      ability,
    };
  }
  try {
    // populate frequently used session objects
    session.user = (await getSessionUser({
      db,
      session: { user: { email: session.user.email.toLowerCase() } },
    })) as SessionUserType;
    if (!session?.user?.id || session?.user?.disabled) {
      // no session, context has access to DB
      debug('Context::context user disabled');
      const ability = defineAbilityFor(null);
      ability.subject = getAbilitySubject;
      return {
        session: null,
      };
    }
    session.roles = session.user?.roles ?? [];
    const ability = defineAbilityFor(session.user);
    ability.subject = getAbilitySubject;

    debug('Context::context authenticated session', { session });
    // return a context with a populated session
    return {
      session,
      // utilities available to repositories
      db,
      locale,
      ability,
      // for development
      ...developmentFlags,
    };
  } catch (error) {
    console.error('graphql::repository::context', error);
  }
  // return a context with a session without permissions
  // session.user is the default next-auth user (has email)
  debug('Context::context error context');
  session.permissions = [];
  return {
    session,
  };
};
