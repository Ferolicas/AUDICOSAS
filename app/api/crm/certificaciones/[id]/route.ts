import { NextRequest } from 'next/server'
import { certificacionByIdQuery } from '@/lib/crm/queries'
import { fetchById, updateDocument, deleteDocument, jsonOk, jsonError } from '@/lib/crm/api-helpers'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    const data = await fetchById(certificacionByIdQuery, id)
    if (!data) return jsonError('Certificación no encontrada', 404)
    return jsonOk(data)
  } catch { return jsonError('Error al obtener certificación', 500) }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    const body = await req.json()
    const doc = await updateDocument(id, body)
    return jsonOk(doc)
  } catch { return jsonError('Error al actualizar certificación', 500) }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    await deleteDocument(id)
    return jsonOk({ deleted: true })
  } catch { return jsonError('Error al eliminar certificación', 500) }
}
