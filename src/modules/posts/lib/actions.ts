'use server'

import { createClient } from '@/lib/supabase/server'

export async function getPosts() {
  const supabase = createClient()

  const { data: posts, error } = await supabase.from('posts').select().order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch posts')
  }

  return posts
}

export async function addPost(formData: FormData) {
  const content = String(formData.get('content'))
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('posts').insert({ content, user_id: user!.id })

  if (error) {
    throw new Error('Failed to add post')
  }

  return { success: true }
}

export async function deletePost(formData: FormData) {
  const postId = String(formData.get('postId'))
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('posts').delete().match({ id: postId, user_id: user!.id })

  if (error) {
    throw new Error('Failed to delete post')
  }

  return { success: true }
}
