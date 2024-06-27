import { createClient } from '@/lib/supabase/server'
import { handleSignOut } from '@/modules/auth/actions'
import { Button } from '@/modules/design-system/components/button'
import { DeletePostButton } from '@/modules/posts/components/delete-post-button'
import { NewPost } from '@/modules/posts/components/new-post'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data } = await supabase.auth.getUser()
  const { data: posts } = await supabase.from('posts').select()

  return (
    <div className="grid gap-4">
      <form action={handleSignOut}>
        <Button variant="shiny">
          <span>Sign Out</span>
        </Button>
      </form>
      <p>Hello {data?.user?.email}</p>

      <NewPost />

      <div className="grid gap-4">
        {posts?.map((post) => (
          <div key={post.id} className="border bg-subtle">
            <p>{post.content}</p>
            <p>{post.created_at}</p>
            <DeletePostButton postId={post.id} />
          </div>
        ))}
      </div>
    </div>
  )
}
