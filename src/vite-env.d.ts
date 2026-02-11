/// <reference types="vite/client" />

declare module '*.svg' {
  const content: string
  export default content
}

interface Window {
  ethereum: any
  zE: any
}
