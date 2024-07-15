'use server'

import { format, parseISO } from 'date-fns'

import { createClient } from '@/lib/supabase/server'
import { type Tables } from '@/modules/api/generated/database.types'

export async function getNotes() {
  const supabase = createClient()

  const { data: notes, error } = await supabase.from('notes').select().order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch notes')
  }

  return notes
}

type Note = Tables<'notes'>

type GroupedNotes = {
  [date: string]: Note[]
}

export async function getGroupedNotes(): Promise<GroupedNotes> {
  const supabase = createClient()

  const { data: notes, error } = await supabase.from('notes').select().order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch notes')
  }

  const groupedNotes = (notes as Note[]).reduce<GroupedNotes>((acc, note) => {
    const date = parseISO(note.created_at)
    const formattedDate = format(date, 'MMMM d, yyyy')

    if (!acc[formattedDate]) {
      acc[formattedDate] = []
    }

    acc[formattedDate]?.push(note)

    return acc
  }, {})

  return groupedNotes
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
