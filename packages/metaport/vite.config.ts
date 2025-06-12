import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'
import { UserConfigExport } from 'vite'
import { name } from './package.json'

const fixWagmiImports = () => ({
  name: 'fix-wagmi-imports',
  load(id: string) {
    if (id.includes('@wagmi/core/dist/esm/actions/getCallsStatus.js')) {
      return `
        import { getCallsStatus as viem_getCallsStatus } from 'viem/experimental';
        import { getConnectorClient } from './getConnectorClient.js';
        export async function getCallsStatus(config, parameters) {
          const { connector, id } = parameters;
          const client = await getConnectorClient(config, { connector });
          return viem_getCallsStatus(client, { id });
        }
      `;
    }
    if (id.includes('@wagmi/core/dist/esm/actions/getCapabilities.js')) {
      return `
        import { getCapabilities as viem_getCapabilities } from 'viem/experimental';
        import { getConnectorClient } from './getConnectorClient.js';
        export async function getCapabilities(config, parameters = {}) {
          const { connector } = parameters;
          const client = await getConnectorClient(config, { connector });
          return viem_getCapabilities(client);
        }
      `;
    }
    if (id.includes('@wagmi/core/dist/esm/actions/sendCalls.js')) {
      return `
        import { sendCalls as viem_sendCalls } from 'viem/experimental';
        import { getConnectorClient } from './getConnectorClient.js';
        export async function sendCalls(config, parameters) {
          const { connector, ...rest } = parameters;
          const client = await getConnectorClient(config, { connector });
          return viem_sendCalls(client, rest);
        }
      `;
    }
    if (id.includes('@wagmi/core/dist/esm/actions/showCallsStatus.js')) {
      return `
        import { showCallsStatus as viem_showCallsStatus } from 'viem/experimental';
        import { getConnectorClient } from './getConnectorClient.js';
        export async function showCallsStatus(config, parameters) {
          const { connector, id } = parameters;
          const client = await getConnectorClient(config, { connector });
          return viem_showCallsStatus(client, { id });
        }
      `;
    }
    if (id.includes('@wagmi/core/dist/esm/actions/waitForCallsStatus.js')) {
      return `
        import { getConnectorClient } from './getConnectorClient.js';
        export async function waitForCallsStatus(config, parameters) {
          throw new Error('waitForCallsStatus is not available in this version of viem');
        }
      `;
    }
    return null;
  }
});

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    css: {
      postcss: {
        plugins: [],
      },
    },
    plugins: [
      react(),
      fixWagmiImports(),
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