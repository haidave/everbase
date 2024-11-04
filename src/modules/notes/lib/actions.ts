'use server'

import { createClient } from '@/lib/supabase/server'
import { type Note } from '@/modules/api/types'

export async function getNotes() {
  const supabase = await createClient()

  const { data: notes, error } = await supabase.from('notes').select().order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch notes')
  }

  return notes
}

export async function getGroupedNotes(
  page: number = 1,
  limit: number = 20
): Promise<{ notes: Note[]; count: number | null }> {
  const supabase = await createClient()

  const from = (page - 1) * limit
  const to = from + limit - 1

  const {
    data: notes,
    error,
    count,
  } = await supabase
    .from('notes')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw new Error('Failed to fetch notes')
  }

  return { notes: notes as Note[], count }
}

export async function getNote(noteId: string) {
  const supabase = await createClient()

  const { data: note, error } = await supabase.from('notes').select('*').eq('id', noteId).single()

  if (error) {
    throw new Error('Failed to fetch note')
  }

  return note
}

export async function addNote(formData: FormData) {
  const content = String(formData.get('content'))
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('notes').insert({ content, user_id: user!.id })

  if (error) {
    throw new Error('Failed to add note')
  }

  return { success: true }
}

export async function updateNote(formData: FormData) {
  const noteId = String(formData.get('noteId'))
  const content = String(formData.get('content'))
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('notes').update({ content }).match({ id: noteId, user_id: user!.id })

  if (error) {
    throw new Error('Failed to update note')
  }

  return { success: true }
}

export async function deleteNote(formData: FormData) {
  const noteId = String(formData.get('noteId'))
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('notes').delete().match({ id: noteId, user_id: user!.id })

  if (error) {
    throw new Error('Failed to delete note')
  }

  return { success: true }
}
