import { NextRequest } from 'next/server'
import { allConsultoriasQuery, consultoriaCountQuery } from '@/lib/crm/queries'
import { consultoriaSchema } from '@/lib/crm/schemas'
import { fetchAll, createDocument, jsonOk, jsonError } from '@/lib/crm/api-helpers'

export async function GET() {
  const data = await fetchAll(allConsultoriasQuery)
  return jsonOk(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = consultoriaSchema.safeParse(body)
  if (!parsed.success) return jsonError(parsed.error.issues[0].message)
  const { clienteId, ...rest } = parsed.data
  const doc = await createDocument('crmConsultoria', consultoriaCountQuery, {
    ...rest,
    cliente: { _type: 'reference', _ref: clienteId },
  })
  return jsonOk(doc, 201)
}
