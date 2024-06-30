'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/modules/design-system/components/button'
import { addPost } from '@/modules/posts/lib/actions'

import { QUERY_KEYS } from '../lib/const'

export function NewPost() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POSTS })
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    mutation.mutate(formData)
    event.currentTarget.reset()
  }

  return (
    <div>
      <h2>Add Post</h2>
      <form onSubmit={handleSubmit}>
        <input name="content" className="border" />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Adding...' : 'Add Post'}
        </Button>
      </form>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </div>
  )
}
