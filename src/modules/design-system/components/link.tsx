import NextLink from 'next/link'

import { cn } from '@/lib/utils'

type LinkProps = {
  href: string
  isExternal?: boolean
  children: React.ReactNode
  className?: string
}

export const Link = ({ href, isExternal, children, className }: LinkProps) => {
  const target = isExternal ? '_blank' : undefined
  const rel = isExternal ? 'noopener noreferrer' : undefined

  return (
    <NextLink
      href={href}
      target={target}
      rel={rel}
      className={cn(
        'group relative inline-flex items-center',
        'focus-visible:shadow-focus focus-visible:outline-0',
        className
      )}
    >
      {children}
    </NextLink>
  )
}
