import { type Tables } from './generated/database.types'

export type Note = Tables<'notes'>

export type GroupedNotes = Record<string, Note[]>
