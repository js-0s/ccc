/**
 * GraphQL Data Authorization
 *
 * methods that check if the given session is allowed to access a certain
 * resource
 */
import { ParameterError, AccessError } from '@/graphql/repository/Error';
import initDebug from 'debug';
import type { ContextType, SessionType } from '@/graphql/repository/Context';
import type { PrismaClient } from '@prisma/client';
import { ruleType } from 'nexus-shield';
const debug = initDebug('repository:Auth');
/**
 * hasSession
 *
 * check if the given context has a session.
 * Should be used for all data that is available for logged-in users regardless
 * of their permissions.
 */
export async function hasSession(context: ContextType) {
  if (!context?.session?.user?.email) {
    throw new ParameterError(
      `Auth::hasSession: Session data not valid - session: ${
        context?.session ? JSON.stringify(context.session) : 'no session object'
      } `,
    );
  }
  if (typeof context.session.user.email !== 'string') {
    throw new ParameterError(
      `Auth::hasSession: Session email not valid - email type: ${typeof context.session.user.email})`,
    );
  }
  if (!context.session.user.email.trim().length) {
    throw new ParameterError(
      `Auth::hasSession: Session email not valid - empty string`,
    );
  }
  debug(context.session.user.email, 'has a session');
  return true;
}

/**
 * hasPermission
 *
 * checks if the current session has one of the given permissions.
 */
export function hasPermission(
  requiredPermissionList: [string],
  session: SessionType,
) {
  if (Array.isArray(session?.internalToken?.roles)) {
    for (const role of session.internalToken.roles) {
      if (requiredPermissionList.includes(role)) {
        return true;
      }
    }
  }
  if (!Array.isArray(session?.roles)) {
    debug('bad session', { session, requiredPermissionList });
    const userName = session?.user?.name;
    const userEmail = session?.user?.email;
    const hasUserData = userName || userEmail ? true : false;
    const errorMessage = `Auth::hasPermission: Bad session or permissions - ${
      hasUserData ? `user: ${userName}, ${userEmail}` : 'no user data'
    }`;
    throw new AccessError(errorMessage);
  }
  for (const role of session.roles) {
    if (requiredPermissionList.includes(role)) {
      debug(session.user.email, 'has a permission', role);
      return true;
    }
  }
  const roleList = `required: (${requiredPermissionList.join(
    ',',
  )}), current: (${session.roles.join(',')})`;
  debug('bad session', { session, requiredPermissionList });
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;
  const hasUserData = userName || userEmail ? true : false;
  const errorMessage = `Auth::hasPermission: Bad session permissions - ${
    hasUserData ? `user: ${userName}, ${userEmail}` : 'no user data'
  }`;
  throw new AccessError(`${errorMessage} - ${roleList}`);
}
/**
 * checkPermission
 *
 * checks if the current session has one of the given permissions.
 * returning true/false
 */
export function checkPermission(
  requiredPermissionList: [string],
  session: SessionType,
) {
  if (Array.isArray(session?.internalToken?.permissions)) {
    for (const role of session.internalToken.roles) {
      if (requiredPermissionList.includes(role)) {
        return true;
      }
    }
  }
  if (!Array.isArray(session?.roles)) {
    debug('bad session', { session, requiredPermissionList });
    return false;
  }
  for (const role of session.roles) {
    if (requiredPermissionList.includes(role)) {
      debug(session.user.email, 'has a role', role);
      return true;
    }
  }
  return false;
}

export const isAuthenticated = ruleType({
  resolve: (
    root: ResolverRootType,
    args: ResolverArgsType,
    context: ContextType,
  ) => {
    debug('Auth::isAuthenticated(rule):', {
      root,
      args,
      session: context.session,
    });
    try {
      hasPermission(['admin', 'user'], context.session);
      return true;
    } catch (error) {
      debug('Auth::isAuthenticated(rule):', error);
      throw error;
    }
  },
});

type CheckModelType = {
  [K in keyof PrismaClient]: 'findUnique' extends keyof PrismaClient[K]
    ? K
    : never;
}[keyof PrismaClient];

