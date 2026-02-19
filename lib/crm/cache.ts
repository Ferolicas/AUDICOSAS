// Cache centralizado del CRM - usado por api-helpers y /api/crm/all

const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

// ── Cache por query (usado por fetchAll en api-helpers) ──

interface CacheEntry {
  data: unknown[]
  map: Map<string, unknown>
  timestamp: number
}

const queryCaches = new Map<string, CacheEntry>()

export function getQueryCache(query: string): CacheEntry | undefined {
  const now = Date.now()
  const cached = queryCaches.get(query)
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached
  }
  return undefined
}

export function setQueryCache(query: string, data: unknown[]) {
  const map = new Map<string, unknown>()
  if (Array.isArray(data)) {
    for (const item of data) {
      if (item?._id) map.set(item._id, item)
    }
  }
  queryCaches.set(query, { data, map, timestamp: Date.now() })
}

// ── Cache global de /api/crm/all ──

let allCache: { data: unknown; timestamp: number } | null = null

export function getAllCache(): unknown | null {
  const now = Date.now()
  if (allCache && (now - allCache.timestamp) < CACHE_TTL) {
    return allCache.data
  }
  return null
}

export function setAllCache(data: unknown) {
  allCache = { data, timestamp: Date.now() }
}

// ── Invalidación central ──

export function invalidateAllCaches() {
  queryCaches.clear()
  allCache = null
}
