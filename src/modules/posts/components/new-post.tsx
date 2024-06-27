'use client'

import { useTransition } from 'react'

import { Button } from '@/modules/design-system/components/button'
import { addPost } from '@/modules/posts/lib/actions'

export function NewPost() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      try {
        await addPost(formData)
        // Optionally clear the input or show a success message
        event.currentTarget.reset()
      } catch (error) {
        console.error('Failed to add post:', error)
        // Optionally show an error message to the user
      }
    })
  }

  return (
    <div>
      <h2>Add Post</h2>
      <form onSubmit={handleSubmit}>
        <input name="content" className="border" />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Adding...' : 'Add Post'}
        </Button>
      </form>
    </div>
  )
}
