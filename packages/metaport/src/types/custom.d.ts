declare module '*.json' {
  const value: any
  export default value
}

declare module '*.svg' {
  const content: any
  export default content
}

declare module '*.png' {
  const content: any
  export default content
}

declare module '*.scss'

declare module 'node' {
  interface NodeRequire {
    context: (directory: string, useSubdirectories: boolean, regExp: RegExp, mode?: string) => any
  }
}

declare namespace NodeJS {
  interface Global {
    require: NodeRequire
  }
}

interface NodeRequire {
  context: (directory: string, useSubdirectories: boolean, regExp: RegExp, mode?: string) => any
}
