'use client'

import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckIcon, Loader2Icon, TrashIcon, XIcon } from 'lucide-react'

import { Button } from '@/modules/design-system/components/button'
import { deleteNote } from '@/modules/notes/lib/actions'

import { QUERY_KEYS } from '../lib/const'

interface DeleteNoteButtonProps {
  noteId: string
}

export function DeleteNoteButton({ noteId }: DeleteNoteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const thrashButtonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTES })
    },
  })

  const handleDelete = () => {
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    const formData = new FormData()
    formData.append('noteId', noteId)
    mutation.mutate(formData)
    setShowConfirm(false)
  }

  const cancelDelete = () => {
    setShowConfirm(false)
  }

  useEffect(() => {
    if (showConfirm && confirmButtonRef.current) {
      confirmButtonRef.current.focus()
    } else if (!showConfirm && thrashButtonRef.current) {
      thrashButtonRef.current.focus()
    }
  }, [showConfirm])

  return (
    <div className="relative">
      {mutation.isPending ? (
        <Button variant="ghost" size="icon" aria-label="Delete note">
          <Loader2Icon className="size-4 animate-spin text-green-500" />
        </Button>
      ) : !showConfirm ? (
        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={mutation.isPending} ref={thrashButtonRef}>
          <TrashIcon className="size-4" />
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={confirmDelete}
            ref={confirmButtonRef}
            aria-label="Confirm delete"
          >
            <CheckIcon className="size-4 text-green-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={cancelDelete} aria-label="Cancel delete">
            <XIcon className="size-4 text-red-500" />
          </Button>
        </div>
      )}
    </div>
  )
}
