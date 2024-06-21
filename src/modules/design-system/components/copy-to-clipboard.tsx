'use client'

import { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

import { copyToClipboard } from '@/lib/utils'

import { Button } from './button'

interface CopyToClipboardProps {
  value: string
}

export const CopyToClipboard = ({ value }: CopyToClipboardProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyToClipboard = async () => {
    await copyToClipboard(value)
    setIsCopied(true)

    window.setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <div className="relative grid items-center justify-center">
      <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} className="group relative">
        {isCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
        <div className="absolute -bottom-1.5 left-1/2 z-10 hidden -translate-x-1/2 translate-y-full rounded-lg bg-primary px-1.5 py-0.5 text-xs text-primary group-hover:block">
          {isCopied ? 'Copied!' : 'Copy'}
        </div>
      </Button>
    </div>
  )
}
