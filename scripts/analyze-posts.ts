import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const posts = await prisma.post.findMany()

    posts.forEach((p) => {
        // Attempt basic sentence counting
        // Filter out simple markdown syntax or empty string
        const sentences = p.content.split(/[.!?]+/).filter(s => s.trim().length > 3).length

        console.log(`--- POST: ${p.title} ---`)
        console.log(`Slug: ${p.slug}`)
        console.log(`Content length: ${p.content.length} chars`)
        console.log(`Sentences roughly: ${sentences}`)
        console.log(`Cover: ${p.coverImage}`)
        console.log(`=================\n`)
    })
}

main().finally(() => prisma.$disconnect())
