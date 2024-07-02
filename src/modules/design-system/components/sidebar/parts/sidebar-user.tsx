import { LogOutIcon } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { handleSignOut } from '@/modules/auth/lib/actions'
import { Button } from '@/modules/design-system/components/button'

const SidebarUser = async () => {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-secondary">{data?.user?.email}</span>
      <form action={handleSignOut}>
        <Button variant="ghost" size="icon">
          <LogOutIcon className="size-4" />
        </Button>
      </form>
    </div>
  )
}

export { SidebarUser }
