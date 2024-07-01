import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import { AddPost } from '@/modules/posts/components/add-post'
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
      <div className="flex flex-col gap-4">
        <AddPost />
        <Posts />
      </div>
    </HydrationBoundary>
  )
}

export { InboxPage }
