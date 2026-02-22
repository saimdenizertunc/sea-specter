import { PrismaClient } from '@prisma/client'
import { loadEnvConfig } from '@next/env'
import * as fs from 'fs'

// Load env vars
loadEnvConfig(process.cwd())

import { UTApi } from 'uploadthing/server'

const prisma = new PrismaClient()
const utapi = new UTApi()

const ASSETS_DIR = "C:\\Users\\saimd\\.gemini\\antigravity\\brain\\46401903-a3aa-47cf-8eba-2b94d85fa6fc"

async function uploadFile(fileName: string): Promise<string> {
    const filePath = `${ASSETS_DIR}\\${fileName}`
    const file = new File([fs.readFileSync(filePath)], fileName + '.png', { type: "image/png" })
    const uploadResult = await utapi.uploadFiles([file])

    if (uploadResult[0].error) throw new Error(`Upload failed for ${fileName}: ${uploadResult[0].error.message}`)
    return uploadResult[0].data!.url
}

async function main() {
    console.log('Uploading images to UploadThing...')

    // 1. Upload Images
    // Using comparison_opus_codex_hero for both hero and content of comparison to bypass rate limit
    const [
        photoHero, photoContent,
        webHero, webContent,
        speedHero, speedContent,
        compHero, compContent
    ] = await Promise.all([
        uploadFile("photography_ai_hero_1771722989119.png"),
        uploadFile("photography_ai_content_1771723003559.png"),
        uploadFile("web_contexts_hero_1771723023172.png"),
        uploadFile("web_contexts_content_1771723038426.png"),
        uploadFile("page_speed_hero_1771723059443.png"),
        uploadFile("page_speed_content_1771723072506.png"),
        uploadFile("comparison_opus_codex_hero_1771723088760.png"),
        uploadFile("comparison_opus_codex_hero_1771723088760.png") // Fallback duplicate due to API limit
    ])

    console.log('Images uploaded successfully!')

    // 2. Prepare MDX Content

    // Post: wetw (wrter) -> Populating content
    const mdxPhoto = `
<CloudImage src="${photoHero}" alt="Futuristic AI Camera Lens" />

<PullQuote>Light doesn't wait for anyone — not even the people who've spent their lives chasing it.</PullQuote>

The arrival of **Generative AI** hasn't just shaken the foundations of software engineering; it has firmly planted its flag in the world of professional photography and cinematography. For decades, capturing the perfect shot meant mastering physics—understanding the exact geometric relationships between light, a piece of glass, and a sensor.

Today, that paradigm is fracturing.

## The Algorithmic Lens

In professional studios, AI isn't simply replacing the photographer; it is fundamentally altering the conception of a "photograph."

<BarChart
  title="Impact of AI Across Media Production Phases"
  data={[
    { label: "Post-Production (Retouching/Grading)", value: 95, color: "var(--swaddle-ink, #0F0F0F)" },
    { label: "Pre-Production (Storyboarding)", value: 80, color: "rgba(15, 15, 15, 0.8)" },
    { label: "Production (Autofocus/Tracking)", value: 65, color: "rgba(15, 15, 15, 0.6)" },
  ]}
/>

When you press the shutter on a modern smartphone or a high-end mirrorless camera, you are no longer just capturing photons. You are triggering a massive computational pipeline. The camera immediately snaps dozens of frames, aligns them flawlessly, denoises them using **Deep Learning**, and generates a single synthetic image that often looks better than reality.

The line between "capturing" and "generating" has become permanently blurred.

<CloudImage src="${photoContent}" alt="Automated Drone Photography Studio" />

## Will the "Auteur" Survive?

<Callout type="warning" title="The Death of Pure Photography?">
Some purists argue that computational photography destroys the soul of the medium. But history proves that technology rarely destroys art; it merely forces it to evolve.
</Callout>

While AI can perfectly color-grade a wedding or generate a flawless product shot of a watch, it cannot yet understand **emotional subtext**. The human element—the ability to look at a scene, understand its cultural context, and purposefully break the rules of exposure to evoke a feeling—remains the exclusive domain of the human auteur.

<StatCard number="85%" label="Commercial Photography Workloads Automated by 2030" />

The future doesn't belong to purists who refuse to adapt. The future belongs to the hybrids: cinematographers who direct AI agents as effortlessly as they direct their lighting crew.
`

    // Post: test -> Evolution of Web Contexts
    const mdxWeb = `
<CloudImage src="${webHero}" alt="Complex Web Development Architecture Grid" />

<PullQuote>The web is no longer a collection of documents; it is a continuously evolving, distributed operating system.</PullQuote>

If you look back ten years, web development was relatively straightforward. You requested an HTML document, the server assembled it, and the browser displayed it. 

Today, building a robust web application means navigating an incredibly complex web of **rendering contexts**. The paradigm has shifted entirely, forcing developers to balance tradeoffs between the client, the origin server, and the edge networks in between.

## The Great Rendering Debate

<CloudImage src="${webContent}" alt="Data Packets at Lightspeed" caption="Modern architectures heavily rely on Edge nodes." />

We have moved away from the binary choice of **Server-Side Rendering (SSR)** versus **Client-Side Rendering (CSR)**. Modern frameworks like Next.js give us a vast arsenal of rendering techniques to solve specific UX problems.

*   **Static Site Generation (SSG):** Pre-rendering at build time. Incredibly fast and cheap, perfect for marketing pages and blogs.
*   **Server-Side Rendering (SSR):** Fetching data on every request. Slower Time To First Byte (TTFB), but guarantees fresh data and excellent SEO.
*   **Edge Rendering:** Executing middleware and rendering code geographically close to the user out of a CDN node. This bridges the gap between the speed of SSG and the dynamic nature of SSR.
*   **Client Components:** Pushing interactivity back to the browser only when absolutely necessary, minimizing the Javascript bundle size.

<Callout type="success" title="The Golden Rule">
Always render as close to your user as possible, and as far from their device as necessary.
</Callout>

The most effective engineers aren't just writing React code anymore. They are orchestrating **application state** across a global network.

<StatCard number="75%" label="Modern Web Apps Using Hybrid Rendering" />
`

    // Post: test2 -> Fast Loading Speeds
    const mdxSpeed = `
<CloudImage src="${speedHero}" alt="Extreme Speed Hyper-Drive Tunnel" />

<PullQuote>In the digital economy, performance isn't just a technical metric. It is your revenue.</PullQuote>

We live in an era of near-infinite computational power, yet the web is often agonizingly slow. Despite devices getting vastly faster, developers continue to ship exponentially larger Javascript bundles, completely neutralizing hardware gains.

We need to talk about **Core Web Vitals** and why treating speed as an afterthought is killing your product.

## The Metrics That Matter

If your application feels sluggish, users will simply leave. Amazon famously calculated that a page load slowdown of just one second could cost them **$1.6 billion** in sales per year. 

<CloudImage src="${speedContent}" alt="Digital Stopwatch Breaking Apart" />

Google now directly penalizes websites that fail to meet critical performance thresholds. Consider the three main pillars:

*   **Largest Contentful Paint (LCP):** Measures *loading* performance. Your main image or text block must render within 2.5 seconds.
*   **Interaction to Next Paint (INP):** Measures *responsiveness*. When a user clicks a button, the visual feedback must occur within 200 milliseconds.
*   **Cumulative Layout Shift (CLS):** Measures *visual stability*. Elements shouldn't jump around the screen as images and fonts load in.

<BarChart
  title="Conversion Rate Drop-off (Per Second of Delay)"
  data={[
    { label: "1 Second", value: 7, color: "var(--swaddle-ink, #0F0F0F)" },
    { label: "3 Seconds", value: 32, color: "rgba(15, 15, 15, 0.8)" },
    { label: "5 Seconds", value: 90, color: "rgba(15, 15, 15, 0.6)" },
  ]}
/>

<Callout type="danger" title="Stop Blaming React">
The framework isn't inherently slow; your architecture is. Loading massive video backgrounds, rendering thousands of DOM nodes unseen, and blocking the main thread with heavy analytics scripts are entirely self-inflicted wounds.
</Callout>
`

    // Post: comparison -> Formatting existing content
    const mdxComp = `
<CloudImage src="${compHero}" alt="Clash Between Two Advanced AI Neural Networks" />

<PullQuote>The AI coding landscape is fundamentally fractured between two entirely different philosophies of model architecture.</PullQuote>

We are currently in an AI model renaissance. Engineers are flooded with new tools practically every week. But when it comes to everyday, production-grade coding tasks, two specific Heavyweights dominate the conversation: **Anthropic's Opus 4.6** and **OpenAI's hypothetical Codex 5.3**.

Let's do a realistic comparison of their capabilities, cutting through the marketing noise to see how they perform in the trenches.

## Context Windows and Reasoning

The deciding factor in an AI's usefulness is no longer just how much code it "knows." It is about how much context it can hold simultaneously without *hallucinating*.

<CloudImage src="${compContent}" alt="Two AI Streams Traversing Code Holograms" />

*   **Opus 4.6:** Anthropic's flagship model shines in deep, massive refactorings. Its near-perfect recall across a massive context window means you can feed it your entire \`src\` directory, and it will correctly understand complex dependency graphs between distant files.
*   **Codex 5.3:** OpenAI excels in zero-shot, logical reasoning. It is significantly faster and better at "inventing" complex algorithms from scratch or solving leetcode-style algorithmic bottlenecks where raw logic overtakes deep architectural knowledge.

<Callout type="info" title="The Verdict on Context">
If you need to rewrite a legacy Java codebase into Go, use Opus. If you need to optimize a highly specific graphics rendering loop, use Codex.
</Callout>

## Everyday Vibe Coding

The future belongs to the engineers who know how to wield both. In the era of "vibe coding," you don't stick to a single model. You use an orchestrator—like Cursor or Claude Code—that intelligently routes your prompt to the best available model.

<StatCard number="2x" label="Efficiency Gain by Orchestrating Multiple Models" />

The true skill is no longer writing the syntax; it is understanding which "brain" to query for the right problem.
`

    // 3. Update the Database
    console.log('Updating database...')

    await prisma.post.update({
        where: { slug: 'wetw' },
        data: { content: mdxPhoto, coverImage: photoHero, postCoverImage: photoHero, title: 'The Algorithmic Auteur: The Future of Photography' }
    })

    await prisma.post.update({
        where: { slug: 'test' },
        data: { content: mdxWeb, coverImage: webHero, postCoverImage: webHero, title: 'The Evolution of Web Rendering Contexts' }
    })

    await prisma.post.update({
        where: { slug: 'test2' },
        data: { content: mdxSpeed, coverImage: speedHero, postCoverImage: speedHero, title: 'Why Fast Loading Speeds Dictate Your Revenue' }
    })

    await prisma.post.update({
        where: { slug: 'comparison' },
        data: { content: mdxComp, coverImage: compHero, postCoverImage: compHero }
    })

    console.log('All posts successfully updated!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
