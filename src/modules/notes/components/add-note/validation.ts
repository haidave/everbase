'use client'

import { z } from 'zod'

const addNoteSchema = z.object({
  content: z.string().min(1),
})

type AddNoteSchemaType = z.infer<typeof addNoteSchema>

export { addNoteSchema }

export type { AddNoteSchemaType }
