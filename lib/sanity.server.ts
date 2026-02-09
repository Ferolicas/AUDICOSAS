import { createClient, type SanityClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID || ''
const dataset = process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2023-10-10'
const token = process.env.SANITY_WRITE_TOKEN

function buildClient(withToken: boolean): SanityClient {
  if (!projectId) throw new Error('SANITY_PROJECT_ID no configurado')
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: withToken ? token : undefined,
    useCdn: false,
  })
}

let _read: SanityClient | null = null
let _write: SanityClient | null = null

export function sanityRead(): SanityClient {
  if (!_read) _read = buildClient(false)
  return _read
}

export function sanityWrite(): SanityClient {
  if (!_write) _write = buildClient(true)
  return _write
}

export function requireWrite() {
  if (!token) throw new Error('SANITY_WRITE_TOKEN no configurado')
}
