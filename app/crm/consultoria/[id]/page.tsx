import { cachedFetch } from '@/lib/sanity.server'
import { consultoriaByIdQuery } from '@/lib/crm/queries'
import type { CrmConsultoria } from '@/lib/crm/types'
import { notFound } from 'next/navigation'
import ConsultoriaDetalleClient from "./ConsultoriaDetalleClient"

export default async function ConsultoriaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const consultoria = await cachedFetch<CrmConsultoria | null>(consultoriaByIdQuery, { id })
  if (!consultoria) notFound()
  return <ConsultoriaDetalleClient consultoria={consultoria} />
}
