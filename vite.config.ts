import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), react(), mdx()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } }
})
