export const QUERY_KEYS = {
  PROJECTS: ['projects'] as const,
  NOTES: ['notes'] as const,
  NOTE: (noteId: string) => ['note', noteId] as const,
} as const

export const NOTES_QUERY_LIMIT = 20
