import { NextRequest } from 'next/server'
import { sanityWrite, requireWrite } from '@/lib/sanity.server'
import { jsonOk, jsonError } from '@/lib/crm/api-helpers'

export async function POST(req: NextRequest) {
  try {
    requireWrite()
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return jsonError('No se proporcionó archivo')

    const buffer = Buffer.from(await file.arrayBuffer())
    const client = sanityWrite()
    const asset = await client.assets.upload('file', buffer, {
      filename: file.name,
      contentType: file.type,
    })

    return jsonOk({
      _id: asset._id,
      url: asset.url,
      originalFilename: asset.originalFilename,
    }, 201)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al subir archivo'
    return jsonError(message, 500)
  }
}
