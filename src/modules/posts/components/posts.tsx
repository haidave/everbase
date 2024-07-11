'use client'

import { useQuery } from '@tanstack/react-query'

import { DeletePostButton } from '@/modules/posts/components/delete-post-button'
import { getPosts } from '@/modules/posts/lib/actions'

import { QUERY_KEYS } from '../lib/const'

const Posts = () => {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.POSTS,
    queryFn: () => getPosts(),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  return (
    <div className="grid gap-4">
      {posts?.map((post) => (
        <div key={post.id} className="rounded-xl bg-primary p-4 hover:bg-primary-hover">
          <p>{post.content}</p>
          <p>{post.created_at}</p>
          <DeletePostButton postId={post.id} />
        </div>
      ))}
    </div>
  )
}

export { Posts }
