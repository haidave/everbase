import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

import { env } from '@/env'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    // TODO: Handle the error
    // If there's an error or the code is missing, redirect the user to an error page
    return NextResponse.redirect(`${origin}/auth/sign-in`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.delete({ name, ...options })
      },
    },
  })
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (!error) {
    // Redirect the user to the inbox after successful sign-in
    return NextResponse.redirect(`${origin}/inbox`)
  }
}
