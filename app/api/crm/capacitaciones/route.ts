import { NextRequest } from 'next/server'
import { allCapacitacionesQuery, capacitacionCountQuery } from '@/lib/crm/queries'
import { capacitacionSchema } from '@/lib/crm/schemas'
import { fetchAll, createDocument, jsonOk, jsonError } from '@/lib/crm/api-helpers'

export async function GET() {
  const data = await fetchAll(allCapacitacionesQuery)
  return jsonOk(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = capacitacionSchema.safeParse(body)
  if (!parsed.success) return jsonError(parsed.error.issues[0].message)
  const { clienteId, ...rest } = parsed.data
  const doc = await createDocument('crmCapacitacion', capacitacionCountQuery, {
    ...rest,
    cliente: { _type: 'reference', _ref: clienteId },
  })
  return jsonOk(doc, 201)
}
