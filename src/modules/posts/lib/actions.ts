'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function addPost(formData: FormData) {
  const content = String(formData.get('content'))
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase.from('posts').insert({ content, user_id: user.id })

  if (error) {
    throw new Error('Failed to add post')
  }

  revalidatePath('/dashboard') // Adjust this to your actual path
  return { success: true }
}

export async function deletePost(formData: FormData) {
  const postId = formData.get('postId') as string
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase.from('posts').delete().match({ id: postId, user_id: user.id })

  if (error) {
    throw new Error('Failed to delete post')
  }

  revalidatePath('/dashboard') // Adjust this to your actual path
  return { success: true }
}
