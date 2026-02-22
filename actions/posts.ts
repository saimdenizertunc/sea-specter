'use server'

import { auth } from '@clerk/nextjs/server'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { enforceRateLimit } from '@/lib/rate-limit'

async function requireAuth() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

const postInputSchema = z.object({
  title: z
    .string({ required_error: 'Title is required.' })
    .trim()
    .min(1, 'Title is required.')
    .max(200, 'Title must be 200 characters or fewer.'),
  slug: z
    .string({ required_error: 'Slug is required.' })
    .trim()
    .min(1, 'Slug is required.')
    .max(200, 'Slug must be 200 characters or fewer.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase letters, numbers, and hyphens only.'),
  excerpt: z
    .string({ required_error: 'Excerpt is required.' })
    .trim()
    .min(1, 'Excerpt is required.')
    .max(600, 'Excerpt must be 600 characters or fewer.'),
  content: z
    .string({ required_error: 'Content is required.' })
    .trim()
    .min(1, 'Content is required.')
    .max(120000, 'Content is too long.'),
  coverImage: z
    .string()
    .trim()
    .url('Card image must be a valid URL.')
    .max(2048, 'Card image URL is too long.')
    .optional()
    .nullable(),
  postCoverImage: z
    .string()
    .trim()
    .url('Post cover image must be a valid URL.')
    .max(2048, 'Post cover image URL is too long.')
    .optional()
    .nullable(),
})

function parsePostInput(formData: FormData) {
  const result = postInputSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    coverImage: formData.get('coverImage') || null,
    postCoverImage: formData.get('postCoverImage') || null,
  })

  if (!result.success) {
    const issue = result.error.issues[0]
    throw new Error(issue?.message ?? 'Invalid form input.')
  }

  return result.data
}

function normalizeMutationError(error: unknown): never {
  if (error instanceof Error) {
    if (error.message === 'Unauthorized' || error.message.startsWith('Too many requests')) {
      throw error
    }
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new Error('A post with this slug already exists.')
    }
    if (error.code === 'P2025') {
      throw new Error('The post could not be found.')
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new Error('Post data failed validation. Please check the provided values.')
  }

  if (error instanceof Error && error.message) {
    throw new Error(error.message)
  }

  throw new Error('Unexpected error while saving post. Please try again.')
}

function applyMutationRateLimit(userId: string, actionName: string) {
  enforceRateLimit({
    key: `posts:${actionName}:${userId}`,
    limit: 30,
    windowMs: 60_000,
  })
}

export async function createPost(formData: FormData) {
  try {
    const userId = await requireAuth()
    applyMutationRateLimit(userId, 'create')
    const { title, slug, excerpt, content, coverImage, postCoverImage } = parsePostInput(formData)

    const post = await prisma.post.create({
      data: { title, slug, excerpt, content, coverImage, postCoverImage, authorId: userId },
    })

    revalidatePath('/admin')
    redirect(`/admin/${post.id}`)
  } catch (error) {
    normalizeMutationError(error)
  }
}

export async function updatePost(id: string, formData: FormData) {
  try {
    const userId = await requireAuth()
    applyMutationRateLimit(userId, 'update')
    const { title, slug, excerpt, content, coverImage, postCoverImage } = parsePostInput(formData)

    await prisma.post.update({
      where: { id },
      data: { title, slug, excerpt, content, coverImage, postCoverImage },
    })

    revalidatePath('/admin')
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/')
  } catch (error) {
    normalizeMutationError(error)
  }
}

export async function publishPost(id: string) {
  try {
    const userId = await requireAuth()
    applyMutationRateLimit(userId, 'publish')

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
  } catch (error) {
    normalizeMutationError(error)
  }
}

export async function deletePost(id: string) {
  try {
    const userId = await requireAuth()
    applyMutationRateLimit(userId, 'delete')

    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) throw new Error('Post not found')

    await prisma.post.delete({ where: { id } })

    revalidatePath('/admin')
    revalidatePath('/')
    redirect('/admin')
  } catch (error) {
    normalizeMutationError(error)
  }
}
