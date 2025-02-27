'use client';
import initDebug from 'debug';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useRefetch } from '@/lib/graphql';
import { useCallback, useMemo, useContext, createContext } from 'react';
const debug = initDebug('user:data');
// initDebug.enable('user:data');
const DataContext = createContext({});

export function UserDataContextProvider({
  children,
}: ReadOnly<{ children: React.ReactNode }>) {
  const { data: session } = useSession();
  const queryArgsUser = useMemo(() => {
    debug('rememo: queryArgsUser', { userId: session?.user?.id });
    return { id: session?.user?.id ?? '' };
  }, [session?.user?.id]);

  const gqRefetch = useRefetch();

  const { User: gqUser } = useQuery({
    prepare({ query, prepass }) {
      const prepassList = [
        'id',
        'name',
        'roles',
        'email',
        'phone',
        'location.latitude',
        'location.longitude',
        'chains.id',
        'chains.chainId',
        'chains.publicKey',
        'chains.lastBalance',
        'chains.lastCheckAt',
        'lastSigninAt',
        'lastSignoutAt',
        'createdAt',
      ];
      if (queryArgsUser?.id) {
        prepass(query.User(queryArgsUser), ...prepassList);
      }
      debug('prepare: useQuery done');
    },
  });
  const gqUserData = queryArgsUser.id ? gqUser(queryArgsUser) : undefined;
  const user = useMemo(() => {
    debug('rememo user');
    return {
      id: gqUserData?.id,
      name: gqUserData?.name,
      email: gqUserData?.email,
      roles: gqUserData?.roles?.map(role => role) ?? [],
      createdAt: gqUserData?.createdAt,
      lastSigninAt: gqUserData?.lastSigninAt,
      lastSignoutAt: gqUserData?.lastSignoutAt,
      phone: gqUserData?.phone,
      location: {
        latitude: gqUserData?.location?.latitude,
        longitude: gqUserData?.location?.longitude,
      },
      chains:
        gqUserData?.chains?.map(
          ({
            id,
            chainId,
            publicKey,
            lastBalance,
            lastCheckAt,
          }: {
            id: string;
            chainId: string;
            publicKey: string;
            lastBalance: number;
            lastCheckAt: Date;
          }) => ({
            id,
            chainId,
            publicKey,
            lastBalance,
            lastCheckAt,
          }),
        ) ?? [],
    };
  }, [
    gqUserData?.id,
    gqUserData?.name,
    gqUserData?.email,
    gqUserData?.roles,
    gqUserData?.createdAt,
    gqUserData?.lastSigninAt,
    gqUserData?.lastSignoutAt,
    gqUserData?.phone,
    gqUserData?.location?.latitude,
    gqUserData?.location?.longitude,
    gqUserData?.chains,
  ]);

  const [updateUserName, { isLoading: nameIsUpdating }] = useMutation(
    (mutation, { name }) => {
      return mutation.updateUserName({ name }).id;
    },
  );
  const [updateUserEmail, { isLoading: emailIsUpdating }] = useMutation(
    (mutation, { email }) => {
      return mutation.updateUserEmail({ email }).id;
    },
  );
  const [updateUserPassword, { isLoading: passwordIsUpdating }] = useMutation(
    (mutation, { currentPassword, password }) => {
      return mutation.updateUserPassword({ currentPassword, password }).id;
    },
  );
  const [updateUserPhone, { isLoading: phoneIsUpdating }] = useMutation(
    (mutation, { phone }) => {
      return mutation.updateUserPhone({ phone }).id;
    },
  );
  const [updateUserLocation, { isLoading: locationIsUpdating }] = useMutation(
    (mutation, { location }) => {
      return mutation.updateUserLocation({ location }).id;
    },
  );
  const [updateUserRoles, { isLoading: rolesIsUpdating }] = useMutation(
    (mutation, { roles }) => {
      return mutation.updateUserRoles({ roles }).id;
    },
  );
  const [addUserChain, { isLoading: addUserChainIsUpdating }] = useMutation(
    (mutation, { chainId, publicKey }) => {
      return mutation.addUserChain({ chainId, publicKey }).id;
    },
  );
  const [removeUserChain, { isLoading: removeUserChainIsUpdating }] =
    useMutation((mutation, { chainId }) => {
      return mutation.removeUserChain({ chainId }).id;
    });
  const [refreshUserChains, { isLoading: refreshUserChainsIsUpdating }] =
    useMutation((mutation, { chainIdList }) => {
      return mutation.refreshUserChains({ chainIdList }).id;
    });

  const [
    requestAccountNumberAndSequence,
    { isLoading: requestAccountNumberAndSequenceIsUpdating },
  ] = useMutation((mutation, { chainId, senderAddress }) => {
    return mutation.requestAccountNumberAndSequence({
      chainId,
      senderAddress,
    }).json as { sequence: number; accountNumber: number };
  });
  const [
    broadcastChainSignedTransaction,
    { isLoading: broadcastChainSignedTransactionIsUpdating },
  ] = useMutation((mutation, { chainId, signedTransactionBase64 }) => {
    return mutation.broadcastChainSignedTransaction({
      chainId,
      signedTransactionBase64,
    }).json as { transactionHash: string };
  });

  const isUpdating = useMemo(() => {
    return rolesIsUpdating |
      nameIsUpdating |
      phoneIsUpdating |
      emailIsUpdating |
      passwordIsUpdating |
      locationIsUpdating |
      addUserChainIsUpdating |
      removeUserChainIsUpdating |
      requestAccountNumberAndSequenceIsUpdating |
      broadcastChainSignedTransactionIsUpdating |
      refreshUserChainsIsUpdating
      ? true
      : false;
  }, [
    rolesIsUpdating,
    nameIsUpdating,
    emailIsUpdating,
    passwordIsUpdating,
    phoneIsUpdating,
    locationIsUpdating,
    addUserChainIsUpdating,
    removeUserChainIsUpdating,
    requestAccountNumberAndSequenceIsUpdating,
    broadcastChainSignedTransactionIsUpdating,
    refreshUserChainsIsUpdating,
  ]);
  const refetch = useCallback(async () => {
    const refetches = [];
    refetches.push(gqRefetch(gqUserData));
    await Promise.all(refetches);
  }, [gqRefetch, gqUserData]);
  const value = useMemo(() => {
    debug('rememo UserDataContext.value', { user });
    return {
      user,
      updateUserRoles,
      updateUserName,
      updateUserEmail,
      updateUserPassword,
      updateUserPhone,
      updateUserLocation,
      addUserChain,
      removeUserChain,
      refreshUserChains,

      requestAccountNumberAndSequence,
      broadcastChainSignedTransaction,

      refetch,
      isUpdating,
    };
  }, [
    user,
    updateUserRoles,
    updateUserName,
    updateUserEmail,
    updateUserPassword,
    updateUserPhone,
    updateUserLocation,
    addUserChain,
    removeUserChain,
    refreshUserChains,

    requestAccountNumberAndSequence,
    broadcastChainSignedTransaction,

    refetch,
    isUpdating,
  ]);

  debug('render: UserDataContext', value);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
export const useData = (): {
  refetch: () => Promise<void>;
  updateUserName: ({ args: { name: string } }) => Promise<{ id: string }>;
  updateUserEmail: ({ args: { email: string } }) => Promise<{ id: string }>;
  updateUserPhone: ({ args: { phone: string } }) => Promise<{ id: string }>;
  updateUserPassword: ({
    args: { currentPassword: string, password: string },
  }) => Promise<{ id: string }>;
  updateUserLocation: ({
    args: {
      location: { latitude: number, longitude: number },
    },
  }) => Promise<{ id: string }>;
  updateUserRoles: ({ args: { roles: string } }) => Promise<{ id: string }>;
  addUserChain: ({
    args: { chainId: string, publicKey: string },
  }) => Promise<{ id: string }>;
  removeUserChain: ({
    args: { chainId: string, publicKey: string },
  }) => Promise<{ id: string }>;
  refreshUserChains: ({
    args: {
      chainIdList: [string],
    },
  }) => Promise<{ id: string }>;
  requestAccountNumberAndSequence: ({
    args: { chainId: string, senderAddress: string },
  }) => Promise<{ sequence: number; accountNumber: number }>;
  broadcastChainSignedTransaction: ({
    args: { chainId: string, signedTransactionBase64: string },
  }) => Promise<{ transactionHash: string }>;

  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    lastSigninAt: Date;
    lastSignoutAt: Date;
    name: string;
    email: string;
    phone: string;
    roles: [string];
    location: { latitude: number; longitude: number };
    image: string;
    chains: [
      {
        id: string;
        chainId: string;
        publicKey: string;
        lastCheckAt: Date;
        lastBalance: number;
      },
    ];
  };
  isUpdating: boolean;
} => useContext(DataContext);
