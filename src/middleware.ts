import { NextResponse, type NextRequest } from 'next/server'

import { PROTECTED_ROUTES, ROUTES } from '@/config/routes'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  const user = await supabase.auth.getUser()

  if (isProtectedRoute(request.nextUrl.pathname) && !user.data.user) {
    return NextResponse.redirect(new URL(ROUTES.signIn, request.url))
  }

  if (request.nextUrl.pathname.startsWith(ROUTES.signIn) && user.data.user) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url))
  }
  return response
}

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt|webmanifest)$).*)',
  ],
}
