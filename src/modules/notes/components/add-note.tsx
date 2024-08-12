'use client'

import { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'

import { scrollMainToTop } from '@/lib/utils'
import { Button } from '@/modules/design-system/components/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/modules/design-system/components/dialog'
import { Form, FormControl, FormField, FormItem } from '@/modules/design-system/components/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/modules/design-system/components/tooltip'
import { addNote } from '@/modules/notes/lib/actions'

import { QUERY_KEYS } from '../lib/const'
import { noteSchema, type NoteSchemaType } from '../lib/validation'
import { RichTextEditor } from './rich-text-editor'

export function AddNote() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<NoteSchemaType>({
    resolver: zodResolver(noteSchema),
  })

  const { control, handleSubmit, reset } = form

  const mutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTES })
      reset()
      setIsSaving(false)
      setIsOpen(false)
      setTimeout(() => {
        scrollMainToTop()
      }, 300)
    },
    onError: () => {
      setIsSaving(false)
    },
  })

  const onSubmit = (data: NoteSchemaType) => {
    if (data.content && data.content.trim() !== '') {
      setIsSaving(true)
      const formData = new FormData()
      formData.append('content', data.content)
      mutation.mutate(formData)
    }
  }

  useHotkeys(
    'n',
    () => {
      if (!isOpen && !document.querySelector('[role="dialog"]')) {
        setIsOpen(true)
      }
    },
    {
      enabled: !isOpen,
      preventDefault: true,
    }
  )

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        reset()
      }
    },
    [reset]
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" className="size-12 rounded-full" onClick={() => setIsOpen(true)}>
              <PlusIcon className="size-6" />
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

      <DialogContent className="grid gap-2 focus:outline-none max-md:top-1/4 max-md:-translate-y-1/4 sm:max-w-3xl md:px-8">
        <DialogTitle className="sr-only">Create new note</DialogTitle>
        <DialogDescription className="sr-only">
          Click save to create a new note. Press escape to cancel.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="relative max-h-[75svh]">
            <FormField
              control={control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextEditor
                      isPending={isSaving}
                      handleOnSubmit={() => {
                        void handleSubmit(onSubmit)()
                      }}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
