'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HelpCircleIcon, KeyboardIcon, LogOutIcon, UserIcon } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { handleSignOut } from '@/modules/auth/lib/actions'
import { Button } from '@/modules/design-system/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/design-system/components/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/modules/design-system/components/tooltip'

type SidebarFooterProps = {
  isCollapsed: boolean
}

const SidebarFooter = ({ isCollapsed }: SidebarFooterProps) => {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserEmail(user?.email ?? null)
    }

    void fetchUser()
  }, [supabase.auth])

  return (
    <motion.div
      layout="position"
      transition={{ duration: 0.15 }}
      className={cn(isCollapsed ? 'flex-col' : 'flex-row', 'mt-auto flex items-center gap-3 pt-8')}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size={isCollapsed ? 'sidebar' : 'icon'} className={cn(!isCollapsed && '', 'group')}>
            <HelpCircleIcon className="size-4 text-tertiary group-hover:text-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={isCollapsed ? 'right' : 'top'}>Help</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size={isCollapsed ? 'sidebar' : 'icon'} className={cn(!isCollapsed && '', 'group')}>
            <KeyboardIcon className="size-4 text-tertiary group-hover:text-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={isCollapsed ? 'right' : 'top'}>Keyboard shortcuts</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size={isCollapsed ? 'sidebar' : 'icon'}
                className={cn(
                  !isCollapsed && 'ml-auto',
                  "group [&[data-state='open']>svg]:text-primary [&[data-state='open']]:bg-primary"
                )}
              >
                <UserIcon className="size-4 text-tertiary group-hover:text-primary" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side={isCollapsed ? 'right' : 'top'}>User</TooltipContent>
        </Tooltip>
        <DropdownMenuContent side="right">
          {userEmail && <DropdownMenuLabel className="font-normal">{userEmail}</DropdownMenuLabel>}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <form action={handleSignOut} className="size-full">
              <button className="flex size-full items-center gap-2 px-2 py-1.5">
                <LogOutIcon className="size-3.5 text-tertiary transition-colors duration-150 group-hover:text-primary" />
                <span>Sign Out</span>
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}

export { SidebarFooter }
