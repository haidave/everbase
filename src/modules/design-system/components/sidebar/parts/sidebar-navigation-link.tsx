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
        'flex cursor-pointer rounded-md text-sm font-medium',
        'ease transition-colors duration-150',
        isActive ? 'bg-primary' : 'hover:bg-primary-hover active:bg-primary-active'
      )}
    >
      <Link href={href} isExternal={isExternal} className="flex w-full items-center gap-2 px-4 py-2.5">
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  )
}

export { SidebarNavigationLink }
