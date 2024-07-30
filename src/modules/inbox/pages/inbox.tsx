import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import { AddNote } from '@/modules/notes/components/add-note'
import { Notes } from '@/modules/notes/components/notes'
import { getGroupedNotes } from '@/modules/notes/lib/actions'
import { QUERY_KEYS } from '@/modules/notes/lib/const'

export const metadata: Metadata = {
  title: 'Inbox',
}

const InboxPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.NOTES,
    queryFn: getGroupedNotes,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="relative mx-auto flex max-w-xl flex-col lg:w-1/2">
        <div className="fixed bottom-5 right-5 z-50 lg:bottom-8 lg:right-8">
          <AddNote />
        </div>
        <Notes />
      </div>
    </HydrationBoundary>
  )
}

export { InboxPage }
