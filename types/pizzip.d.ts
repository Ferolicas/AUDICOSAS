declare module 'pizzip' {
  class PizZip {
    constructor(data?: string | ArrayBuffer | Uint8Array, options?: Record<string, unknown>)
    generate(options?: { type?: string; compression?: string }): Buffer
    file(name: string): { asText(): string; asBinary(): string } | null
  }
  export = PizZip
}
