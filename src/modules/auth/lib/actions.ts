'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { ROUTES } from '@/config/routes'
import { createClient } from '@/lib/supabase/server'

const handleSignIn = async () => {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      skipBrowserRedirect: true,
    },
  })

  if (error) {
    console.error('Error signing in:', error.message)
  } else {
    return redirect(data.url)
  }
}

const handleSignOut = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()

  return redirect(ROUTES.home)
}

export { handleSignIn, handleSignOut }
