import { NextRequest } from 'next/server'
import { allCertificacionesQuery, certificacionCountQuery } from '@/lib/crm/queries'
import { certificacionSchema } from '@/lib/crm/schemas'
import { fetchAll, createDocument, jsonOk, jsonError } from '@/lib/crm/api-helpers'

export async function GET() {
  try {
    const data = await fetchAll(allCertificacionesQuery)
    return jsonOk(data)
  } catch { return jsonError('Error al obtener certificaciones', 500) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = certificacionSchema.safeParse(body)
    if (!parsed.success) return jsonError(parsed.error.issues[0].message)
    const { clienteId, ...rest } = parsed.data
    const doc = await createDocument('crmCertificacion', certificacionCountQuery, {
      ...rest,
      cliente: { _type: 'reference', _ref: clienteId },
    })
    return jsonOk(doc, 201)
  } catch { return jsonError('Error al crear certificación', 500) }
}
