import { type Database, type Tables } from './generated/database.types'

export type Note = Tables<'notes'>

export type GroupedNotes = Record<string, Note[]>

export type Project = Tables<'projects'>

export type Projects = Project[]

export type ProjectStatus = Database['public']['Enums']['project_status']

export const PROJECT_STATUSES: ProjectStatus[] = ['backlog', 'active', 'passive', 'completed']
