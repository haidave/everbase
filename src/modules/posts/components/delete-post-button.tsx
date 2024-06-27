'use client'

import { useTransition } from 'react'

import { Button } from '@/modules/design-system/components/button'
import { deletePost } from '@/modules/posts/lib/actions'

interface DeletePostButtonProps {
  postId: string
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    const formData = new FormData()
    formData.append('postId', postId)

    startTransition(async () => {
      try {
        await deletePost(formData)
        // Optionally, you can add some success handling here
      } catch (error) {
        // Handle any errors here
        console.error('Failed to delete post:', error)
      }
    })
  }

  return (
    <Button onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
