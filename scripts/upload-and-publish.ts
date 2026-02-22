import { PrismaClient } from '@prisma/client'
import { loadEnvConfig } from '@next/env'
import * as fs from 'fs'
import * as path from 'path'

// Load env vars
loadEnvConfig(process.cwd())

import { UTApi } from 'uploadthing/server'

const prisma = new PrismaClient()
const utapi = new UTApi()

async function main() {
    console.log('Uploading images to UploadThing...')

    // Paths to the new generated images
    const heroPath = "C:\\Users\\saimd\\.gemini\\antigravity\\brain\\46401903-a3aa-47cf-8eba-2b94d85fa6fc\\future_ai_hero_bold_1771722663333.png"
    const vibePath = "C:\\Users\\saimd\\.gemini\\antigravity\\brain\\46401903-a3aa-47cf-8eba-2b94d85fa6fc\\vibe_coding_bold_1771722680351.png"

    const f1 = new File([fs.readFileSync(heroPath)], "future_ai_hero_bold.png", { type: "image/png" })
    const f2 = new File([fs.readFileSync(vibePath)], "vibe_coding_bold.png", { type: "image/png" })

    const uploadResults = await utapi.uploadFiles([f1, f2])

    if (uploadResults.some(r => r.error)) {
        console.error('Upload failed', uploadResults)
        process.exit(1)
    }

    const heroUrl = uploadResults[0].data!.url
    const vibeUrl = uploadResults[1].data!.url

    console.log('Images uploaded successfully!')
    console.log('Hero URL:', heroUrl)
    console.log('Vibe URL:', vibeUrl)

    const mdxContent = `
<CloudImage src="${heroUrl}" alt="Bold Futuristic AI and Software Engineering" />

<PullQuote>The landscape of software engineering has shifted at a breakneck pace.</PullQuote>

Since the massive explosion of generative AI in 2022, the **landscape of software engineering** has shifted at a breakneck pace. We are no longer just talking about autocomplete tools; we are entering an era of **autonomous coding agents**.

Based on insights from industry veterans—including an Apple Research Engineer—here is a deep dive into the current state of the AI wars, the rise of "vibe coding," and what it all means for the **future of developers**.

## The State of the AI Giants

The AI ecosystem is currently a high-stakes battleground, with each major player carving out a distinct strategy:

<BarChart
  title="Estimated Enterprise & Consumer AI Focus (Mock)"
  data={[
    { label: "OpenAI (Consumer)", value: 95, color: "var(--swaddle-ink, #0F0F0F)" },
    { label: "Google (Enterprise/Inference)", value: 85, color: "rgba(15, 15, 15, 0.8)" },
    { label: "Meta (Open-Source)", value: 75, color: "rgba(15, 15, 15, 0.6)" },
    { label: "Apple (Integration)", value: 60, color: "rgba(15, 15, 15, 0.4)" },
  ]}
/>

*   **OpenAI:** Currently dominating the consumer market, **ChatGPT** has an estimated market share 10 times larger than its competitors. However, this dominance comes at a massive cost; the company is burning through cash at an astonishing rate to sustain inference costs.
*   **Google & Anthropic:** heavily targeting the **enterprise market**. Google has a massive advantage due to its deep pockets and highly efficient inference infrastructure, allowing it to outlast competitors when funding dries up.
*   **Meta:** Driven by the fear of missing out on **Artificial General Intelligence (AGI)**, Mark Zuckerberg is aggressively investing billions into the open-source **Llama models**.
*   **Apple:** Taking a pragmatic approach. Rather than burning billions to build a model from scratch, they partnered with Google to integrate Gemini into their devices, allowing them to win simply by **keeping their money**.

## The Rise of "Vibe Coding"

<Callout type="warning" title="A Paradigm Shift">
We are witnessing the death of traditional coding. For many engineers, the days of opening an IDE and writing code line-by-line are over.
</Callout>

The industry is rapidly pivoting to **"vibe coding"**—using CLI-based AI agents like Claude Code, Cursor, or OpenDevin.

<CloudImage src="${vibeUrl}" alt="Vibe Coding workstation with AI holographic rings" caption="The new interface of development." />

Today's workflow looks entirely different. An engineer can simply **speak into a microphone**, outline a complex architectural plan, and let the agent take over. 

The AI will break the project into 10 phases, ask clarifying questions, read relevant documentation, write the code, and even write the commits. Engineers are transitioning their role from **"code writers"** to **"code reviewers"**.

<StatCard number="10x-20x" label="Developer Productivity Boost" />

## The Junior Developer Dilemma

This incredible boost in productivity comes with a dark side. New engineers are caught in a massive catch-22. To remain competitive, they *must* use AI coding agents.

However, by outsourcing the actual coding to AI, they are losing the opportunity to build **fundamental muscle memory**. Engineers gain their deep expertise and "battle scars" by struggling through complex debugging sessions and system failures. If an AI solves every bug for you, you never learn how the underlying systems work.

Even senior engineers are feeling the effects; relying too heavily on AI can cause you to forget simple syntax. When an AI-generated system inevitably crashes, companies will desperately need **engineers who deeply understand the core logic**—but the current training environment is failing to produce them.

## Will Software Engineers Become Obsolete?

The short answer is **no**, but the role will drastically change.

While AI is incredibly proficient at handling 99% of standard software tasks, it struggles with the remaining 1%—the highly niche, specialized edge cases. The value of the human engineer will be placing the **"keystone"** on top of the AI's work.

<Callout type="success" title="The Future Workspace">
As the cost of software creation plummets, engineering power will flood into industries that have historically lacked good software. We will see AI-empowered engineers revolutionizing outdated systems in fields like aviation, medicine, and local businesses.
</Callout>

The engineers who survive and thrive won't be the ones writing standard boilerplate code; they will be the ones who master **AI orchestration**, **system architecture**, and **deep problem-solving**.
`

    const slug = 'future-of-software-engineering-ai-vibe-coding'

    const post = await prisma.post.update({
        where: { slug },
        data: {
            content: mdxContent,
            coverImage: heroUrl,
            postCoverImage: heroUrl,
        }
    })

    console.log('Post updated successfully via Upsert:', post.slug)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
