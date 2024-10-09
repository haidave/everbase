'use server'

import { createClient } from '@/lib/supabase/server'
import { type ProjectStatus } from '@/modules/api/types'

export async function getProjects() {
  const supabase = createClient()

  const { data: projects, error } = await supabase.from('projects').select().order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch projects')
  }

  return projects
}

export async function getProject(projectId: string) {
  const supabase = createClient()

  const { data: project, error } = await supabase.from('projects').select('*').eq('id', projectId).single()

  if (error) {
    throw new Error('Failed to fetch project')
  }

  return project
}

export async function addProject(formData: FormData) {
  const name = String(formData.get('name'))
  const status = String(formData.get('status')) as ProjectStatus
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('projects').insert({
    name,
    status,
    user_id: user!.id,
  })

  if (error) {
    throw new Error('Failed to add project')
  }

  return { success: true }
}

export async function updateProject(formData: FormData) {
  const projectId = String(formData.get('projectId'))
  const name = String(formData.get('name'))
  const status = formData.get('status') as ProjectStatus
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('projects').update({ name, status }).match({ id: projectId, user_id: user!.id })

  if (error) {
    throw new Error('Failed to update project')
  }

  return { success: true }
}

export async function deleteProject(formData: FormData) {
  const projectId = String(formData.get('projectId'))
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('projects').delete().match({ id: projectId, user_id: user!.id })

  if (error) {
    throw new Error('Failed to delete project')
  }

  return { success: true }
}
