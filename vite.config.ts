import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from "@mdx-js/rollup"
import vercel from 'vite-plugin-vercel';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx(), vercel()]
  // assetsInclude: ["**/*.mdx"]
})
