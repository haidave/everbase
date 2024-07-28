import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SidebarState = {
  isCollapsed: boolean
  toggleCollapsed: () => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    }),
    {
      name: 'sidebar-state',
    }
  )
)
