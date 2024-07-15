'use client'

import { useQuery } from '@tanstack/react-query'
import { isToday, isYesterday, parse } from 'date-fns'

import { type Tables } from '@/modules/api/generated/database.types'
import { DeleteNoteButton } from '@/modules/notes/components/delete-note-button'
import { getGroupedNotes } from '@/modules/notes/lib/actions'

import { QUERY_KEYS } from '../lib/const'

type Note = Tables<'notes'>
type GroupedNotes = Record<string, Note[]>

const Notes = () => {
  const {
    data: groupedNotes,
    isLoading,
    error,
    refetch,
  } = useQuery<GroupedNotes, Error>({
    queryKey: QUERY_KEYS.NOTES,
    queryFn: () => getGroupedNotes(),
  })

  if (isLoading) return <div>Loading...</div>
  if (error)
    return (
      <div>
        <p>An error occurred: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    )

  if (!groupedNotes || Object.keys(groupedNotes).length === 0) {
    return <p>Empty as your head. Create a note instead!</p>
  }

  const formatDate = (dateString: string) => {
    // Parse the date string we get from getGroupedNotes
    const date = parse(dateString, 'MMMM d, yyyy', new Date())

    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'

    return dateString // Return the original formatted string if not today or yesterday
  }

  return (
    <div className="grid gap-10 pb-12">
      {Object.entries(groupedNotes).map(([date, notes]) => (
        <div key={date} className="relative">
          <div className="absolute right-full mr-10 flex items-center gap-2">
            <span className="text-nowrap text-label">{formatDate(date)}</span>
            <span className="text-secondary">{notes.length}</span>
          </div>
          <ul className="grid gap-4">
            {notes.map((note) => (
              <li key={note.id} className="relative rounded-xl bg-primary px-5 py-3 hover:bg-primary-hover">
                <p className="leading-relaxed tracking-normal">{note.content}</p>
                <div className="absolute left-full top-0 ml-4">
                  <DeleteNoteButton noteId={note.id} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export { Notes }
