'use client'

import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SquarePenIcon } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'

import { Button } from '@/modules/design-system/components/button'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/modules/design-system/components/dialog'
import { addPost } from '@/modules/posts/lib/actions'

import { QUERY_KEYS } from '../lib/const'

export function AddPost() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleFormClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'n' && !event.metaKey && !event.ctrlKey && !isOpen) {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7 bg-subtle">
            <SquarePenIcon className="size-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="grid gap-2 sm:max-w-3xl">
          <form onSubmit={handleSubmit} className="relative max-h-[75svh] pb-14" onClick={handleFormClick}>
            <TextareaAutosize
              ref={textareaRef}
              placeholder="Type something..."
              name="content"
              minRows={4}
              className="size-full max-h-[calc(75svh-4rem)] grow resize-none focus:outline-none"
            />

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button variant="shiny" type="submit" disabled={mutation.isPending}>
                Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
