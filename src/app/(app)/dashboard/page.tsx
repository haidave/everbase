import { createClient } from '@/lib/supabase/server'
import { handleSignOut } from '@/modules/auth/actions'
import { Button } from '@/modules/design-system/components/button'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data } = await supabase.auth.getUser()

  return (
    <div>
      <form action={handleSignOut}>
        <Button variant="shiny">
          <span>Sign Out</span>
        </Button>
      </form>
      <p>Hello {data?.user?.email}</p>
    </div>
  )
}
