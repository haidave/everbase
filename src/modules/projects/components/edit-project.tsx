'use client'

import { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PencilIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { QUERY_KEYS } from '@/lib/const'
import { PROJECT_STATUSES, type Project } from '@/modules/api/types'
import { Button } from '@/modules/design-system/components/button'
import { Dialog, DialogContent, DialogTitle } from '@/modules/design-system/components/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/modules/design-system/components/form'

import { updateProject } from '../lib/actions'
import { projectSchema, type ProjectSchemaType } from '../lib/validation'

interface EditProjectProps {
  project: Project
}

export function EditProject({ project }: EditProjectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<ProjectSchemaType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
      status: project.status,
    },
  })

  const mutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS })
      setIsOpen(false)
    },
  })

  const onSubmit = useCallback(
    (data: ProjectSchemaType) => {
      const formData = new FormData()
      formData.append('projectId', project.id)
      formData.append('name', data.name)
      formData.append('status', data.status)
      mutation.mutate(formData)
    },
    [mutation, project.id]
  )

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <PencilIcon className="size-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>Edit Project</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <input {...field} type="text" placeholder="Project name" disabled={mutation.isPending} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select {...field} disabled={mutation.isPending}>
                        {Object.values(PROJECT_STATUSES).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
