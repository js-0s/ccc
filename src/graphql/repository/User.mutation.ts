import bcrypt from 'bcryptjs';
import { ParameterError, AccessError } from '@/graphql/repository/Error';
import type { ContextType } from '@/graphql/repository/Context';
import { listChains } from './User.list';
import { UserWithChainsTypeValidator } from './User.get';
export async function updateName({ name, ...context }: { name: string }) {
  const { db, session }: ContextType = context;
  return db.user.update({
    where: { id: session.user.id },
    data: { name },
  });
}
export async function updateEmail({ email, ...context }: { email: string }) {
  const { db, session }: ContextType = context;
  return db.user.update({
    where: { id: session.user.id },
    data: { email },
  });
}
export async function updatePassword({
  currentPassword,
  password,
  ...context
}: {
  currentPassword: string;
  password: string;
}) {
  const { db, session }: ContextType = context;
  const instance = await db.user.findUnique({ where: { id: session.user.id } });
  const isPasswordValid: boolean = await bcrypt.compare(
    currentPassword,
    instance.password,
  );
  if (!isPasswordValid) {
    throw new ParameterError('Invalid current password');
  }
  const salt: string = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(password, salt);
  return db.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });
  return db.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });
}
export async function updatePhone({ phone, ...context }: { phone: string }) {
  const { db, session }: ContextType = context;
  return db.user.update({
    where: { id: session.user.id },
    data: { phone },
  });
}
export async function updateSignin({ ...context }: { phone: string }) {
  const { db, session }: ContextType = context;
  const instance = await db.user.findUnique({ where: { id: session.user.id } });
  if (instance.lastSigninAt) {
    await db.user.update({
      where: { id: session.user.id },
      data: { prevSigninAt: instance.lastSigninAt },
    });
  }
  return db.user.update({
    where: { id: session.user.id },
    data: { lastSigninAt: new Date() },
  });
}
export async function updateSignout({ ...context }: { phone: string }) {
  const { db, session }: ContextType = context;
  return db.user.update({
    where: { id: session.user.id },
    data: { lastSignoutAt: new Date() },
  });
}
export async function updateLocation({
  location,
  ...context
}: {
  location: { longitude: number; latitude: number };
}) {
  const { db, session }: ContextType = context;
  return db.user.update({
    where: { id: session.user.id },
    data: {
      location: {
        create: { longitude: location.longitude, latitude: location.latitude },
      },
    },
  });
}
export async function updateRoles({ roles, ...context }: { roles: [string] }) {
  const { db, session }: ContextType = context;
  if (roles.includes('admin')) {
    throw new AccessError('cannot upgrade to admin role');
  }
  return db.user.update({
    where: { id: session.user.id },
    data: {
      roles,
    },
  });
}
export async function addChain({
  chainId,
  address,
  ...context
}: {
  chainId: string;
  address: string;
}) {
  const { db, session }: ContextType = context;
  const chains = await listChains({
    parent: { id: session.user.id },
    ...context,
  });
  if (Array.isArray(chains)) {
    for (const chain of chains) {
      if (chain.chainId === chainId && chain.address === address) {
        throw new ParameterError('This chain is already part of your chains');
      }
    }
  }
  return db.user.update({
    where: { id: session.user.id },
    data: {
      chains: { create: { chainId, address, lastBalance: 0 } },
    },
  });
}
export async function removeChain({
  // this might be confusing, its about the db-chain-id, not the chain.chainId
  chainId,
  ...context
}: {
  chainId: string;
}) {
  const { db, session }: ContextType = context;
  return db.user.update({
    where: { id: session.user.id },
    data: {
      chains: { disconnect: { id: chainId } },
    },
  });
}
import { getChains, getChainSettings } from '@/lib/web3/chains';
import { getBalance, getCosmosBalance } from '@/lib/web3/balance';

export async function refreshChains({
  chainIdList,
  ...context
}: {
  chainIdList: [string];
}): Promise<UserWithChainType> {
  const { db, session }: ContextType = context;
  const userChains = await listChains({
    parent: { id: session.user.id },
    ...context,
  });
  let refreshChainIdList = [];
  if (chainIdList.length === 0) {
    refreshChainIdList = userChains.map(({ id }) => id);
  } else {
    for (const chainId of chainIdList) {
      if (!userChains.find(({ id }) => id === chainId)) {
        throw new ParameterError('bad chain id');
      }
      refreshChainIdList.push(chainId);
    }
  }
  const refreshChainList = userChains.filter(({ id }) =>
    refreshChainIdList.includes(id),
  );
  const chains = await getChains({ withRemote: true });
  const errors = [];
  for (const refreshChain of refreshChainList) {
    try {
      const chain = getChainSettings({ chains, chainId: refreshChain.chainId });
      if (refreshChain.chainId.startsWith('regen')) {
        const balance = await getBalance({
          chain,
          address: refreshChain.address,
        });

        await db.chain.update({
          where: { id: refreshChain.id },
          data: {
            lastBalance: balance.amount,
            lastCheckAt: new Date(),
          },
        });
      } else {
        const balance = await getCosmosBalance({
          chain,
          address: refreshChain.address,
        });
        await db.chain.update({
          where: { id: refreshChain.id },
          data: {
            lastBalance: balance.amount,
            lastCheckAt: new Date(),
          },
        });
      }
    } catch (error: unknown) {
      if (typeof error === 'string') {
        errors.push(error);
      } else if (error instanceof Error) {
        errors.push(error.message);
      }
    }
  }
  if (errors.length >= refreshChainList.length) {
    throw new ParameterError(
      'Failed to process all requests:' + errors.join(','),
    );
  }
  return await db.user.findUnique({
    where: { id: session.user.id },
    ...UserWithChainsTypeValidator,
  });
}
