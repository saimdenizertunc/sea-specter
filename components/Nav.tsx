'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Archive' },
  { href: '/admin', label: 'Admin' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Fixed header — mix-blend-difference makes it visible on any background */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 mix-blend-difference">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-serif text-xl text-white tracking-tight"
        >
          sea-specter
        </Link>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex flex-col gap-[5px] p-1"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span
            className={cn(
              'block h-px w-7 bg-white transition-transform duration-300 ease-in-out origin-center',
              open && 'translate-y-[7px] rotate-45',
            )}
          />
          <span
            className={cn(
              'block h-px w-7 bg-white transition-opacity duration-200',
              open && 'opacity-0',
            )}
          />
          <span
            className={cn(
              'block h-px w-7 bg-white transition-transform duration-300 ease-in-out origin-center',
              open && '-translate-y-[7px] -rotate-45',
            )}
          />
        </button>
      </header>

      {/* Full-screen overlay nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-stone-950 flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-5xl md:text-7xl text-stone-100 hover:italic transition-all duration-200 leading-none"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-8 font-sans text-xs text-stone-600 tracking-widest uppercase"
            >
              sea-specter
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
