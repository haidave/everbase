import { useEffect, useLayoutEffect, useState } from 'react'

export function getWindowDimensions(): { height: number; width: number } {
  if (typeof window !== 'undefined') {
    const width = document.documentElement.clientWidth || document.body.clientWidth

    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

    return {
      height,
      width,
    }
  }

  return {
    width: 0,
    height: 0,
  }
}

export function useResize() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const effect = typeof window === 'undefined' ? useEffect : useLayoutEffect

  effect(() => {
    const handleResize = () => setDimensions(getWindowDimensions())
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return dimensions
}
