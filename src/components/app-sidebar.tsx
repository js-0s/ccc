'use client';

import { useMemo, type ComponentProps } from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import { LayoutDashboard, House, Settings } from 'lucide-react';
export function AppSidebar({
  user,
  ...props
}: {
  user:
    | { name: string; email: string; avatar: string; roles: [string] }
    | undefined;
  props: ComponentProps<typeof Sidebar>;
}) {
  const data = useMemo(() => {
    let dataUser: { name: string; email: string; avatar: string } = undefined;
    if (user)
      dataUser = {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };

    const items = [];
    items.push({
      title: 'CCC',
      url: '/',
      icon: House,
    });
    items.push({
      title: 'Dashboard',
      url: '/dashboard/',
      icon: LayoutDashboard,
    });
    items.push({
      title: 'Setup',
      url: `/setup`,
      icon: Settings,
    });

    return {
      user: dataUser,
      navMain: items,
    };
  }, [user]);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
