import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Fallback to JS implementation when native oxide binary cannot be loaded in this environment.
process.env.TAILWIND_DISABLE_OXIDE = '1'
const tailwindcss = (await import('@tailwindcss/vite')).default

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
