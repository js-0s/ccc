'use client';
import Link from 'next/link';
import { useData as useUserData } from '@/components/user/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
export function SetupLanding() {
  const { user } = useUserData();
  if (user.chains.length) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Setup Done</AlertTitle>
        <AlertDescription>
          {user.chains.length} Chains configured.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Setup Required</AlertTitle>
        <AlertDescription>
          <p>You need to setup at least one chain</p>
          <Link href="/setup">
            <Button>Setup</Button>
          </Link>
        </AlertDescription>
      </Alert>
    </>
  );
}
