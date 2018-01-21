// Allow JSON imports.
declare module '*.json' {
  const value: any
  export default value
}

// Shared types & interfaces.
type SideEffectArrow = () => void

interface IndexSignature {
  readonly [key: string]: any
}
