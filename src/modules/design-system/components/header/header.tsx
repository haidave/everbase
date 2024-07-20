import { ROUTES } from '@/config/routes'
import { createClient } from '@/lib/supabase/server'
import { Link } from '@/modules/design-system/components/link'

import { Button } from '../button'

const Header = async () => {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 h-header border-b-[0.75px] bg-['hsla(0,0%,100%,.01)'] backdrop-blur-md">
      <div className="flex w-screen items-center justify-center">
        <nav className="w-full max-w-7xl px-8 py-4">
          <ul className="flex w-full items-center justify-between gap-8">
            <li>
              <Link href={ROUTES.home} className="rounded-md">
                <span className="text-gradient font-logo text-base font-medium">everbase</span>
              </Link>
            </li>
            <li>
              <Button variant="shiny" asChild>
                <Link href={ROUTES.signIn}>{data.user ? 'Go to App' : 'Sign In'}</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export { Header }
