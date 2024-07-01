import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/server'
import { handleSignOut } from '@/modules/auth/lib/actions'
import { Button } from '@/modules/design-system/components/button'
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

  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="grid gap-4">
        <form action={handleSignOut}>
          <Button variant="shiny">
            <span>Sign Out</span>
          </Button>
        </form>
        <p>Hello {data?.user?.email}</p>

        <AddPost />

        <Posts />
      </div>
    </HydrationBoundary>
  )
}

export { InboxPage }
