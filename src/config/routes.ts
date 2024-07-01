const ROUTES = {
  home: '/',
  signIn: '/auth/sign-in',
  inbox: '/inbox',
} as const

const PROTECTED_ROUTES = [ROUTES.inbox] as const

export { ROUTES, PROTECTED_ROUTES }
