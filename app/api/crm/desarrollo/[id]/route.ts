import { NextRequest } from 'next/server'
import { desarrolloByIdQuery } from '@/lib/crm/queries'
import { fetchById, updateDocument, deleteDocument, jsonOk, jsonError } from '@/lib/crm/api-helpers'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    const data = await fetchById(desarrolloByIdQuery, id)
    if (!data) return jsonError('Proyecto no encontrado', 404)
    return jsonOk(data)
  } catch { return jsonError('Error al obtener proyecto', 500) }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    const body = await req.json()
    const doc = await updateDocument(id, body)
    return jsonOk(doc)
  } catch { return jsonError('Error al actualizar proyecto', 500) }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    await deleteDocument(id)
    return jsonOk({ deleted: true })
  } catch { return jsonError('Error al eliminar proyecto', 500) }
}
