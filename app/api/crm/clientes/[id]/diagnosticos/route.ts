import { NextRequest } from 'next/server'
import { sanityRead } from '@/lib/sanity.server'
import { jsonOk, jsonError } from '@/lib/crm/api-helpers'
import groq from 'groq'

const diagnosticosByClienteQuery = groq`*[_type == "crmDiagnostico" && cliente._ref == $id] | order(fechaVisita desc) {
  _id, codigo, normas, fechaVisita, estado, inversionEstimada
}`

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    const diagnosticos = await sanityRead().fetch(diagnosticosByClienteQuery, { id })
    return jsonOk({ diagnosticos: diagnosticos || [] })
  } catch {
    return jsonError('Error al obtener diagnosticos del cliente', 500)
  }
}
