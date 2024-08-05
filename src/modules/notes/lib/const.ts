export const QUERY_KEYS = {
  NOTES: ['notes'] as const,
  NOTE: (noteId: string) => ['note', noteId] as const,
} as const

export const NOTES_QUERY_LIMIT = 20