type GenericReturnTypeFindUnique<T extends keyof PrismaClient> = ReturnType<
  PrismaClient[T]['findUnique']
>;
type ResolverInfoType = { returnType: { name: CheckModelType } };
type ResolverRootType = { id: string };
type ResolverArgsType = { id: string };

async function checkId<T extends CheckModelType>(
  verb: string,
  id: string,
  context: ContextType,
  typeName: string,
  collectionName: T,
) {
  const { db, ability } = context;
  const include = {};
  // modify include based on type depending on lib/auth object requirements
  const model = db[collectionName];
  const instance = (await model.findUnique({
    where: { id },
    include,
  })) as GenericReturnTypeFindUnique<T>;
  if (!ability?.can('read', ability.subject(typeName, instance))) {
    throw new AccessError(
      `Invalid ${verb} access to ${typeName} database instance ${id}`,
    );
  }
}
export const readAbility = ruleType({
  async resolve(
    root: ResolverRootType,
    args: ResolverArgsType,
    context: ContextType,
    info: ResolverInfoType,
  ) {
    const { ability } = context;
    debug('Auth::list(rule):', {
      root,
      args,
      session: context.session,
    });
    const typeName = info.returnType.name;
    const collectionName = typeName.toLowerCase();
    if (ability?.can('read', typeName)) {
      return true;
    }
    if (args?.id) {
      await checkId('read', args.id, context, typeName, collectionName);
    }
    throw new AccessError(`Invalid read ability for ${typeName}`);
  },
});
export const listAbility = ruleType({
  async resolve(
    root: ResolverRootType,
    args: ResolverArgsType,
    context: ContextType,
    info: ResolverInfoType,
  ) {
    const { ability } = context;
    debug('Auth::list(rule):', {
      root,
      args,
      session: context.session,
    });
    const typeName = info.returnType.name;
    const collectionName = typeName.toLowerCase();
    if (ability?.can('list', typeName.replace(/Edge$/, ''))) {
      return true;
    }
    if (args?.id) {
      return await checkId('list', args.id, context, typeName, collectionName);
    }

    throw new AccessError(
      `Invalid list ability for ${typeName.replace(/Edge$/, '')}`,
    );
  },
});
export const updateAbility = ruleType({
  async resolve(
    root: ResolverRootType,
    args: ResolverArgsType,
    context: ContextType,
    info: ResolverInfoType,
  ) {
    const { ability } = context;
    debug('Auth::update(rule):', {
      root,
      args,
      session: context.session,
    });
    const typeName = info.returnType.name;
    const collectionName = typeName.toLowerCase();
    if (ability?.can('update', typeName)) {
      return true;
    }
    if (args?.id) {
      await checkId('update', args.id, context, typeName, collectionName);
    }

    throw new AccessError(`Invalid update ability for ${typeName}`);
  },
});
export const createAbility = ruleType({
  async resolve(
    root: ResolverRootType,
    args: ResolverArgsType,
    context: ContextType,
    info: ResolverInfoType,
  ) {
    const { ability } = context;
    debug('Auth::create(rule):', {
      root,
      args,
      session: context.session,
    });
    const typeName = info.returnType.name;
    if (ability?.can('create', typeName)) {
      return true;
    }
    throw new AccessError(`Invalid create ability for ${typeName}`);
  },
});
export const removeAbility = ruleType({
  async resolve(
    root: ResolverRootType,
    args: ResolverArgsType,
    context: ContextType,
    info: ResolverInfoType,
  ) {
    const { ability } = context;
    debug('Auth::remove(rule):', {
      root,
      args,
      session: context.session,
    });
    const typeName = info.returnType.name;
    const collectionName = typeName.toLowerCase();
    if (ability?.can('remove', typeName)) {
      return true;
    }
    if (args?.id) {
      await checkId('remove', args.id, context, typeName, collectionName);
    }
    throw new AccessError(`Invalid remove ability for ${typeName}`);
  },
});
export const readableByAdmin = ruleType({ resolve: () => true });
export const viewPrivateUserFields = ruleType({ resolve: () => true });
export const readableByPublic = ruleType({ resolve: () => true });
