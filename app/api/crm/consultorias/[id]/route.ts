import { NextRequest } from 'next/server'
import { consultoriaByIdQuery } from '@/lib/crm/queries'
import { fetchById, updateDocument, deleteDocument, jsonOk, jsonError } from '@/lib/crm/api-helpers'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  const data = await fetchById(consultoriaByIdQuery, id)
  if (!data) return jsonError('Consultoría no encontrada', 404)
  return jsonOk(data)
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  const body = await req.json()
  const doc = await updateDocument(id, body)
  return jsonOk(doc)
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  await deleteDocument(id)
  return jsonOk({ deleted: true })
}
