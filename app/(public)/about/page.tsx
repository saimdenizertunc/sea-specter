import Image from 'next/image'
import { FadeIn } from '@/components/FadeIn'

export const metadata = {
    title: 'About | sea-specter',
    description: 'The story and mission behind sea-specter.',
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-swaddle-base text-swaddle-ink pt-32 pb-24 selection:bg-stone-300 selection:text-stone-900">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
                <FadeIn>
                    <h1 className="font-serif text-6xl md:text-8xl tracking-tight leading-[0.9] text-center mb-16 uppercase">
                        Demystifying
                        <br />
                        <span className="italic text-stone-600">The Depth</span>
                    </h1>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div className="w-full aspect-video md:aspect-[21/9] relative mb-20 overflow-hidden bg-stone-200">
                        <Image
                            src="/about-hero.png"
                            alt="Abstract representation of technology"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 font-sans md:text-lg leading-relaxed text-stone-800">

                    <div className="md:col-span-8 md:col-start-3 space-y-12">

                        <FadeIn delay={0.2}>
                            <section>
                                <h2 className="font-serif text-4xl mb-6">The Mission</h2>
                                <p className="mb-4">
                                    Welcome to <strong>sea-specter</strong>—a space dedicated to exploring the uncharted territories of software engineering, system design, and the architecture of the web.
                                </p>
                                <p>
                                    Technology moves at an unrelenting pace. It's easy to get lost in the noise of new frameworks and trending libraries. Our mission is to cut through that noise, focusing on the fundamental principles, the elegant architectures, and the unseen depths of code that power the modern digital world.
                                </p>
                            </section>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <div className="w-full h-px bg-stone-300 my-12" />
                        </FadeIn>

                        <FadeIn delay={0.4}>
                            <section>
                                <h2 className="font-serif text-4xl mb-6">What Makes Us Different</h2>
                                <p className="mb-6">
                                    We believe that understanding the *why* is just as crucial as knowing the *how*.
                                    Rather than just offering surface-level tutorials, we strive to dissect complex systems.
                                    We explore the trade-offs, the performance implications, and the design decisions that distinguish a good system from an exceptional one.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                                    <div className="p-6 border border-stone-300">
                                        <h3 className="font-serif text-xl mb-3">Deep Dives</h3>
                                        <p className="text-stone-600 text-sm">Comprehensive analyses of intricate technical concepts, breaking them down into digestible insights.</p>
                                    </div>
                                    <div className="p-6 border border-stone-300">
                                        <h3 className="font-serif text-xl mb-3">Accessible Design</h3>
                                        <p className="text-stone-600 text-sm">Technical writing doesn't have to be dry. We pair complex topics with premium aesthetics and readable typography.</p>
                                    </div>
                                </div>
                            </section>
                        </FadeIn>

                        <FadeIn delay={0.5}>
                            <div className="w-full h-px bg-stone-300 my-12" />
                        </FadeIn>

                        <FadeIn delay={0.6}>
                            <section className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="shrink-0 relative w-32 h-32 md:w-48 md:h-48 overflow-hidden bg-stone-200 grayscale contrast-125">
                                    <Image
                                        src="/author.png"
                                        alt="Author silhouette"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="font-serif text-4xl mb-4">The Author</h2>
                                    <p className="mb-4">
                                        I'm a software engineer passionate about scalable architecture and the art of programming. With a background spanning various domains of the tech industry, I built sea-specter as a notebook to share my findings, document discoveries, and contribute to the broader engineering community.
                                    </p>
                                    <p className="text-stone-600 italic">
                                        "Code is read much more often than it is written."
                                    </p>
                                </div>
                            </section>
                        </FadeIn>

                        <FadeIn delay={0.7}>
                            <div className="mt-20 text-center">
                                <a
                                    href="/blog"
                                    className="inline-block px-8 py-4 bg-swaddle-ink text-swaddle-base font-serif text-xl md:text-2xl hover:bg-stone-800 transition-colors uppercase tracking-widest"
                                >
                                    Explore the Archive
                                </a>
                            </div>
                        </FadeIn>

                    </div>
                </div>
            </div>
        </div>
    )
}
