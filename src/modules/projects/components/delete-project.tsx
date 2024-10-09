'use client'

import { useCallback, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckIcon, Loader2Icon, TrashIcon, XIcon } from 'lucide-react'

import { QUERY_KEYS } from '@/lib/const'
import { Button } from '@/modules/design-system/components/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/modules/design-system/components/tooltip'
import { deleteProject } from '@/modules/projects/lib/actions'

interface DeleteProjectProps {
  projectId: string
}

export function DeleteProject({ projectId }: DeleteProjectProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS })
    },
  })

  const handleDelete = useCallback(() => {
    setShowConfirm(true)
  }, [])

  const confirmDelete = useCallback(() => {
    const formData = new FormData()
    formData.append('projectId', projectId)
    mutation.mutate(formData)
    setShowConfirm(false)
  }, [mutation, projectId])

  const cancelDelete = useCallback(() => {
    setShowConfirm(false)
  }, [])

  return (
    <>
      {mutation.isPending ? (
        <Button variant="ghost" size="icon" aria-label="Deleting project...">
          <Loader2Icon className="size-4 animate-spin text-green-500" />
        </Button>
      ) : !showConfirm ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={mutation.isPending}
          aria-label="Delete project"
        >
          <TrashIcon className="size-4" />
        </Button>
      ) : (
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={confirmDelete} aria-label="Confirm delete">
                <CheckIcon className="size-4 text-green-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Confirm delete</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={cancelDelete} aria-label="Cancel delete">
                <XIcon className="size-4 text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Cancel delete</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </>
  )
}
