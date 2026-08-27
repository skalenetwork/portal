/// <reference types="vite/client" />

declare module '*.svg' {
  const content: string
  export default content
}

interface Window {
  ethereum: any
  zE: any
}

declare module '*.mdx' {
  import type { ComponentType } from 'react'
  const MDXComponent: ComponentType<Record<string, unknown>>
  export default MDXComponent
}
