import { HomeIcon, InboxIcon } from 'lucide-react'

import { ROUTES } from '@/config/routes'

import { SidebarNavigationLink } from './sidebar-navigation-link'

const SidebarNavigation = () => {
  return (
    <nav>
      <ul className="grid gap-2">
        <SidebarNavigationLink href={ROUTES.home} icon={<HomeIcon className="size-4" />} label="Home" />
        <SidebarNavigationLink href={ROUTES.inbox} icon={<InboxIcon className="size-4" />} label="Inbox" />
      </ul>
    </nav>
  )
}

export { SidebarNavigation }
