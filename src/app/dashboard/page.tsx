import { AppSidebar } from '@/components/app-sidebar';
import { AppLayout } from '@/components/app-layout';
import { SidebarProvider } from '@/components/ui/sidebar';

import { UserDataContextProvider } from '@/components/user';
import { SetupLanding } from '@/components/setup';
import { UserChains, UserChainActions } from '@/components/user';
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
          <UserDataContextProvider>
            <div className="col-span-2 grid grid-rows">
              <div>
                <SetupLanding />
              </div>
              <div>
                <UserChains />
              </div>
              <div>
                <UserChainActions />
              </div>
            </div>
          </UserDataContextProvider>
        </AppLayout>
      </SidebarProvider>
    </>
  );
}
