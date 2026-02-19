import { NextRequest } from 'next/server'
import { allDesarrolloQuery, desarrolloCountQuery } from '@/lib/crm/queries'
import { desarrolloSchema } from '@/lib/crm/schemas'
import { fetchAll, createDocument, jsonOk, jsonError } from '@/lib/crm/api-helpers'

export async function GET() {
  try {
    const data = await fetchAll(allDesarrolloQuery)
    return jsonOk(data)
  } catch { return jsonError('Error al obtener proyectos', 500) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = desarrolloSchema.safeParse(body)
    if (!parsed.success) return jsonError(parsed.error.issues[0].message)
    const doc = await createDocument('crmDesarrollo', desarrolloCountQuery, parsed.data)
    return jsonOk(doc, 201)
  } catch { return jsonError('Error al crear proyecto', 500) }
}
