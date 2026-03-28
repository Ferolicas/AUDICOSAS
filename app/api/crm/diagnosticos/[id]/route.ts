import { NextRequest } from 'next/server'
import { diagnosticoByIdQuery } from '@/lib/crm/queries'
import { fetchById, updateDocument, deleteDocument, jsonOk, jsonError } from '@/lib/crm/api-helpers'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    const data = await fetchById(diagnosticoByIdQuery, id)
    if (!data) return jsonError('Diagnóstico no encontrado', 404)
    return jsonOk(data)
  } catch { return jsonError('Error al obtener diagnóstico', 500) }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    const body = await req.json()
    const doc = await updateDocument(id, body, 'crmDiagnostico')
    return jsonOk(doc)
  } catch { return jsonError('Error al actualizar diagnóstico', 500) }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    await deleteDocument(id, 'crmDiagnostico')
    return jsonOk({ deleted: true })
  } catch { return jsonError('Error al eliminar diagnóstico', 500) }
}
