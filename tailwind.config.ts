import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        '10xl': ['8rem', { lineHeight: '1' }],
        '11xl': ['10rem', { lineHeight: '1' }],
      },
      colors: {
        swaddle: {
          base: '#F5F5F5',
          ink: '#0F0F0F',
        }
      }
    },
  },
  plugins: [typography],
}

export default config
