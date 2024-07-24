import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { type Note } from '@/modules/api/types'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/modules/design-system/components/dialog'
import { Form, FormControl, FormField, FormItem } from '@/modules/design-system/components/form'
import { getNote, updateNote } from '@/modules/notes/lib/actions'

import { QUERY_KEYS } from '../lib/const'
import { noteSchema, type NoteSchemaType } from '../lib/validation'
import { RichTextEditor } from './rich-text-editor'

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

  const hasChanges = content !== note.content

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="grid gap-2 sm:max-w-3xl" data-edit-dialog>
        <DialogTitle className="sr-only">Edit note</DialogTitle>
        <DialogDescription className="sr-only">Click update to save changes. Press escape to cancel.</DialogDescription>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="relative max-h-[75svh]">
            <FormField
              control={control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextEditor
                      isEditing
                      isPending={mutation.isPending}
                      hasChanges={hasChanges}
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
