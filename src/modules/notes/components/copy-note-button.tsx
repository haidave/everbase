'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

import { copyToClipboard } from '@/lib/utils'
import { Button } from '@/modules/design-system/components/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/modules/design-system/components/tooltip'

type CopyNoteButtonProps = {
  content: string
}

const CopyNoteButton = ({ content }: CopyNoteButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isCopied) {
      const timeoutId = window.setTimeout(() => {
        setIsCopied(false)
      }, 2000)

      return () => {
        window.clearTimeout(timeoutId)
      }
    }
  }, [isCopied])

  const handleCopyToClipboard = useCallback(async () => {
    try {
      await copyToClipboard(content)
      setIsCopied(true)
    } catch (error) {
      console.error('Failed to copy content:', error)
    }
  }, [content])

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'c' && !event.metaKey && !event.ctrlKey && !isCopied) {
        event.preventDefault()
        event.stopPropagation()
        void handleCopyToClipboard()
        buttonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isCopied, handleCopyToClipboard])

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyToClipboard}
            ref={buttonRef}
            aria-label={isCopied ? 'Copied to clipboard' : 'Copy note'}
          >
            {isCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isCopied ? (
            <p>Copied!</p>
          ) : (
            <p className="flex items-center gap-1.5">
              Copy note{' '}
              <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                C
              </kbd>
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { CopyNoteButton }
