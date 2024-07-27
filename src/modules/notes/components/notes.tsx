'use client'

import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isToday, isYesterday, parse } from 'date-fns'

import { type GroupedNotes } from '@/modules/api/types'
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/design-system/components/popover'
import { DeleteNoteButton } from '@/modules/notes/components/delete-note-button'
import { getGroupedNotes } from '@/modules/notes/lib/actions'

import { QUERY_KEYS } from '../lib/const'
import { CopyNoteButton } from './copy-note-button'
import { EditNoteButton } from './edit-note-button'

const Notes = () => {
  const popoverContentRef = useRef<HTMLDivElement>(null)

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
    const date = parse(dateString, 'MMMM d, yyyy', new Date())
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return dateString
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
              <Popover key={note.id}>
                <PopoverTrigger
                  aria-label="Note actions"
                  className="rounded-lg text-left focus-visible:shadow-focus focus-visible:outline-0 [&[data-state='open']>li]:bg-primary"
                >
                  <li className="relative rounded-lg bg-subtle px-5 py-4 transition-all duration-150 hover:bg-primary active:bg-primary">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: note.content
                          // Replace empty paragraphs with line breaks
                          .replace(/<p><\/p>/g, '<br>')
                          // Disable all inputs
                          .replace(/<input/g, '<input tabindex="-1"'),
                      }}
                      className="pointer-events-none select-none"
                      aria-readonly="true"
                    ></div>
                  </li>
                </PopoverTrigger>
                <PopoverContent
                  ref={popoverContentRef}
                  side="right"
                  sideOffset={12}
                  align="start"
                  className="flex gap-1 rounded-md border border-line bg-subtle"
                  onOpenAutoFocus={(e) => {
                    e.preventDefault()
                    popoverContentRef.current?.setAttribute('tabindex', '-1')
                    popoverContentRef.current?.focus()
                  }}
                >
                  <EditNoteButton note={note} />
                  <CopyNoteButton content={note.content} />
                  <DeleteNoteButton noteId={note.id} />
                </PopoverContent>
              </Popover>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export { Notes }
