import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import { Posts } from '@/modules/posts/components/posts'
import { getPosts } from '@/modules/posts/lib/actions'
import { QUERY_KEYS } from '@/modules/posts/lib/const'

export const metadata: Metadata = {
  title: 'Inbox',
}

const InboxPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.POSTS,
    queryFn: getPosts,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto flex w-full max-w-4xl flex-col">
        <Posts />
      </div>
    </HydrationBoundary>
  )
}

export { InboxPage }
