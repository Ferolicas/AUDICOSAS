import { cachedFetch } from '@/lib/sanity.server'
import { auditoriaByIdQuery } from '@/lib/crm/queries'
import type { CrmAuditoria } from '@/lib/crm/types'
import { notFound } from 'next/navigation'
import AuditoriaDetalleClient from "./AuditoriaDetalleClient"

export default async function AuditoriaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auditoria = await cachedFetch<CrmAuditoria | null>(auditoriaByIdQuery, { id })
  if (!auditoria) notFound()
  return <AuditoriaDetalleClient auditoria={auditoria} />
}
