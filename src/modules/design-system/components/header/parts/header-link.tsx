'use client'

import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { Link } from '../../link'

type HeaderLinkProps = {
  href: string
  label: string
}

const HeaderLink = ({ href, label }: HeaderLinkProps) => {
  const pathname = usePathname()

  const isActive = pathname.includes(href)

  return (
    <li
      className={cn(
        'text-sm transition-colors duration-150 hover:text-primary',
        isActive ? 'font-medium text-primary' : 'text-secondary'
      )}
    >
      <Link href={href}>{label}</Link>
    </li>
  )
}

export { HeaderLink }
