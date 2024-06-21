import { ROUTES } from '@/config/routes'
import { Link } from '@/modules/design-system/components/link'

import { CommandMenu } from '../command-menu/command-menu'
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
            </ul>
          </nav>

          <nav>
            <ul className="flex items-center">
              <li>
                <CommandMenu />
              </li>
              <li className="ml-4">
                <GithubButtonLink />
              </li>
              <li className="ml-2">
                <ThemeSwitcher />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export { Header }
