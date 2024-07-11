'use client'

import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { Link } from '../../link'

type SidebarNavigationLinkProps = {
  href: string
  icon: NonNullable<React.ReactNode>
  label: string
  isExternal?: boolean
  isButton?: boolean
}

const SidebarNavigationLink = ({ href, icon, label, isExternal }: SidebarNavigationLinkProps) => {
  const pathname = usePathname()

  const isActive = pathname === href

  return (
    <li
      className={cn(
        'group flex cursor-pointer rounded-md text-sm font-medium text-secondary',
        'ease transition-colors duration-150',
        isActive ? 'bg-primary text-primary' : 'hover:bg-primary-hover hover:text-primary active:bg-primary-active'
      )}
    >
      <Link
        href={href}
        isExternal={isExternal}
        className={cn(
          'flex w-full items-center gap-2 px-4 py-2',
          '[&>svg]:ease [&>svg]:text-secondary [&>svg]:transition-colors [&>svg]:duration-150',
          'group-hover:[&>svg]:text-primary'
        )}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  )
}

export { SidebarNavigationLink }
