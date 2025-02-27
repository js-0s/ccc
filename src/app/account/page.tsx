import { AppSidebar } from '@/components/app-sidebar';
import { AppLayout } from '@/components/app-layout';
import { SidebarProvider } from '@/components/ui/sidebar';

import { UserContent, UserDataContextProvider } from '@/components/user';
import { auth } from '@/server/auth';
export default async function Page() {
  const session = await auth();
  return (
    <>
      <UserDataContextProvider path={[{ type: 'account', label: 'Account' }]}>
        <SidebarProvider>
          <AppSidebar user={session?.user} />
          <AppLayout>
            <UserContent />
          </AppLayout>
        </SidebarProvider>
      </UserDataContextProvider>
    </>
  );
}
