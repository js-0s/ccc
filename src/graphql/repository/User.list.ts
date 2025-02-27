/***
 * User Repository
 *
 * All user access methods
 */
import type { ContextType } from '@/graphql/repository/Context';
import type { User as UserType, Chain as ChainType } from '@prisma/client';
import {
  UserWithChainsTypeValidator,
  type UserWithChainsType,
} from './User.get';

export async function listRoles({
  parent,
  ...context
}: {
  parent: UserType;
}): Promise<string | null> {
  const { db }: ContextType = context;
  if (Array.isArray(parent?.roles)) {
    return parent.roles;
  }
  if (!parent?.id) {
    return null;
  }
  const instance = await db.user.findUnique({
    where: { id: parent.id },
    select: { roles: true },
  });
  return instance?.roles ?? null;
}

export async function listChains({
  parent,
  ...context
}: {
  parent: UserWithChainsType;
}): Promise<[ChainType]> {
  const { db }: ContextType = context;
  if (!parent?.id) {
    return null;
  }
  if (Array.isArray(parent?.chains)) {
    return parent.chains;
  }
  const instance = await db.user.findUnique({
    where: { id: parent.id },
    ...UserWithChainsTypeValidator,
  });
  return instance?.chains ?? null;
}
