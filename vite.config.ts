import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import path from 'path'
import react from '@vitejs/plugin-react'
import mdx from "@mdx-js/rollup"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), mdx()],
  resolve: {
    alias: {
      '@skalenetwork/metaport': path.resolve(__dirname, 'packages/metaport/src'),
      ...(process.env.NODE_ENV !== 'production' ? {
        '@skalenetwork/metaport/dist/style.css': path.resolve(__dirname, 'packages/metaport/src/dist/style.css')
      } : {}),
      '@/core': path.resolve(__dirname, 'packages/core/src')
    }
  }
})
