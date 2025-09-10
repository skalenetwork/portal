import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'
import { UserConfigExport } from 'vite'
import { name } from './package.json'

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    css: {
      postcss: {
        plugins: [],
      },
    },
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      })
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name,
        formats: ['es', 'umd'],
        fileName: (format) => `${name}.${format}.js`,
      },
      rollupOptions: {
        maxParallelFileOps: 1,
        external: (id) =>
          /^(react(\/jsx-runtime)?|react-dom)(\/|$)/.test(id) ||
          /^@mui\/material(\/|$)/.test(id) ||
          /^@mui\/icons-material(\/|$)/.test(id) ||
          /^@emotion\/react(\/|$)/.test(id) ||
          /^@emotion\/styled(\/|$)/.test(id) ||
          /^@rainbow-me\/rainbowkit(\/|$)/.test(id) ||
          /^@tanstack\/react-query(\/|$)/.test(id) ||
          /^wagmi(\/|$)/.test(id) ||
          /^viem(\/|$)/.test(id),
        output: {
          globals: {
            react: 'React',
            'react/jsx-runtime': 'react/jsx-runtime',
            'react-dom': 'ReactDOM',
            '@mui/material': 'MaterialUI',
            '@mui/icons-material': 'MaterialIcons',
            '@emotion/react': 'EmotionReact',
            '@emotion/styled': 'EmotionStyled',
            '@rainbow-me/rainbowkit': 'RainbowKit',
            '@tanstack/react-query': 'ReactQuery',
            'wagmi': 'Wagmi',
            'viem': 'Viem'
          }
        }
      },
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  })
}

export default app