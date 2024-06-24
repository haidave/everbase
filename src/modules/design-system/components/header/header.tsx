import { ROUTES } from '@/config/routes'
import { Link } from '@/modules/design-system/components/link'

import { Button } from '../button'
import { ThemeSwitcher } from '../theme-switcher'
import { GithubButtonLink } from './parts/github-button-link'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 h-header border-b-[0.75px] bg-['hsla(0,0%,100%,.01)'] backdrop-blur-md">
      <div className="flex w-screen items-center justify-center">
        <div className="flex w-full max-w-7xl items-center justify-between px-8 py-4">
          <nav>
            <ul className="flex items-center gap-8">
              <li>
                <Link href={ROUTES.home}>
                  <span className="text-gradient font-logo text-base font-medium">everbase</span>
                </Link>
              </li>
              <li>
                <Link href={ROUTES.dashboard}>
                  <span className="text-sm text-secondary transition-colors duration-150 hover:text-primary">
                    Dashboard
                  </span>
                </Link>
              </li>
            </ul>
          </nav>

          <nav>
            <ul className="flex items-center">
              <li className="mr-2">
                <GithubButtonLink />
              </li>
              <li className="mr-4">
                <ThemeSwitcher />
              </li>
              <li>
                <Button asChild>
                  <Link href={ROUTES.signIn}>Sign In</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export { Header }
