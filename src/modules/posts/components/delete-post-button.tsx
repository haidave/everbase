'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/modules/design-system/components/button'
import { deletePost } from '@/modules/posts/lib/actions'

import { QUERY_KEYS } from '../lib/const'

interface DeletePostButtonProps {
  postId: string
}

function ConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="rounded bg-primary p-4">
        <p>Are you sure you want to delete this post?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  )
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POSTS })
    },
  })

  const handleDelete = () => {
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    setShowConfirm(false)
    const formData = new FormData()
    formData.append('postId', postId)
    mutation.mutate(formData)
  }

  const cancelDelete = () => {
    setShowConfirm(false)
  }

  return (
    <>
      <Button onClick={handleDelete} disabled={mutation.isPending}>
        {mutation.isPending ? 'Deleting...' : 'Delete'}
      </Button>
      {showConfirm && <ConfirmModal onConfirm={confirmDelete} onCancel={cancelDelete} />}
    </>
  )
}
