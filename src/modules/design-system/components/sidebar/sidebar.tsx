import { SidebarNavigation } from './parts/sidebar-navigation'
import { SidebarUser } from './parts/sidebar-user'

const Sidebar = () => {
  return (
    <aside className="sticky left-0 top-0 z-40 block h-svh xl:block">
      <div className="flex h-full w-60 flex-col overflow-auto p-4">
        <SidebarNavigation />

        <div className="mt-auto pt-8">
          <SidebarUser />
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
