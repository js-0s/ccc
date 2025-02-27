/***
 * User Repository
 *
 * All user access methods
 */
import initDebug from 'debug';
import type { ContextType } from '@/graphql/repository/Context';
import type {
  User as UserType,
  Location as LocationType,
} from '@prisma/client';
import { Prisma } from '@prisma/client';

export const UserWithLocationTypeValidator = Prisma.validator<UserType>()({
  include: { location: true },
});
export type UserWithLocationType = Prisma.UserGetPayload<
  typeof UserWithLocationTypeValidator
>;
export const UserWithChainsTypeValidator = Prisma.validator<UserType>()({
  include: { chains: true },
});
export type UserWithChainsType = Prisma.UserGetPayload<
  typeof UserWithChainsTypeValidator
>;
const debug = initDebug('repository:User');
// initDebug.enable('repository:User')
export async function getSessionUser({ ...context }): Promise<UserType> {
  const { session }: ContextType = context;
  //debug('User::getSessionUser', { session });
  // uncovered by integration tests
  if (typeof session?.user?.email !== 'string') {
    return {};
  }
  return await get({ email: session.user.email, ...context, session });
}

export async function cleanInstance(instance: UserType): Promise<{
  id: string;
  email: string;
  name: string;
}> {
  const email = instance?.email?.toLowerCase();
  const name = instance?.name ?? '';
  const clean = {
    ...instance,
    name,
    email,
  };
  return clean;
}
export async function get({ email, ...context }: { email: string }) {
  const { db }: ContextType = context;
  //debug('User::get', { email });
  const instance = await db.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
  if (!instance) {
    return null;
  }
  return await cleanInstance(instance);
}
export async function getById({ userId, ...context }: { userId: string }) {
  const { db }: ContextType = context;
  debug('User::getById', { userId });
  const instance = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!instance) {
    return null;
  }
  return await cleanInstance(instance);
}
export async function getUser({
  id,
  email,
  ...context
}: {
  id: string;
  email: string;
}) {
  const { session }: ContextType = context;
  debug('User::getUser', { session, id, email });
  if (email) {
    return await get({ email, ...context });
  }
  if (id) {
    return await getById({ userId: id, ...context });
  }
  return null;
}
export async function updatedBy({
  parent,
  ...context
}: {
  parent: { updatedBy: UserType; updatedById: string };
}) {
  const { db }: ContextType = context;
  if (!parent.updatedById) {
    return null;
  }
  if (
    parent.updatedBy &&
    typeof parent.updatedBy === 'object' &&
    typeof parent.updatedBy.name === 'string' &&
    typeof parent.updatedBy.id === 'string'
  ) {
    return cleanInstance(parent.updatedBy);
  }
  const instance = await db.user.findUnique({
    where: { id: parent.updatedById },
    select: { name: true, id: true },
  });
  return cleanInstance(instance);
}
export async function getName({
  parent,
  ...context
}: {
  parent: UserType;
}): Promise<string | null> {
  const { db }: ContextType = context;
  if (parent?.name) {
    return parent.name;
  }
  if (parent?.username) {
    return parent.username;
  }
  if (typeof parent?.email === 'string') {
    return parent.email.replace(/@.*/, '');
  }
  if (!parent?.id) {
    return null;
  }
  const instance = await db.user.findUnique({
    where: { id: parent.id },
    select: { name: true, username: true, email: true },
  });
  return (
    instance?.name ?? instance?.username ?? instance?.email.replace(/@.*/, '')
  );
}
export async function getLocation({
  parent,
  ...context
}: {
  parent: UserWithLocationType;
}): Promise<LocationType> {
  const { db }: ContextType = context;
  if (!parent?.id) {
    return null;
  }
  if (
    typeof parent?.location?.latitude === 'number' &&
    typeof parent?.location?.longitude === 'number'
  ) {
    return parent.location;
  }
  const instance = await db.user.findUnique({
    where: { id: parent.id },
    ...UserWithLocationTypeValidator,
  });
  return instance?.location ?? null;
}
export async function getLastSigninAt({
  parent,
  ...context
}: {
  parent: UserType;
}): Promise<Date> {
  const { db }: ContextType = context;
  let instance = parent;
  if (
    !instance?.lastSigninAt ||
    !instance?.prevSigninAt ||
    !instance?.lastSignoutAt
  ) {
    instance = await db.user.findUnique({ where: { id: parent.id } });
  }
  if (!instance) {
    return new Date();
  }
  if (
    new Date(instance.lastSignoutAt).getTime() >
    new Date(instance.lastSigninAt).getTime()
  ) {
    return instance.lastSigninAt;
  }
  if (
    new Date(instance.lastSigninAt).getTime() + 500_000 <
    instance.prevSigninAt
  ) {
    return instance.prevSigninAt;
  }
  return instance.lastSigninAt;
}
