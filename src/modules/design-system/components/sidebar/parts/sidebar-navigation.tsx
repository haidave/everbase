import { CalendarIcon, FolderCodeIcon, GiftIcon, InboxIcon, LayoutDashboardIcon, ListTodoIcon } from 'lucide-react'

import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'

import { SidebarNavigationLink } from './sidebar-navigation-link'

type SidebarNavigationProps = {
  isCollapsed?: boolean
}

const NAVIGATION_ITEMS = [
  {
    href: ROUTES.dashboard,
    icon: <LayoutDashboardIcon className="size-4" />,
    label: 'Dashboard',
    shortcut: '1',
  },
  {
    href: ROUTES.inbox,
    icon: <InboxIcon className="size-4" />,
    label: 'Inbox',
    shortcut: '2',
  },
  {
    href: ROUTES.tasks,
    icon: <ListTodoIcon className="size-4" />,
    label: 'Tasks',
    shortcut: '3',
  },
  {
    href: ROUTES.projects,
    icon: <FolderCodeIcon className="size-4" />,
    label: 'Projects',
    shortcut: '4',
  },
  {
    href: ROUTES.calendar,
    icon: <CalendarIcon className="size-4" />,
    label: 'Calendar',
    shortcut: '5',
  },
  {
    href: ROUTES.wishlist,
    icon: <GiftIcon className="size-4" />,
    label: 'Wishlist',
    shortcut: '6',
  },
]

const SidebarNavigation = ({ isCollapsed }: SidebarNavigationProps) => {
  return (
    <nav className={cn(isCollapsed ? 'mt-3' : 'mt-4')}>
      <ul className="grid gap-3">
        {NAVIGATION_ITEMS.map((item, index) => (
          <SidebarNavigationLink
            key={index}
            href={item.href}
            icon={item.icon}
            label={item.label}
            shortcut={item.shortcut}
            isCollapsed={isCollapsed}
          />
        ))}
      </ul>
    </nav>
  )
}

export { SidebarNavigation }
