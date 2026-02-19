import { NextRequest } from 'next/server'
import { clienteByIdQuery } from '@/lib/crm/queries'
import { clienteSchema } from '@/lib/crm/schemas'
import { fetchById, updateDocument, deleteDocument, jsonOk, jsonError } from '@/lib/crm/api-helpers'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    const data = await fetchById(clienteByIdQuery, id)
    if (!data) return jsonError('Cliente no encontrado', 404)
    return jsonOk(data)
  } catch { return jsonError('Error al obtener cliente', 500) }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    const body = await req.json()
    const parsed = clienteSchema.partial().safeParse(body)
    if (!parsed.success) return jsonError(parsed.error.issues[0].message)
    const doc = await updateDocument(id, parsed.data)
    return jsonOk(doc)
  } catch { return jsonError('Error al actualizar cliente', 500) }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    await deleteDocument(id)
    return jsonOk({ deleted: true })
  } catch { return jsonError('Error al eliminar cliente', 500) }
}
