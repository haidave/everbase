'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PanelLeftIcon } from 'lucide-react'

import { ROUTES } from '@/config/routes'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/modules/design-system/components/sheet'

import { Button } from './button'
import { SidebarFooter } from './sidebar/parts/sidebar-footer'
import { SidebarNavigation } from './sidebar/parts/sidebar-navigation'
import { TooltipProvider } from './tooltip'

const AppHeader = () => {
  const pathname = usePathname()
  const [isSheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    setSheetOpen(false)
  }, [pathname])

  const formattedPathname = useMemo(() => {
    if (!pathname) return ''

    return pathname
      .slice(1) // Remove the leading slash
      .split('-') // Split by hyphens
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join(' ') // Join with spaces
  }, [pathname])

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 h-10 border-b-[0.75px] border-line bg-transparent backdrop-blur-md lg:hidden">
        <nav className="flex size-full w-screen items-center px-4">
          <Sheet open={isSheetOpen} onOpenChange={(isOpen) => setSheetOpen(isOpen)}>
            <SheetTrigger asChild>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <PanelLeftIcon className="size-4 text-tertiary group-hover:text-primary" />
                </Button>
                <span className="text-2sm font-medium">{formattedPathname}</span>
              </div>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 rounded-r-lg px-4 py-2">
              <div className="flex h-full flex-col overflow-auto">
                <div className="flex items-center justify-between">
                  <Link href={ROUTES.home} className="rounded-md focus-visible:shadow-focus focus-visible:outline-0">
                    <span className="text-gradient font-logo text-base font-medium">everbase</span>
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <PanelLeftIcon className="size-4 text-tertiary group-hover:text-primary" />
                    </Button>
                  </SheetClose>
                </div>

                <SidebarNavigation />
                <SidebarFooter />
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </header>
    </TooltipProvider>
  )
}

export { AppHeader }
