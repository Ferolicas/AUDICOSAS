import { NextResponse } from 'next/server'
import { sanityRead, sanityWrite, requireWrite } from '@/lib/sanity.server'
import { generateCodigo } from './idgen'

// ── Cache agresivo en memoria (patrón TuReporte) ──
const CACHE_TTL = 30 * 60 * 1000 // 30 minutos

interface CacheEntry {
  data: unknown[]
  map: Map<string, unknown>
  timestamp: number
}

const caches = new Map<string, CacheEntry>()

export function invalidateCache(query?: string) {
  if (query) {
    caches.delete(query)
  } else {
    caches.clear()
  }
}

// ── Response helpers con Cache-Control ──

export function jsonOk(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'private, max-age=60, stale-while-revalidate=300',
    },
  })
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

// ── Fetch con cache en memoria ──

export async function fetchAll(query: string) {
  const now = Date.now()
  const cached = caches.get(query)

  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data
  }

  const client = sanityRead()
  const data = await client.fetch(query)

  // Indexar por _id para lookups O(1)
  const map = new Map<string, unknown>()
  if (Array.isArray(data)) {
    for (const item of data) {
      if (item?._id) map.set(item._id, item)
    }
  }

  caches.set(query, { data: data || [], map, timestamp: now })
  return data || []
}

export async function fetchById(query: string, id: string) {
  const client = sanityRead()
  return client.fetch(query, { id })
}

// ── Write operations (invalidan cache) ──

export async function createDocument(type: string, countQuery: string, data: Record<string, unknown>) {
  requireWrite()
  const client = sanityWrite()
  const count = await client.fetch<number>(countQuery)
  const codigo = generateCodigo(type, count)
  const doc = await client.create({ _type: type, codigo, ...data })
  invalidateCache()
  return doc
}

export async function updateDocument(id: string, data: Record<string, unknown>) {
  requireWrite()
  const client = sanityWrite()
  const result = await client.patch(id).set(data).commit()
  invalidateCache()
  return result
}

export async function deleteDocument(id: string) {
  requireWrite()
  const client = sanityWrite()
  const result = await client.delete(id)
  invalidateCache()
  return result
}
