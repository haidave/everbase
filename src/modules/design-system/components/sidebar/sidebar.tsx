'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSidebarStore } from '@/store/sidebar-store'
import { motion } from 'framer-motion'
import { PanelLeftIcon } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/modules/design-system/components/tooltip'

import { Button } from '../button'
import { SidebarFooter } from './parts/sidebar-footer'
import { SidebarNavigation } from './parts/sidebar-navigation'

const Sidebar = () => {
  const { isCollapsed, toggleCollapsed } = useSidebarStore()
  const [isMounted, setIsMounted] = useState(false)

  const toggleSidebar = useCallback(() => {
    toggleCollapsed()
  }, [toggleCollapsed])

  useHotkeys('[', toggleSidebar, { preventDefault: true }, [toggleSidebar])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <TooltipProvider>
      <motion.aside
        className="sticky left-0 top-0 z-40 hidden h-svh bg-app lg:block"
        initial={false}
        animate={{ width: isCollapsed ? '4rem' : '15rem' }}
        transition={{ duration: 0.15 }}
      >
        <div className={cn(isCollapsed ? 'px-2' : 'px-4', 'flex h-full flex-col overflow-hidden py-2')}>
          <div className={cn(isCollapsed ? 'justify-center' : 'justify-between', 'flex items-center')}>
            {(!isCollapsed || !isMounted) && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={ROUTES.home} className="rounded-md focus-visible:shadow-focus focus-visible:outline-0">
                  <span className="text-gradient font-logo text-base font-medium">everbase</span>
                </Link>
              </motion.div>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={isCollapsed ? 'sidebar' : 'icon'}
                  className={cn(!isCollapsed && 'ml-auto', 'group')}
                  onClick={toggleSidebar}
                >
                  <PanelLeftIcon className="size-4 text-tertiary group-hover:text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="flex items-center gap-1.5">
                  {isCollapsed ? 'Expand' : 'Collapse'} sidebar{' '}
                  <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover pl-0.5 pr-1 font-mono font-medium">
                    {'['}
                  </kbd>
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <SidebarNavigation isCollapsed={isCollapsed} />

          <SidebarFooter isCollapsed={isCollapsed} />
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}

export { Sidebar }
