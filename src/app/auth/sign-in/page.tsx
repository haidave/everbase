import { ROUTES } from '@/config/routes'
import { handleSignIn } from '@/modules/auth/lib/actions'
import { Button } from '@/modules/design-system/components/button'
import { Link } from '@/modules/design-system/components/link'

export default function SignInPage() {
  return (
    <div className="grid h-svh place-items-center">
      <div className="grid place-items-center gap-8">
        <form action={handleSignIn}>
          <Button>Sign in with Google</Button>
        </form>
        <Link href={ROUTES.home}>Go back home</Link>
      </div>
    </div>
  )
}
