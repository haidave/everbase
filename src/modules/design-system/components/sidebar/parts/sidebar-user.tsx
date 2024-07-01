import { createClient } from '@/lib/supabase/server'
import { handleSignOut } from '@/modules/auth/lib/actions'
import { Button } from '@/modules/design-system/components/button'

const SidebarUser = async () => {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  return (
    <div className="grid gap-4">
      <span>{data?.user?.email}</span>
      <form action={handleSignOut}>
        <Button variant="shiny">
          <span>Sign Out</span>
        </Button>
      </form>
    </div>
  )
}

export { SidebarUser }
