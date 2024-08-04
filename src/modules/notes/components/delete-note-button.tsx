'use client'

import { useCallback, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckIcon, Loader2Icon, TrashIcon, XIcon } from 'lucide-react'

import { Button } from '@/modules/design-system/components/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/modules/design-system/components/tooltip'
import { deleteNote } from '@/modules/notes/lib/actions'

import { QUERY_KEYS } from '../lib/const'

interface DeleteNoteButtonProps {
  noteId: string
}

export function DeleteNoteButton({ noteId }: DeleteNoteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTES })
    },
  })

  const handleDelete = useCallback(() => {
    setShowConfirm(true)
  }, [])

  const confirmDelete = useCallback(() => {
    const formData = new FormData()
    formData.append('noteId', noteId)
    mutation.mutate(formData)
    setShowConfirm(false)
  }, [mutation, noteId])

  const cancelDelete = useCallback(() => {
    setShowConfirm(false)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'd' && !event.metaKey && !event.ctrlKey && !document.querySelector('[data-edit-dialog]')) {
        event.preventDefault()
        event.stopPropagation()

        if (!showConfirm) {
          handleDelete()
        } else {
          confirmDelete()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleDelete, confirmDelete, showConfirm])

  return (
    <>
      {mutation.isPending ? (
        <Button variant="ghost" size="icon" aria-label="Deleting note...">
          <Loader2Icon className="size-4 animate-spin text-green-500" />
        </Button>
      ) : !showConfirm ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={mutation.isPending}
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
      ) : (
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={confirmDelete} aria-label="Confirm delete">
                <CheckIcon className="size-4 text-green-500" />
              </Button>
            </TooltipTrigger>

            <TooltipContent side="bottom">
              <p className="flex items-center gap-1.5">
                Confirm delete{' '}
                <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                  D
                </kbd>
              </p>
            </TooltipContent>
          </Tooltip>
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
        </div>
      )}
    </>
  )
}
