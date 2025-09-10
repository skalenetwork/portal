import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import mdx from "@mdx-js/rollup"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx()],
  resolve: {
    alias: {
      '@skalenetwork/metaport': path.resolve(__dirname, 'packages/metaport/src'),
      '@skalenetwork/metaport/dist/style.css': path.resolve(__dirname, 'packages/metaport/src/dist/style.css'),
      '@/core': path.resolve(__dirname, 'packages/core/src')
    }
  }
})
