import { NextRequest, NextResponse } from 'next/server'
import { sanityWrite } from '@/lib/sanity.server'

export async function DELETE(req: NextRequest) {
  try {
    const { docId, key, assetId } = await req.json()

    if (!docId || !key) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    const client = sanityWrite()

    // Eliminar el asset de Sanity
    if (assetId) {
      await client.delete(assetId).catch(() => { /* ignorar si ya no existe */ })
    }

    // Remover el ítem del array documentos
    await client
      .patch(docId)
      .unset([`documentos[_key=="${key}"]`])
      .commit()

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Delete error:', err)
    return NextResponse.json({ error: 'Error al eliminar el documento' }, { status: 500 })
  }
}
