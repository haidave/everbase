import { useCallback, useEffect, useState } from 'react'

export const useColorScheme = () => {
  const [isDark, setIsDark] = useState(true)

  const handleColorSchemeChange = useCallback((e: MediaQueryListEvent) => setIsDark(e.matches), [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleColorSchemeChange)

    return () => mediaQuery.removeEventListener('change', handleColorSchemeChange)
  }, [handleColorSchemeChange])

  return isDark
}
