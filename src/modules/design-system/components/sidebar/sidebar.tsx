import Link from 'next/link'

import { ROUTES } from '@/config/routes'

import { SidebarNavigation } from './parts/sidebar-navigation'
import { SidebarUser } from './parts/sidebar-user'

const Sidebar = () => {
  return (
    <aside className="sticky left-0 top-0 z-40 block h-svh xl:block">
      <div className="flex h-full w-60 flex-col overflow-auto px-4 py-2">
        <Link href={ROUTES.home}>
          <span className="text-gradient font-logo text-base font-medium">everbase</span>
        </Link>

        <SidebarNavigation />

        <div className="mt-auto pt-8">
          <SidebarUser />
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
