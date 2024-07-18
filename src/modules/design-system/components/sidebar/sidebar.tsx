import Link from 'next/link'

import { ROUTES } from '@/config/routes'
import { AddNote } from '@/modules/notes/components/add-note'

import { SidebarNavigation } from './parts/sidebar-navigation'
import { SidebarUser } from './parts/sidebar-user'

const Sidebar = () => {
  return (
    <aside className="sticky left-0 top-0 z-40 block h-svh bg-app xl:block">
      <div className="flex h-full w-60 flex-col overflow-auto p-4">
        <div className="flex items-center justify-between">
          <Link href={ROUTES.home}>
            <span className="text-gradient font-logo text-base font-medium">everbase</span>
          </Link>

          <AddNote />
        </div>

        <SidebarNavigation />

        <div className="mt-auto pt-8">
          <SidebarUser />
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
