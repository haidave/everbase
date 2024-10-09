'use client'

import { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { QUERY_KEYS } from '@/lib/const'
import { scrollMainToTop } from '@/lib/utils'
import { PROJECT_STATUSES } from '@/modules/api/types'
import { Button } from '@/modules/design-system/components/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/modules/design-system/components/dialog'
import { Form, FormControl, FormField, FormItem } from '@/modules/design-system/components/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/modules/design-system/components/tooltip'

import { addProject } from '../lib/actions'
import { projectSchema, type ProjectSchemaType } from '../lib/validation'

export function AddProject() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<ProjectSchemaType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      status: 'backlog',
    },
  })

  const { control, handleSubmit, reset } = form

  const mutation = useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS })
      reset()
      setIsSaving(false)
      setIsOpen(false)
      setTimeout(() => {
        scrollMainToTop()
      }, 300)
    },
    onError: () => {
      setIsSaving(false)
    },
  })

  const onSubmit = useCallback(
    (data: ProjectSchemaType) => {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('status', data.status)
      mutation.mutate(formData)
    },
    [mutation]
  )

  const openDialog = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        reset()
      }
    },
    [reset]
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" className="size-12 rounded-full" onClick={openDialog}>
              <PlusIcon className="size-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="flex items-center gap-1.5">Add project </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="grid gap-2 focus:outline-none max-md:top-1/4 max-md:-translate-y-1/4 sm:max-w-3xl md:px-8">
        <DialogTitle className="sr-only">Add new project</DialogTitle>
        <DialogDescription className="sr-only">
          Click save to add a new project. Press escape to cancel.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="relative max-h-[75svh]">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      placeholder="Project name"
                      disabled={isSaving}
                      value={field.value || ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <select {...field}>
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
