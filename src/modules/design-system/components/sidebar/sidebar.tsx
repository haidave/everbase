import Link from 'next/link'
import { HelpCircleIcon, KeyboardIcon, PanelLeftIcon } from 'lucide-react'

import { ROUTES } from '@/config/routes'

import { Button } from '../button'
import { SidebarNavigation } from './parts/sidebar-navigation'
import { SidebarUser } from './parts/sidebar-user'

const Sidebar = () => {
  return (
    <aside className="sticky left-0 top-0 z-40 block h-svh bg-app xl:block">
      <div className="flex h-full w-60 flex-col overflow-auto p-4 pb-2">
        <div className="flex items-center justify-between">
          <Link href={ROUTES.home} className="rounded-md focus-visible:shadow-focus focus-visible:outline-0">
            <span className="text-gradient font-logo text-base font-medium">everbase</span>
          </Link>

          <Button variant="ghost" size="icon" className="group size-7">
            <PanelLeftIcon className="size-4 text-tertiary group-hover:text-primary" />
          </Button>
        </div>

        <SidebarNavigation />

        <div className="mt-auto flex items-center justify-between pt-8">
          <div className="flex gap-3">
            <Button variant="ghost" size="icon" className="group size-7">
              <HelpCircleIcon className="size-4 text-tertiary group-hover:text-primary" />
            </Button>
            <Button variant="ghost" size="icon" className="group size-7">
              <KeyboardIcon className="size-4 text-tertiary group-hover:text-primary" />
            </Button>
          </div>

          <SidebarUser />
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
