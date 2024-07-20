'use client'

import { useEffect, useState } from 'react'
import { PencilIcon } from 'lucide-react'

import { type Note } from '@/modules/api/types'
import { Button } from '@/modules/design-system/components/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/modules/design-system/components/tooltip'

import { EditNote } from './edit-note'

interface EditNoteButtonProps {
  note: Note
}

export function EditNoteButton({ note }: EditNoteButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'e' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !isOpen &&
        !document.querySelector('[data-edit-dialog]')
      ) {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isOpen, setIsOpen])

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
              <PencilIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="flex items-center gap-1.5">
              Edit note{' '}
              <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                E
              </kbd>
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isOpen && <EditNote isOpen={isOpen} setIsOpen={setIsOpen} initialNote={note} />}
    </>
  )
}
