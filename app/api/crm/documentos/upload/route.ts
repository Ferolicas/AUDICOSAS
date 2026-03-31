import { NextRequest, NextResponse } from 'next/server'
import { sanityWrite } from '@/lib/sanity.server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const docId = formData.get('docId') as string
    const file = formData.get('file') as File

    if (!docId || !file) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'

    const client = sanityWrite()

    // Subir el archivo a Sanity Assets
    const asset = await client.assets.upload('file', buffer, {
      filename: file.name,
      contentType: file.type,
    })

    // Agregar referencia al documento
    await client
      .patch(docId)
      .setIfMissing({ documentos: [] })
      .append('documentos', [{
        _key: crypto.randomUUID(),
        nombre: file.name,
        url: asset.url,
        assetId: asset._id,
        fechaSubida: new Date().toISOString(),
        tipo: ext,
      }])
      .commit()

    return NextResponse.json({ ok: true, url: asset.url, nombre: file.name })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 })
  }
}
