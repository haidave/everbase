const ROUTES = {
  home: '/',
  signIn: '/auth/sign-in',
  dashboard: '/dashboard',
  inbox: '/inbox',
  tasks: '/tasks',
  projects: '/projects',
  calendar: '/calendar',
  wishlist: '/wishlist',
} as const

const PROTECTED_ROUTES = [
  ROUTES.dashboard,
  ROUTES.inbox,
  ROUTES.tasks,
  ROUTES.projects,
  ROUTES.calendar,
  ROUTES.wishlist,
]

export { ROUTES, PROTECTED_ROUTES }
