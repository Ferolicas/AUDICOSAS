import { NextRequest } from 'next/server'
import { allDesarrolloQuery, desarrolloCountQuery } from '@/lib/crm/queries'
import { desarrolloSchema } from '@/lib/crm/schemas'
import { fetchAll, createDocument, jsonOk, jsonError } from '@/lib/crm/api-helpers'

export async function GET() {
  const data = await fetchAll(allDesarrolloQuery)
  return jsonOk(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = desarrolloSchema.safeParse(body)
  if (!parsed.success) return jsonError(parsed.error.issues[0].message)
  const doc = await createDocument('crmDesarrollo', desarrolloCountQuery, parsed.data)
  return jsonOk(doc, 201)
}
