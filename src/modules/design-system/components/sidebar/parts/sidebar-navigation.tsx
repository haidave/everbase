import { InboxIcon } from 'lucide-react'

import { ROUTES } from '@/config/routes'

import { SidebarNavigationLink } from './sidebar-navigation-link'

const SidebarNavigation = () => {
  return (
    <nav className="mt-3">
      <ul className="grid gap-2">
        <SidebarNavigationLink href={ROUTES.inbox} icon={<InboxIcon className="size-4" />} label="Inbox" />
      </ul>
    </nav>
  )
}

export { SidebarNavigation }
