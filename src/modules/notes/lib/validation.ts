'use client'

import { z } from 'zod'

const noteSchema = z.object({
  content: z.string().min(1, 'Content is required'),
})

type NoteSchemaType = z.infer<typeof noteSchema>

export { noteSchema }

export type { NoteSchemaType }
