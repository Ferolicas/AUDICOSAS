import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { sanityRead, sanityWrite, requireWrite } from '@/lib/sanity.server'
import { generateCodigo } from './idgen'
import { getQueryCache, setQueryCache, invalidateAllCaches } from './cache'
import { getPusherServer, CRM_CHANNEL, CRM_EVENT } from '@/lib/pusher.server'

// ── Response helpers ──

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

// ── Pusher broadcast (fire and forget) ──

function broadcast(action: 'created' | 'updated' | 'deleted', type: string) {
  getPusherServer()
    .trigger(CRM_CHANNEL, CRM_EVENT, { action, type })
    .catch((err) => console.error('[Pusher] broadcast error:', err))
}

// ── Fetch con cache en memoria ──

export async function fetchAll(query: string) {
  const cached = getQueryCache(query)
  if (cached) return cached.data

  const client = sanityRead()
  const data = await client.fetch(query)
  const result = data || []
  setQueryCache(query, result)
  return result
}

export async function fetchById(query: string, id: string) {
  const client = sanityRead()
  return client.fetch(query, { id })
}

// ── Write operations (invalidan cache + notifican en tiempo real) ──

export async function createDocument(type: string, countQuery: string, data: Record<string, unknown>) {
  requireWrite()
  const client = sanityWrite()
  const count = await client.fetch<number>(countQuery)
  const codigo = generateCodigo(type, count)
  const doc = await client.create({ _type: type, codigo, ...data })
  invalidateAllCaches()
  revalidateTag('crm')
  broadcast('created', type)
  return doc
}

export async function updateDocument(id: string, data: Record<string, unknown>, type = 'unknown') {
  requireWrite()
  const client = sanityWrite()
  const result = await client.patch(id).set(data).commit()
  invalidateAllCaches()
  revalidateTag('crm')
  broadcast('updated', type)
  return result
}

export async function deleteDocument(id: string, type = 'unknown') {
  requireWrite()
  const client = sanityWrite()
  const result = await client.delete(id)
  invalidateAllCaches()
  revalidateTag('crm')
  broadcast('deleted', type)
  return result
}
