'use client'

import { useCallback, useMemo, useState } from 'react'
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/lib/const'
import { cn } from '@/lib/utils'
import { PROJECT_STATUSES, type Project, type Projects, type ProjectStatus } from '@/modules/api/types'

import { getProjects, updateProjectStatus } from '../lib/actions'
import { AddProject } from './add-project'
import { ProjectDetail } from './project-detail'

const ProjectsList = () => {
  const queryClient = useQueryClient()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery<Projects, Error>({
    queryKey: QUERY_KEYS.PROJECTS,
    queryFn: () => getProjects(),
  })

  const updateProjectMutation = useMutation({
    mutationFn: (params: { projectId: string; newStatus: ProjectStatus; newPosition: number }) =>
      updateProjectStatus(params.projectId, params.newStatus, params.newPosition),
    onMutate: async ({ projectId, newStatus, newPosition }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.PROJECTS })
      const previousProjects = queryClient.getQueryData<Projects>(QUERY_KEYS.PROJECTS)

      queryClient.setQueryData<Projects>(QUERY_KEYS.PROJECTS, (old) => {
        if (!old) return old
        const updatedProjects = old.map((p) => ({ ...p }))
        const movedProject = updatedProjects.find((p) => p.id === projectId)
        if (!movedProject) return old

        movedProject.status = newStatus
        movedProject.position = newPosition

        return updatedProjects.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      })

      return { previousProjects }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(QUERY_KEYS.PROJECTS, context?.previousProjects)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS })
    },
  })

  const projectsByStatus = useMemo(() => {
    return PROJECT_STATUSES.reduce<Record<ProjectStatus, Projects>>(
      (acc, status) => {
        acc[status] = projects
          .filter((project) => project.status === status)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        return acc
      },
      {} as Record<ProjectStatus, Projects>
    )
  }, [projects])

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result

      if (!destination) return

      if (destination.droppableId === source.droppableId && destination.index === source.index) return

      const newStatus = destination.droppableId as ProjectStatus
      const oldStatus = source.droppableId as ProjectStatus

      const sourceProjects = [...projectsByStatus[oldStatus]]
      const destProjects = oldStatus === newStatus ? sourceProjects : [...projectsByStatus[newStatus]]

      const [movedProject] = sourceProjects.splice(source.index, 1)
      if (movedProject) {
        destProjects.splice(destination.index, 0, movedProject)
      }

      const updatedProjects = destProjects.map((project, index) => ({
        ...project,
        status: newStatus,
        position: index,
      }))

      // Optimistically update the UI
      queryClient.setQueryData<Projects>(QUERY_KEYS.PROJECTS, (old) => {
        if (!old) return old
        return old.map((p) => updatedProjects.find((up) => up.id === p.id) || p)
      })

      // Update the server
      updateProjectMutation.mutate({
        projectId: draggableId,
        newStatus,
        newPosition: destination.index,
      })
    },
    [projectsByStatus, queryClient, updateProjectMutation]
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="relative">
        <div className="grid items-start gap-4 md:grid-cols-4">
          {PROJECT_STATUSES.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    'flex flex-col content-center gap-6 rounded-lg bg-app px-6 py-7',
                    snapshot.isDraggingOver && 'border border-dashed'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold capitalize tracking-wide">{status}</h2>
                    <span className="flex min-w-5 items-center justify-center rounded border border-line bg-primary-hover px-1 text-sm font-medium text-secondary">
                      {projectsByStatus[status]?.length}
                    </span>
                  </div>
                  <div className="grid gap-4">
                    {projectsByStatus[status]?.map((project, index) => (
                      <Draggable key={project.id} draggableId={project.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => setSelectedProject(project)}
                            className={cn(
                              'group relative cursor-pointer rounded-lg bg-subtle px-2 py-3 text-center font-mono hover:bg-primary',
                              snapshot.isDragging && 'bg-primary-active'
                            )}
                          >
                            <span>{project.name}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
        <div className="fixed bottom-5 right-5 z-50 lg:bottom-8 lg:right-8">
          <AddProject />
        </div>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            isOpen={!!selectedProject}
            onOpenChange={(open) => !open && setSelectedProject(null)}
          />
        )}
      </div>
    </DragDropContext>
  )
}

export { ProjectsList }
