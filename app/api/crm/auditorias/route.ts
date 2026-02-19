import { NextRequest } from 'next/server'
import { allAuditoriasQuery, auditoriaCountQuery } from '@/lib/crm/queries'
import { auditoriaSchema } from '@/lib/crm/schemas'
import { fetchAll, createDocument, jsonOk, jsonError } from '@/lib/crm/api-helpers'

export async function GET() {
  try {
    const data = await fetchAll(allAuditoriasQuery)
    return jsonOk(data)
  } catch { return jsonError('Error al obtener auditorías', 500) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = auditoriaSchema.safeParse(body)
    if (!parsed.success) return jsonError(parsed.error.issues[0].message)
    const { clienteId, ...rest } = parsed.data
    const doc = await createDocument('crmAuditoria', auditoriaCountQuery, {
      ...rest,
      cliente: { _type: 'reference', _ref: clienteId },
    })
    return jsonOk(doc, 201)
  } catch { return jsonError('Error al crear auditoría', 500) }
}
