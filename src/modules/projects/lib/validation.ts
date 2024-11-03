import { z } from 'zod'

import { PROJECT_STATUSES, type ProjectStatus } from '@/modules/api/types'

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  status: z.enum(PROJECT_STATUSES as [ProjectStatus, ...ProjectStatus[]]),
  position: z.number(),
})

type ProjectSchemaType = z.infer<typeof projectSchema>

export { projectSchema }
export type { ProjectSchemaType }
