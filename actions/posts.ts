'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

async function requireAuth() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function createPost(formData: FormData) {
  const userId = await requireAuth()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const coverImage = (formData.get('coverImage') as string) || null
  const postCoverImage = (formData.get('postCoverImage') as string) || null

  const post = await prisma.post.create({
    data: { title, slug, excerpt, content, coverImage, postCoverImage, authorId: userId },
  })

  revalidatePath('/admin')
  redirect(`/admin/${post.id}`)
}

export async function updatePost(id: string, formData: FormData) {
  await requireAuth()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const coverImage = (formData.get('coverImage') as string) || null
  const postCoverImage = (formData.get('postCoverImage') as string) || null

  await prisma.post.update({
    where: { id },
    data: { title, slug, excerpt, content, coverImage, postCoverImage },
  })

  revalidatePath('/admin')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/')
}

export async function publishPost(id: string) {
  await requireAuth()

  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) throw new Error('Post not found')

  const nowPublishing = !post.published

  await prisma.post.update({
    where: { id },
    data: {
      published: nowPublishing,
      publishedAt: nowPublishing ? post.publishedAt ?? new Date() : post.publishedAt,
    },
  })

  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath(`/blog/${post.slug}`)
}

export async function deletePost(id: string) {
  await requireAuth()

  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) throw new Error('Post not found')

  await prisma.post.delete({ where: { id } })

  revalidatePath('/admin')
  revalidatePath('/')
  redirect('/admin')
}
