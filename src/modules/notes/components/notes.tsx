'use client'

import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { UndoIcon } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

import { NOTES_QUERY_LIMIT, QUERY_KEYS } from '@/lib/const'
import { formatDate, formatTime } from '@/lib/formatters'
import { useResize } from '@/hooks/use-resize'
import { type GroupedNotes } from '@/modules/api/types'
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/design-system/components/popover'
import { TooltipProvider } from '@/modules/design-system/components/tooltip'
import { DeleteNoteButton } from '@/modules/notes/components/delete-note-button'
import { getGroupedNotes } from '@/modules/notes/lib/actions'

import { CopyNoteButton } from './copy-note-button'
import { EditNoteButton } from './edit-note-button'
import { NotesSkeleton } from './notes-skeleton'

const Notes = () => {
  const { width } = useResize()
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null)
  const popoverContentRef = useRef<HTMLDivElement>(null)
  const { ref, inView } = useInView()

  const { data, isPending, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: QUERY_KEYS.NOTES,
    queryFn: async ({ pageParam }) => {
      const res = await getGroupedNotes(pageParam, NOTES_QUERY_LIMIT)
      return res
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalNotes = lastPage.notes.length
      return totalNotes === NOTES_QUERY_LIMIT ? allPages.length + 1 : undefined
    },
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  if (isPending) return <NotesSkeleton />
  if (error) return <div>An error occurred: {error.message}</div>

  const groupedNotes = data?.pages.reduce<GroupedNotes>((acc, page) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    page.notes.forEach((note) => {
      const date = toZonedTime(parseISO(note.created_at), userTimeZone)
      const formattedDate = format(date, 'yyyy-MM-dd')
      if (!acc[formattedDate]) {
        acc[formattedDate] = []
      }
      acc[formattedDate]?.push(note)
    })
    return acc
  }, {})

  if (!groupedNotes || Object.keys(groupedNotes).length === 0) {
    return (
      <div className="fixed bottom-5 right-20 z-50 lg:bottom-8 lg:right-[5.625rem]">
        <p className="absolute -top-8 left-1/2 -translate-x-1/2 truncate font-semibold text-secondary">
          Add your first note here!
        </p>
        <UndoIcon className="size-20 rotate-[-140deg] stroke-[1px] text-secondary" />
      </div>
    )
  }

  const closePopover = () => {
    setOpenPopoverId(null)
  }

  return (
    <div className="relative grid gap-8 pb-12 lg:gap-10">
      {Object.entries(groupedNotes).map(([date, notes]) => (
        <div key={date} className="relative">
          <div className="flex items-center gap-2 font-mono text-sm lg:absolute lg:right-full lg:mr-10">
            <time className="text-nowrap text-label" dateTime={date}>
              {formatDate(date)}
            </time>
            <span className="text-secondary">{notes.length}</span>
          </div>
          <ul className="grid gap-4 max-lg:mt-3">
            {notes.map((note) => (
              <Popover
                key={note.id}
                open={openPopoverId === note.id}
                onOpenChange={(open) => setOpenPopoverId(open ? note.id : null)}
              >
                <PopoverTrigger
                  aria-label="Note actions"
                  className="rounded-md text-left focus-visible:shadow-focus focus-visible:outline-0 [&[data-state='open']>li]:bg-primary"
                >
                  <li className="relative rounded-md bg-subtle px-5 py-4 transition-all duration-150 hover:bg-primary active:bg-primary">
                    <time dateTime={note.created_at} className="mb-1.5 flex font-mono text-xs text-label">
                      {formatTime(note.created_at)}
                    </time>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: note.content
                          // Replace empty paragraphs with line breaks
                          .replace(/<p><\/p>/g, '<br>')
                          // Disable all inputs
                          .replace(/<input/g, '<input tabindex="-1"'),
                      }}
                      className="select-none whitespace-pre-wrap break-words font-mono text-sm leading-relaxed"
                      style={{
                        wordBreak: 'break-word',
                      }}
                      aria-readonly="true"
                    ></div>
                  </li>
                </PopoverTrigger>
                <PopoverContent
                  ref={popoverContentRef}
                  side={width < 1024 ? 'top' : 'right'}
                  sideOffset={12}
                  align={width < 1024 ? 'end' : 'start'}
                  className="flex gap-1 rounded-md border border-line bg-subtle p-1"
                  onOpenAutoFocus={(e) => {
                    e.preventDefault()
                    popoverContentRef.current?.setAttribute('tabindex', '-1')
                    popoverContentRef.current?.focus()
                  }}
                >
                  <TooltipProvider delayDuration={300}>
                    <EditNoteButton note={note} closePopover={closePopover} />
                    <CopyNoteButton content={note.content} />
                    <DeleteNoteButton noteId={note.id} />
                  </TooltipProvider>
                </PopoverContent>
              </Popover>
            ))}
          </ul>
        </div>
      ))}
      <div ref={ref} className="absolute inset-x-0 bottom-0 grid h-10 place-items-center">
        {isFetchingNextPage ? <span className="font-mono text-sm text-secondary">Loading more...</span> : null}
      </div>
    </div>
  )
}

export { Notes }
