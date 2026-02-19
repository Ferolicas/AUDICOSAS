import { NextRequest } from 'next/server'
import { allClientesQuery, clienteCountQuery } from '@/lib/crm/queries'
import { clienteSchema } from '@/lib/crm/schemas'
import { fetchAll, createDocument, jsonOk, jsonError } from '@/lib/crm/api-helpers'

export async function GET() {
  try {
    const data = await fetchAll(allClientesQuery)
    return jsonOk(data)
  } catch { return jsonError('Error al obtener clientes', 500) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = clienteSchema.safeParse(body)
    if (!parsed.success) return jsonError(parsed.error.issues[0].message)
    const doc = await createDocument('crmCliente', clienteCountQuery, {
      ...parsed.data,
      fechaAlta: new Date().toISOString().split('T')[0],
      certificaciones: [],
    })
    return jsonOk(doc, 201)
  } catch { return jsonError('Error al crear cliente', 500) }
}
