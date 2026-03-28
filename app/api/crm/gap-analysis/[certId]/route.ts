import { NextRequest } from 'next/server'
import { sanityRead, sanityWrite, requireWrite } from '@/lib/sanity.server'
import { jsonOk, jsonError } from '@/lib/crm/api-helpers'
import groq from 'groq'

const gapByCertQuery = groq`*[_type == "crmGapAnalysis" && certId == $certId][0]`

export async function GET(_: NextRequest, { params }: { params: Promise<{ certId: string }> }) {
  try {
    const { certId } = await params
    const data = await sanityRead().fetch(gapByCertQuery, { certId })
    return jsonOk(data || null)
  } catch {
    return jsonError('Error al obtener diagnóstico GAP', 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ certId: string }> }) {
  try {
    requireWrite()
    const { certId } = await params
    const body = await req.json()
    const client = sanityWrite()

    const existing = await client.fetch<{ _id: string } | null>(gapByCertQuery, { certId })

    let result
    if (existing) {
      result = await client.patch(existing._id).set({ ...body, certId }).commit()
    } else {
      result = await client.create({ _type: 'crmGapAnalysis', certId, ...body })
    }

    return jsonOk(result)
  } catch {
    return jsonError('Error al guardar diagnóstico GAP', 500)
  }
}
