import Link from 'next/link';
import { AppSidebar } from '@/components/app-sidebar';
import { AppLayout } from '@/components/app-layout';
import { SidebarProvider } from '@/components/ui/sidebar';

import { Button } from '@/components/ui/button';
import { SuggestChain } from '@/components/web3';
import { SelectChain } from '@/components/web3';
import { UserDataContextProvider } from '@/components/user';
import { Play, Settings, Link as LinkIcon, Coins } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { auth } from '@/server/auth';

export default async function Page() {
  const session = await auth();
  const hasSession = typeof session?.user?.name === 'string';
  if (!hasSession) {
    return null;
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar user={session.user} />
        <AppLayout>
          <div className="colspan-2">
            <Alert>
              <Play className="h-4 w-4" />
              <AlertTitle>
                0. First time user? Install the keplr wallet
              </AlertTitle>
              <AlertDescription>
                <p>
                  <Link href="https://keplr.app" target="_blank">
                    https://keplr.app
                  </Link>{' '}
                  or more specific:
                  <Link
                    href="https://chromewebstore.google.com/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap"
                    target="_blank"
                  >
                    Keplr.app chrome browser extension
                  </Link>
                  and setup a completely new wallet to avoid losing funds
                  playing here.
                </p>
                <p>
                  To ensure that no data is leaked, create a new browser
                  profile. That way you can repeat the setup process and wont
                  lose your normal data/bookmarks/browser-history.
                </p>
                <p>
                  You also need to repeat the <b>Add Custom Chain</b> action
                  when you use a user that has previously setup chains.
                </p>
              </AlertDescription>
            </Alert>
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertTitle>Suggest Chain</AlertTitle>
              <AlertDescription>
                <p>
                  {' '}
                  1. To add Custom chains to your keplr wallet, use the suggest
                  feature. This step is required to configure the custom
                  redwood-regen chain. Otherwise you wont be able to use
                  testnet-tokens.
                </p>
                <div className="flex flex-row justify-center gap-4">
                  <Button asChild>
                    <SuggestChain />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
            <Alert>
              <LinkIcon className="h-4 w-4" />
              <AlertTitle>Add Chain</AlertTitle>
              <AlertDescription>
                <p>
                  2. Configure your keplr wallet to receive the custom chain.
                  Add as many chains you want they are stored with the signed-in
                  user.
                </p>
                <div className="flex flex-row justify-center gap-4">
                  <Button asChild>
                    <UserDataContextProvider>
                      <SelectChain showSummary={true} />
                    </UserDataContextProvider>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
            <Alert>
              <Coins className="h-4 w-4" />
              <AlertTitle>Receive Tokens</AlertTitle>
              <AlertDescription>
                <p>
                  Some functionality is only visible when your wallet is
                  populated with tokens. Depending on the selected chains, the
                  command to receive testnet-tokens varies.
                </p>
                <pre className="text-sm text-muted-foreground mb-8">
                  {`# curl -X POST \\\n    -d '{"address": "YOUR_REGEN_ADDRESS"}' \\\n    http://redwood.regen.network:8000`}
                </pre>
              </AlertDescription>
            </Alert>
          </div>
        </AppLayout>
      </SidebarProvider>
    </>
  );
}
