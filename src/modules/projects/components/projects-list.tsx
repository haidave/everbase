'use client'

import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/lib/const'
import { PROJECT_STATUSES, type Projects, type ProjectStatus } from '@/modules/api/types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/modules/design-system/components/tooltip'

import { getProjects } from '../lib/actions'
import { AddProject } from './add-project'
import { DeleteProject } from './delete-project'
import { EditProject } from './edit-project'

const ProjectsList = () => {
  const {
    data: projects,
    isPending,
    error,
  } = useQuery<Projects, Error>({
    queryKey: QUERY_KEYS.PROJECTS,
    queryFn: () => getProjects(),
  })

  if (isPending) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  const projectsByStatus = PROJECT_STATUSES.reduce(
    (acc, status) => {
      acc[status] = projects.filter((project) => project.status === status)
      return acc
    },
    {} as Record<ProjectStatus, Projects>
  )

  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-4">
        {PROJECT_STATUSES.map((status) => (
          <div key={status} className="flex flex-col content-center gap-4 text-center">
            <h2 className="text-lg font-semibold capitalize">{status}</h2>
            {projectsByStatus[status].map((project) => (
              <div key={project.id} className="group relative">
                <div className="rounded-md bg-subtle px-2 py-3 text-center">
                  <span>{project.name}</span>
                </div>
                <div className="invisible absolute right-0 top-1/2 flex -translate-y-1/2 gap-2 group-hover:visible">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <EditProject project={project} />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Edit project</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DeleteProject projectId={project.id} />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Delete project</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="fixed bottom-5 right-5 z-50 lg:bottom-8 lg:right-8">
        <AddProject />
      </div>
    </div>
  )
}

export { ProjectsList }
