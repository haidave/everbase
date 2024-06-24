const ROUTES = {
  home: '/',
  signIn: '/auth/sign-in',
  dashboard: '/dashboard',
} as const

const PROTECTED_ROUTES = [ROUTES.dashboard] as const

export { ROUTES, PROTECTED_ROUTES }
