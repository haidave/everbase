'use client'

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'

import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/modules/design-system/components/tooltip'

import { Link } from '../../link'

type SidebarNavigationLinkProps = {
  href: string
  icon: NonNullable<React.ReactNode>
  label: string
  shortcut: string
  isExternal?: boolean
  isButton?: boolean
  isCollapsed?: boolean
}

const SidebarNavigationLink = ({
  href,
  icon,
  shortcut,
  label,
  isExternal,
  isCollapsed,
}: SidebarNavigationLinkProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const isActive = pathname === href

  const handleNavigation = useCallback(
    (href: string) => {
      void router.push(href)
    },
    [router]
  )

  useHotkeys(shortcut, () => handleNavigation(href), { enabled: !isActive, preventDefault: true })

  const linkContent = (
    <li
      className={cn(
        isCollapsed ? 'w-9 justify-self-center' : 'w-full',
        'group flex cursor-pointer rounded-md text-sm font-medium text-secondary',
        'ease transition-all duration-150',
        isActive ? 'bg-primary text-primary' : 'hover:bg-primary-hover hover:text-primary active:bg-primary-active'
      )}
    >
      <Link
        href={href}
        isExternal={isExternal}
        className={cn(
          isCollapsed ? 'justify-center' : 'justify-start gap-2 px-4',
          'flex w-full items-center py-2',
          '[&>svg]:ease [&>svg]:text-secondary [&>svg]:transition-colors [&>svg]:duration-150',
          'group-hover:[&>svg]:text-primary',
          'rounded-md focus-visible:shadow-focus focus-visible:outline-0'
        )}
      >
        <span className="shrink-0">{icon}</span>
        {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
      </Link>
    </li>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right">
          <div className="flex items-center justify-between gap-2">
            <span>{label}</span>
            <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
              {shortcut}
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
}

export { SidebarNavigationLink }
