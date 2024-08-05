'use client'

import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { isToday, isYesterday, parse } from 'date-fns'
import { useInView } from 'react-intersection-observer'

import { useResize } from '@/hooks/use-resize'
import { type GroupedNotes } from '@/modules/api/types'
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/design-system/components/popover'
import { TooltipProvider } from '@/modules/design-system/components/tooltip'
import { DeleteNoteButton } from '@/modules/notes/components/delete-note-button'
import { getGroupedNotes } from '@/modules/notes/lib/actions'

import { NOTES_QUERY_LIMIT, QUERY_KEYS } from '../lib/const'
import { CopyNoteButton } from './copy-note-button'
import { EditNoteButton } from './edit-note-button'

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
      const totalNotes = Object.values(lastPage.groupedNotes).flat().length
      return totalNotes === NOTES_QUERY_LIMIT ? allPages.length + 1 : undefined
    },
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  if (isPending) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  const groupedNotes = data?.pages.reduce<GroupedNotes>((acc, page) => {
    Object.entries(page.groupedNotes).forEach(([date, notes]) => {
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date]?.push(...notes)
    })
    return acc
  }, {})

  if (!groupedNotes || Object.keys(groupedNotes).length === 0) {
    return <p>Empty as your head. Create a note instead!</p>
  }

  const formatDate = (dateString: string) => {
    const date = parse(dateString, 'MMMM d, yyyy', new Date())
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return dateString
  }

  const closePopover = () => {
    setOpenPopoverId(null)
  }

  return (
    <>
      <div className="grid gap-8 pb-12 lg:gap-10">
        {Object.entries(groupedNotes).map(([date, notes]) => (
          <div key={date} className="relative">
            <div className="flex items-center gap-2 font-mono text-sm lg:absolute lg:right-full lg:mr-10">
              <span className="text-nowrap text-label">{formatDate(date)}</span>
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
                      <div
                        dangerouslySetInnerHTML={{
                          __html: note.content
                            // Replace empty paragraphs with line breaks
                            .replace(/<p><\/p>/g, '<br>')
                            // Disable all inputs
                            .replace(/<input/g, '<input tabindex="-1"'),
                        }}
                        className="pointer-events-none select-none whitespace-pre-wrap break-words font-mono text-sm leading-relaxed"
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
      </div>
      <div ref={ref} className="absolute inset-x-0 bottom-0 grid h-10 place-items-center">
        {isFetchingNextPage ? <span className="font-mono text-sm text-secondary">Loading more...</span> : null}
      </div>
    </>
  )
}

export { Notes }
