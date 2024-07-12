'use client'

import { z } from 'zod'

const addPostSchema = z.object({
  content: z.string().min(1),
})

type AddPostSchemaType = z.infer<typeof addPostSchema>

export { addPostSchema }

export type { AddPostSchemaType }
