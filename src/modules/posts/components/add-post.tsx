'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/modules/design-system/components/button'
import { addPost } from '@/modules/posts/lib/actions'

import { QUERY_KEYS } from '../lib/const'

export function AddPost() {
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
      <form onSubmit={handleSubmit}>
        <textarea name="content" className="w-full border focus:outline-none" />
        <Button variant="ghost" size="icon" type="submit" disabled={mutation.isPending}>
          <PlusIcon className="size-4" />
        </Button>
      </form>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </div>
  )
}
