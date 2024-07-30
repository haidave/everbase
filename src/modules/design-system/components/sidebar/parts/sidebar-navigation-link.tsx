'use client'

import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/modules/design-system/components/tooltip'

import { Link } from '../../link'

type SidebarNavigationLinkProps = {
  href: string
  icon: NonNullable<React.ReactNode>
  label: string
  isExternal?: boolean
  isButton?: boolean
  isCollapsed?: boolean
}

const SidebarNavigationLink = ({ href, icon, label, isExternal, isCollapsed }: SidebarNavigationLinkProps) => {
  const pathname = usePathname()

  const isActive = pathname === href

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
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
}

export { SidebarNavigationLink }
