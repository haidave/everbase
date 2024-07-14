'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SquarePenIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'

import { Button } from '@/modules/design-system/components/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/modules/design-system/components/dialog'
import { Form, FormControl, FormField, FormItem } from '@/modules/design-system/components/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/modules/design-system/components/tooltip'
import { addNote } from '@/modules/notes/lib/actions'

import { QUERY_KEYS } from '../../lib/const'
import { addNoteSchema, type AddNoteSchemaType } from './validation'

export function AddNote() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<AddNoteSchemaType>({
    resolver: zodResolver(addNoteSchema),
  })

  const { control, handleSubmit, formState, watch, reset } = form
  const content = watch('content')

  const mutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTES })
      reset()
      setIsSaving(false)
      setIsOpen(false)
    },
    onError: () => {
      setIsSaving(false)
    },
  })

  const onSubmit = (data: AddNoteSchemaType) => {
    setIsSaving(true)
    const formData = new FormData()
    formData.append('content', data.content)
    mutation.mutate(formData)
  }

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'n' && !event.metaKey && !event.ctrlKey && !isOpen) {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isOpen])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      if (content && content.trim() !== '' && formState.isDirty) {
        void handleSubmit(onSubmit)()
      }
    }
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-7 bg-subtle" onClick={() => setIsOpen(true)}>
                <SquarePenIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="flex items-center gap-1.5">
                Create a note{' '}
                <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                  N
                </kbd>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent className="grid gap-2 sm:max-w-3xl">
          <DialogTitle className="sr-only">Create new note</DialogTitle>
          <DialogDescription className="sr-only">
            Click save to create a new note. Press escape to cancel.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="relative max-h-[75svh] pb-14">
              <FormField
                control={control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TextareaAutosize
                        autoFocus
                        placeholder="Type something..."
                        minRows={4}
                        className="textarea-scrollbar size-full max-h-[calc(75svh-4rem)] grow resize-none px-6 pt-3 font-mono focus:outline-none"
                        onKeyDown={handleKeyDown}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-end">
                {(content && content.trim() !== '' && formState.isDirty) || isSaving ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="shiny" type="submit" disabled={isSaving}>
                          {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1">
                            <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                              ⌘
                            </kbd>
                            <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                              Enter
                            </kbd>
                          </div>
                          to save note
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
