import { InboxIcon } from 'lucide-react'

import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'

import { SidebarNavigationLink } from './sidebar-navigation-link'

type SidebarNavigationProps = {
  isCollapsed?: boolean
}

const SidebarNavigation = ({ isCollapsed }: SidebarNavigationProps) => {
  return (
    <nav className={cn(isCollapsed ? 'mt-3' : 'mt-4')}>
      <ul className="grid gap-3">
        <SidebarNavigationLink
          href={ROUTES.inbox}
          icon={<InboxIcon className="size-4" />}
          label="Inbox"
          isCollapsed={isCollapsed}
        />
      </ul>
    </nav>
  )
}

export { SidebarNavigation }
