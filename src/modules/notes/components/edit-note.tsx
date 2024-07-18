import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'

import { type Note } from '@/modules/api/types'
import { Button } from '@/modules/design-system/components/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/modules/design-system/components/dialog'
import { Form, FormControl, FormField, FormItem } from '@/modules/design-system/components/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/modules/design-system/components/tooltip'
import { getNote, updateNote } from '@/modules/notes/lib/actions'

import { QUERY_KEYS } from '../lib/const'
import { noteSchema, type NoteSchemaType } from '../lib/validation'

interface EditNoteProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  initialNote: Note
}

export function EditNote({ isOpen, setIsOpen, initialNote }: EditNoteProps) {
  const queryClient = useQueryClient()

  const { data: note } = useQuery({
    queryKey: QUERY_KEYS.NOTE(initialNote.id),
    queryFn: () => getNote(initialNote.id),
    initialData: initialNote,
  })

  const form = useForm<NoteSchemaType>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: note.content,
    },
  })

  const { control, handleSubmit, watch, reset } = form
  const content = watch('content')

  useEffect(() => {
    reset({ content: note.content })
  }, [note, reset])

  const mutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTES })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTE(note.id) })
      setIsOpen(false)
    },
  })

  const onSubmit = (data: NoteSchemaType) => {
    if (data.content && data.content.trim() !== '') {
      const formData = new FormData()
      formData.append('noteId', note.id)
      formData.append('content', data.content)
      mutation.mutate(formData)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset({ content: note.content })
    }
    setIsOpen(open)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      void handleSubmit(onSubmit)()
    }
  }

  const showUpdateButton = content && content.trim() !== '' && content !== note.content

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="grid gap-2 sm:max-w-3xl">
        <DialogTitle className="sr-only">Edit note</DialogTitle>
        <DialogDescription className="sr-only">Click update to save changes. Press escape to cancel.</DialogDescription>
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
                      className="textarea-scrollbar size-full max-h-[calc(75svh-4rem)] grow resize-none bg-base px-6 pt-3 font-mono leading-relaxed focus:outline-none"
                      onKeyDown={handleKeyDown}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-end">
              {showUpdateButton && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="shiny" type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Updating...' : 'Update'}
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
                        to update note
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
