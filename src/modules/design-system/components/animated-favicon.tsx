'use client'

import { useEffect, useState } from 'react'

const AnimatedFavicon = () => {
  const [isActive, setIsActive] = useState(true)
  const [animationFrame, setAnimationFrame] = useState(0)
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden)
      if (!document.hidden) {
        setAnimationFrame(0)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (isActive && animationFrame < 3) {
      const timer = setTimeout(() => {
        setAnimationFrame((prev) => prev + 1)
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [isActive, animationFrame])

  useEffect(() => {
    if (!mounted) return

    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (favicon) {
      if (!isActive) {
        favicon.href = '/images/icon-idle.png'
      } else {
        switch (animationFrame) {
          case 0:
            favicon.href = isDark ? '/images/icon-dark-frame-1.png' : '/images/icon-frame-1.png'
            break
          case 1:
            favicon.href = isDark ? '/images/icon-dark-frame-2.png' : '/images/icon-frame-2.png'
            break
          default:
            favicon.href = isDark ? '/images/icon-dark.png' : '/images/icon.png'
        }
      }
    }
  }, [isActive, animationFrame, isDark, mounted])

  if (!mounted) return null

  return null
}

export { AnimatedFavicon }
