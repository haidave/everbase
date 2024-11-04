'use client'

import { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { QUERY_KEYS } from '@/lib/const'
import { PROJECT_STATUSES } from '@/modules/api/types'
import { Button } from '@/modules/design-system/components/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/design-system/components/form'
import { Input } from '@/modules/design-system/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/design-system/components/select'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/modules/design-system/components/sheet'
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
    },
    onError: (error) => {
      setIsSaving(false)
      console.error('Failed to add project:', error)
    },
  })

  const onSubmit = useCallback(
    (data: ProjectSchemaType) => {
      setIsSaving(true)
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('status', data.status)
      mutation.mutate(formData)
    },
    [mutation]
  )

  const openSheet = useCallback(() => {
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
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" className="size-12 rounded-full" onClick={openSheet}>
              <PlusIcon className="size-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="flex items-center gap-1.5">Add project</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SheetContent side="right" className="flex h-full flex-col focus:outline-none sm:max-w-xl">
        <SheetTitle>Add new project</SheetTitle>
        <SheetDescription className="sr-only">
          Click Add Project to add a new project. Press escape to cancel.
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
                    <FormMessage />
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
            <div className="mt-auto flex justify-end pt-6">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Adding...' : 'Add Project'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
