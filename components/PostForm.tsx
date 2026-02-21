'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UploadButton } from '@uploadthing/react'
import { createPost, updatePost } from '@/actions/posts'
import type { OurFileRouter } from '@/app/api/uploadthing/core'
import type { Post } from '@prisma/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

interface PostFormProps {
  post?: Post & { postCoverImage?: string | null }
}

export function PostForm({ post }: PostFormProps) {
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? '')
  const [postCoverImage, setPostCoverImage] = useState(post?.postCoverImage ?? '')
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)

  const action = post ? updatePost.bind(null, post.id) : createPost

  async function handleAction(formData: FormData) {
    formData.set('coverImage', coverImage)
    formData.set('postCoverImage', postCoverImage)
    await action(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form action={handleAction} className="space-y-6 max-w-3xl">
      {/* Card image */}
      <div className="space-y-3">
        <label className="block text-sm font-medium font-sans text-stone-700">Card Image (Home/Blog List)</label>

        {coverImage && (
          <div className="relative aspect-video w-full max-w-sm rounded overflow-hidden border border-stone-200">
            <Image src={coverImage} alt="Cover preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => setCoverImage('')}
              className="absolute top-2 right-2 bg-stone-900/70 text-white text-xs px-2 py-1 rounded hover:bg-stone-900"
            >
              Remove
            </button>
          </div>
        )}

        <UploadButton<OurFileRouter, 'coverImageUploader'>
          endpoint="coverImageUploader"
          onUploadBegin={() => setUploading(true)}
          onClientUploadComplete={(res) => {
            setUploading(false)
            if (res?.[0]) {
              // Support both url and ufsUrl depending on UploadThing version
              const url = (res[0] as { url?: string; ufsUrl?: string }).ufsUrl ?? res[0].url
              if (url) setCoverImage(url)
            }
          }}
          onUploadError={(error) => {
            setUploading(false)
            alert(`Upload failed: ${error.message}`)
          }}
          appearance={{
            button:
              'bg-stone-900 text-stone-50 hover:bg-stone-700 font-sans text-sm rounded px-4 py-2 font-medium ut-uploading:cursor-not-allowed',
            allowedContent: 'text-stone-400 text-xs font-sans',
          }}
        />
      </div>

      {/* Single post hero image */}
      <div className="space-y-3">
        <label className="block text-sm font-medium font-sans text-stone-700">
          Post Cover Image (Single Post Page)
        </label>

        {postCoverImage && (
          <div className="relative aspect-video w-full max-w-sm rounded overflow-hidden border border-stone-200">
            <Image src={postCoverImage} alt="Post cover preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => setPostCoverImage('')}
              className="absolute top-2 right-2 bg-stone-900/70 text-white text-xs px-2 py-1 rounded hover:bg-stone-900"
            >
              Remove
            </button>
          </div>
        )}

        <UploadButton<OurFileRouter, 'coverImageUploader'>
          endpoint="coverImageUploader"
          onUploadBegin={() => setUploading(true)}
          onClientUploadComplete={(res) => {
            setUploading(false)
            if (res?.[0]) {
              const url = (res[0] as { url?: string; ufsUrl?: string }).ufsUrl ?? res[0].url
              if (url) setPostCoverImage(url)
            }
          }}
          onUploadError={(error) => {
            setUploading(false)
            alert(`Upload failed: ${error.message}`)
          }}
          appearance={{
            button:
              'bg-stone-900 text-stone-50 hover:bg-stone-700 font-sans text-sm rounded px-4 py-2 font-medium ut-uploading:cursor-not-allowed',
            allowedContent: 'text-stone-400 text-xs font-sans',
          }}
        />
      </div>

      <Input
        name="title"
        label="Title"
        defaultValue={post?.title}
        required
        placeholder="Post title"
      />

      <Input
        name="slug"
        label="Slug"
        defaultValue={post?.slug}
        required
        placeholder="my-post-slug"
        pattern="[a-z0-9-]+"
        title="Lowercase letters, numbers, and hyphens only"
      />

      <Textarea
        name="excerpt"
        label="Excerpt"
        defaultValue={post?.excerpt}
        required
        rows={3}
        placeholder="A short description for the post card and SEO…"
      />

      <Textarea
        name="content"
        label="Content (MDX)"
        defaultValue={post?.content}
        required
        rows={24}
        placeholder="# Your post content&#10;&#10;Write MDX here…"
        className="font-mono text-xs"
      />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={uploading}>
          {post ? 'Save Changes' : 'Create Post'}
        </Button>
        {saved && (
          <span className="font-sans text-sm text-emerald-600">Saved!</span>
        )}
      </div>
    </form>
  )
}
