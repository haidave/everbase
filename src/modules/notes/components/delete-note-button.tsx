'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckIcon, Loader2Icon, TrashIcon, XIcon } from 'lucide-react'

import { Button } from '@/modules/design-system/components/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/modules/design-system/components/tooltip'
import { deleteNote } from '@/modules/notes/lib/actions'

import { QUERY_KEYS } from '../lib/const'

interface DeleteNoteButtonProps {
  noteId: string
}

export function DeleteNoteButton({ noteId }: DeleteNoteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const trashButtonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTES })
    },
  })

  const handleDelete = useCallback(() => {
    setShowConfirm(true)
    // Focus the confirm button after a short delay to ensure it's rendered
    setTimeout(() => confirmButtonRef.current?.focus(), 0)
  }, [])

  const confirmDelete = useCallback(() => {
    const formData = new FormData()
    formData.append('noteId', noteId)
    mutation.mutate(formData)
    setShowConfirm(false)
  }, [mutation, noteId])

  const cancelDelete = useCallback(() => {
    setShowConfirm(false)
    // Focus the trash button after a short delay to ensure the state has updated
    setTimeout(() => trashButtonRef.current?.focus(), 0)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'd' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !showConfirm &&
        !document.querySelector('[data-edit-dialog]')
      ) {
        event.preventDefault()
        event.stopPropagation()
        handleDelete()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleDelete, showConfirm])

  return (
    <>
      {mutation.isPending ? (
        <Button variant="ghost" size="icon" aria-label="Deleting note...">
          <Loader2Icon className="size-4 animate-spin text-green-500" />
        </Button>
      ) : !showConfirm ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={mutation.isPending}
                ref={trashButtonRef}
                aria-label="Delete note"
              >
                <TrashIcon className="size-4" />
              </Button>
            </TooltipTrigger>

            <TooltipContent side="bottom">
              <p className="flex items-center gap-1.5">
                Delete note{' '}
                <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                  D
                </kbd>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex gap-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={confirmDelete}
                  ref={confirmButtonRef}
                  aria-label="Confirm delete"
                >
                  <CheckIcon className="size-4 text-green-500" />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="bottom">
                <p>Confirm delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={cancelDelete} aria-label="Cancel delete">
                  <XIcon className="size-4 text-red-500" />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="bottom">
                <p>Cancel delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  )
}
