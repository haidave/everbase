const ROUTES = {
  home: '/',
  signIn: '/auth/sign-in',
  dashboard: '/dashboard',
  inbox: '/inbox',
  tasks: '/tasks',
  projects: '/projects',
  calendar: '/calendar',
  rewards: '/rewards',
} as const

const PROTECTED_ROUTES = [
  ROUTES.dashboard,
  ROUTES.inbox,
  ROUTES.tasks,
  ROUTES.projects,
  ROUTES.calendar,
  ROUTES.rewards,
]

export { ROUTES, PROTECTED_ROUTES }
