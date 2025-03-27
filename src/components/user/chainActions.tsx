'use client';
import { useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { SelectChain } from '@/components/web3';
import { useData as useUserData } from './data';

export function UserChainActions() {
  const { user, refreshUserChains, refetch, isUpdating } = useUserData();
  const refreshDisabled = useMemo(
    () => user.chains.length === 0 || isUpdating,
    [user, isUpdating],
  );
  const refresh = useCallback(async () => {
    await refreshUserChains({ args: { chainIdList: [] } });
    await refetch();
  }, [refreshUserChains, refetch]);

  return (
    <>
      <Button disabled={refreshDisabled} onClick={refresh}>
        Refresh Balances
      </Button>
      <SelectChain disabled={isUpdating} actionLabel={'Add More Chains'} />
    </>
  );
}
