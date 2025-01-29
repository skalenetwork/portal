import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'
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
      }),
      visualizer({
        filename: 'dist/bundle-analysis.html',
        gzipSize: true,
        brotliSize: true,
        open: true
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
        external: [
          'react',
          'react/jsx-runtime',
          'react-dom',
          '@mui/material',
          '@mui/icons-material',
          '@mui/lab',
          '@emotion/react',
          '@emotion/styled',
          '@rainbow-me/rainbowkit',
          '@tanstack/react-query',
          'wagmi',
          'viem'
        ],
        output: {
          globals: {
            react: 'React',
            'react/jsx-runtime': 'react/jsx-runtime',
            'react-dom': 'ReactDOM',
            '@mui/material': 'MaterialUI',
            '@mui/icons-material': 'MaterialIcons',
            '@mui/lab': 'MaterialLab',
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