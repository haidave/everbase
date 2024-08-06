'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { useColorScheme } from '@/hooks/use-color-scheme'

// Define constants
const ANIMATION_DURATION = 200

// Define enums for better readability
enum AnimationFrame {
  Frame1,
  Frame2,
  Final,
}

// Define favicon URLs
const faviconUrls = {
  idle: '/images/icon-idle.png',
  dark: {
    [AnimationFrame.Frame1]: '/images/icon-dark-frame-1.png',
    [AnimationFrame.Frame2]: '/images/icon-dark-frame-2.png',
    [AnimationFrame.Final]: '/images/icon-dark.png',
  },
  light: {
    [AnimationFrame.Frame1]: '/images/icon-frame-1.png',
    [AnimationFrame.Frame2]: '/images/icon-frame-2.png',
    [AnimationFrame.Final]: '/images/icon.png',
  },
}

/**
 * AnimatedFavicon Component
 *
 * This component manages an animated favicon that changes based on tab activity
 * and the user's color scheme preference (light/dark mode).
 */
const AnimatedFavicon = () => {
  const [isActive, setIsActive] = useState(true)
  const [animationFrame, setAnimationFrame] = useState(AnimationFrame.Frame1)
  const [mounted, setMounted] = useState(false)
  const isDark = useColorScheme()

  // Handle tab visibility changes
  const handleVisibilityChange = useCallback(() => {
    setIsActive(!document.hidden)
    if (!document.hidden) {
      setAnimationFrame(AnimationFrame.Frame1)
    }
  }, [])

  // Set up event listeners
  useEffect(() => {
    setMounted(true)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [handleVisibilityChange])

  // Manage animation frames
  useEffect(() => {
    if (isActive && animationFrame !== AnimationFrame.Final) {
      const timer = setTimeout(() => {
        setAnimationFrame((prev) => {
          if (prev === AnimationFrame.Frame1) return AnimationFrame.Frame2
          if (prev === AnimationFrame.Frame2) return AnimationFrame.Final
          return AnimationFrame.Final
        })
      }, ANIMATION_DURATION)

      return () => clearTimeout(timer)
    }
  }, [isActive, animationFrame])

  // Determine current favicon URL
  const currentFaviconUrl = useMemo(() => {
    if (!isActive) return faviconUrls.idle
    const scheme = isDark ? 'dark' : 'light'
    return faviconUrls[scheme][animationFrame]
  }, [isActive, isDark, animationFrame])

  // Update favicon
  useEffect(() => {
    if (!mounted) return

    const favicon = document.querySelector('link[rel="icon"]')
    if (favicon && favicon instanceof HTMLLinkElement) {
      favicon.href = currentFaviconUrl
    }
  }, [currentFaviconUrl, mounted])

  if (!mounted) return null

  return null
}

export { AnimatedFavicon }
