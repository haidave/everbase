'use client'

import { useQuery } from '@tanstack/react-query'

import { DeleteNoteButton } from '@/modules/notes/components/delete-note-button'
import { getNotes } from '@/modules/notes/lib/actions'

import { QUERY_KEYS } from '../lib/const'

const Notes = () => {
  const {
    data: notes,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.NOTES,
    queryFn: () => getNotes(),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  return (
    <div className="grid gap-4">
      {notes?.map((note) => (
        <div key={note.id} className="rounded-xl bg-primary p-4 hover:bg-primary-hover">
          <p className="font-mono">{note.content}</p>
          <p>{note.created_at}</p>
          <DeleteNoteButton noteId={note.id} />
        </div>
      ))}
    </div>
  )
}

export { Notes }
