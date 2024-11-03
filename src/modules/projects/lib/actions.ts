'use server'

import { createClient } from '@/lib/supabase/server'
import { type ProjectStatus } from '@/modules/api/types'

export async function getProjects() {
  const supabase = createClient()

  const { data: projects, error } = await supabase.from('projects').select().order('position', { ascending: true })

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

  // Get the maximum position for the status
  const { data: maxPositionProject, error: maxPositionError } = await supabase
    .from('projects')
    .select('position')
    .eq('status', status)
    .order('position', { ascending: false })
    .limit(1)
    .single()

  if (maxPositionError && maxPositionError.code !== 'PGRST116') {
    throw new Error('Failed to get max position')
  }

  const newPosition = maxPositionProject ? (maxPositionProject.position || 0) + 1 : 0

  const { error } = await supabase.from('projects').insert({
    name,
    status,
    user_id: user!.id,
    position: newPosition,
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

export async function updateProjectStatus(projectId: string, newStatus: ProjectStatus, newPosition: number) {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Authentication failed')

  // Get the current project
  const { data: currentProject, error: fetchError } = await supabase
    .from('projects')
    .select('status, position')
    .eq('id', projectId)
    .single()

  if (fetchError) throw new Error('Failed to fetch current project')

  // Call the new database function
  const { error } = await supabase.rpc('update_project_position', {
    p_project_id: projectId,
    p_new_status: newStatus,
    p_new_position: newPosition,
    p_old_status: currentProject.status,
    p_old_position: currentProject.position ?? 0,
    p_user_id: user.id,
  })

  if (error) throw new Error('Failed to update project status and positions')

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
