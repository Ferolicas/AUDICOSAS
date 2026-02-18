import { createClient, type SanityClient } from '@sanity/client'
import { unstable_cache } from 'next/cache'

const projectId = process.env.SANITY_PROJECT_ID || ''
const dataset = process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2023-10-10'
const token = process.env.SANITY_WRITE_TOKEN

function buildClient(useCdn: boolean, withToken: boolean): SanityClient {
  if (!projectId) throw new Error('SANITY_PROJECT_ID no configurado')
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: withToken ? token : undefined,
    useCdn,
  })
}

let _read: SanityClient | null = null
let _write: SanityClient | null = null

export function sanityRead(): SanityClient {
  if (!_read) _read = buildClient(true, false)
  return _read
}

export function sanityWrite(): SanityClient {
  if (!_write) _write = buildClient(false, true)
  return _write
}

export function requireWrite() {
  if (!token) throw new Error('SANITY_WRITE_TOKEN no configurado')
}

/** Cached Sanity fetch - results cached for `revalidate` seconds (default 30s) */
export function cachedFetch<T>(query: string, params?: Record<string, unknown>, tags?: string[]) {
  const fn = async () => sanityRead().fetch<T>(query, params || {})
  return unstable_cache(fn, [query, JSON.stringify(params || {})], {
    revalidate: 30,
    tags: tags || ['crm'],
  })()
}
