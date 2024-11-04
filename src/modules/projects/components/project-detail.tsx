import { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckIcon, TrashIcon, XIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { QUERY_KEYS } from '@/lib/const'
import { PROJECT_STATUSES, type Project } from '@/modules/api/types'
import { Button } from '@/modules/design-system/components/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/modules/design-system/components/form'
import { Input } from '@/modules/design-system/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/design-system/components/select'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/modules/design-system/components/sheet'

import { deleteProject, updateProject } from '../lib/actions'
import { projectSchema, type ProjectSchemaType } from '../lib/validation'

interface ProjectDetailProps {
  project: Project
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDetail({ project, isOpen, onOpenChange }: ProjectDetailProps) {
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm<ProjectSchemaType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
      status: project.status,
    },
  })

  const { control, handleSubmit, reset, watch } = form
  const formValues = watch()
  const hasChanges = formValues.name !== project.name || formValues.status !== project.status

  const updateMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS })
      setIsSaving(false)
      onOpenChange(false)
    },
    onError: (error) => {
      setIsSaving(false)
      console.error('Failed to update project:', error)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS })
      setIsDeleting(false)
      onOpenChange(false)
    },
    onError: (error) => {
      setIsDeleting(false)
      console.error('Failed to delete project:', error)
    },
  })

  const onSubmit = useCallback(
    (data: ProjectSchemaType) => {
      setIsSaving(true)
      const formData = new FormData()
      formData.append('projectId', project.id)
      formData.append('name', data.name)
      formData.append('status', data.status)
      updateMutation.mutate(formData)
    },
    [project.id, updateMutation]
  )

  const handleDelete = useCallback(() => {
    setShowConfirm(true)
  }, [])

  const confirmDelete = useCallback(() => {
    setIsDeleting(true)
    const formData = new FormData()
    formData.append('projectId', project.id)
    deleteMutation.mutate(formData)
    setShowConfirm(false)
  }, [deleteMutation, project.id])

  const cancelDelete = useCallback(() => {
    setShowConfirm(false)
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        reset({
          name: project.name,
          status: project.status,
        })
      }
      onOpenChange(open)
    },
    [onOpenChange, project.name, project.status, reset]
  )

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex h-full flex-col focus:outline-none sm:max-w-xl">
        <SheetTitle>Project Details</SheetTitle>
        <SheetDescription className="sr-only">
          Update project details or delete the project. Press escape to cancel.
        </SheetDescription>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
            <div className="grid gap-6">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Project name" disabled={isSaving} {...field} autoComplete="off" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSaving}>
                        <SelectTrigger className="capitalize">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PROJECT_STATUSES).map((status) => (
                            <SelectItem key={status} value={status} className="capitalize">
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-auto flex justify-between pt-6">
              {!showConfirm ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="gap-2 text-red-500"
                >
                  <TrashIcon className="size-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="gap-2 text-green-500"
                  >
                    <CheckIcon className="size-4" />
                    {isDeleting ? 'Deleting...' : 'Confirm'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={cancelDelete}
                    disabled={isDeleting}
                    className="gap-2 text-red-500"
                  >
                    <XIcon className="size-4" />
                    Cancel
                  </Button>
                </div>
              )}
              <Button type="submit" disabled={isSaving || !hasChanges}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
