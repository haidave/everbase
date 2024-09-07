'use server'

import { parseISO } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

import { createClient } from '@/lib/supabase/server'
import { type GroupedNotes, type Note } from '@/modules/api/types'

export async function getNotes() {
  const supabase = createClient()

  const { data: notes, error } = await supabase.from('notes').select().order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch notes')
  }

  return notes
}

export async function getGroupedNotes(
  page: number = 1,
  limit: number = 20
): Promise<{ groupedNotes: GroupedNotes; count: number | null }> {
  const supabase = createClient()

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

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const groupedNotes = (notes as Note[]).reduce<GroupedNotes>((acc, note) => {
    const date = parseISO(note.created_at)
    const formattedDate = formatInTimeZone(date, userTimeZone, 'MMMM d, yyyy')

    if (!acc[formattedDate]) {
      acc[formattedDate] = []
    }

    acc[formattedDate]?.push(note)

    return acc
  }, {})

  return { groupedNotes, count }
}

export async function getNote(noteId: string) {
  const supabase = createClient()

  const { data: note, error } = await supabase.from('notes').select('*').eq('id', noteId).single()

  if (error) {
    throw new Error('Failed to fetch note')
  }

  return note
}

export async function addNote(formData: FormData) {
  const content = String(formData.get('content'))
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('notes').delete().match({ id: noteId, user_id: user!.id })

  if (error) {
    throw new Error('Failed to delete note')
  }

  return { success: true }
}
