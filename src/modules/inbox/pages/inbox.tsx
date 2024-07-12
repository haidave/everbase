import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import { Notes } from '@/modules/notes/components/notes'
import { getNotes } from '@/modules/notes/lib/actions'
import { QUERY_KEYS } from '@/modules/notes/lib/const'

export const metadata: Metadata = {
  title: 'Inbox',
}

const InboxPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.NOTES,
    queryFn: getNotes,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto flex w-full max-w-4xl flex-col">
        <Notes />
      </div>
    </HydrationBoundary>
  )
}

export { InboxPage }
