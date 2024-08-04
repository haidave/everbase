import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    console.error('Failed to copy to clipboard')
  }
}

const scrollMainToTop = () => {
  // Try to find the main element first
  const mainElement = document.querySelector('main')

  if (mainElement) {
    // If main element exists and is scrollable, scroll it
    if (mainElement.scrollHeight > mainElement.clientHeight) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
  }

  // Fallback: scroll the entire page because of mobile version
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export { cn, copyToClipboard, scrollMainToTop }
