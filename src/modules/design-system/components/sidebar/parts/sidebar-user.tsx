import { LogOutIcon, UserIcon } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { handleSignOut } from '@/modules/auth/lib/actions'
import { Button } from '@/modules/design-system/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/design-system/components/dropdown-menu'

const SidebarUser = async () => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group size-7 [&[data-state='open']>svg]:text-primary [&[data-state='open']]:bg-primary"
        >
          <UserIcon className="size-4 text-tertiary group-hover:text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        <DropdownMenuLabel className="font-normal">{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={handleSignOut}>
            <button className="flex items-center gap-2">
              <LogOutIcon className="size-3.5 text-tertiary transition-colors duration-150 group-hover:text-primary" />
              <span>Sign Out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { SidebarUser }
