'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'

import { Button } from '@/modules/design-system/components/button'
import { deleteNote } from '@/modules/notes/lib/actions'

import { QUERY_KEYS } from '../lib/const'

interface DeleteNoteButtonProps {
  noteId: string
}

function ConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="rounded bg-primary p-4">
        <p>Are you sure you want to delete this note?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  )
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

  const handleDelete = () => {
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    setShowConfirm(false)
    const formData = new FormData()
    formData.append('noteId', noteId)
    mutation.mutate(formData)
  }

  const cancelDelete = () => {
    setShowConfirm(false)
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={handleDelete} disabled={mutation.isPending}>
        <Trash2Icon className="size-4" />
      </Button>
      {showConfirm && <ConfirmModal onConfirm={confirmDelete} onCancel={cancelDelete} />}
    </>
  )
}
