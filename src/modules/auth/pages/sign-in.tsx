import type { Metadata } from 'next'
import { CornerUpLeftIcon } from 'lucide-react'

import { ROUTES } from '@/config/routes'
import { handleSignIn } from '@/modules/auth/lib/actions'
import { Button } from '@/modules/design-system/components/button'
import { Link } from '@/modules/design-system/components/link'

export const metadata: Metadata = {
  title: 'Sign In',
}

const SignInPage = () => {
  return (
    <div className="grid h-svh place-items-center">
      <div className="absolute left-8 top-8">
        <Link href={ROUTES.home} className="flex items-center gap-2 text-sm hover:underline hover:underline-offset-4">
          <CornerUpLeftIcon className="size-4" />
          Back
        </Link>
      </div>

      <form action={handleSignIn}>
        <Button size="large" variant="shiny">
          Continue with Google
        </Button>
      </form>
    </div>
  )
}

export { SignInPage }
