'use client'

import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from './button'

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (theme === 'dark') {
    return (
      <Button onClick={() => setTheme('light')} variant="ghost" size="icon" aria-label="Set light mode" type="button">
        <SunIcon className="size-4 stroke-[1.5]" />
      </Button>
    )
  }

  if (theme === 'light') {
    return (
      <Button onClick={() => setTheme('dark')} variant="ghost" size="icon" aria-label="Set dark mode" type="button">
        <MoonIcon className="size-4 stroke-[1.5]" />
      </Button>
    )
  }
}

export { ThemeSwitcher }
