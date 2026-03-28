import { cachedFetch } from '@/lib/sanity.server'
import { certificacionByIdQuery } from '@/lib/crm/queries'
import type { CrmCertificacion } from '@/lib/crm/types'
import { notFound } from 'next/navigation'
import CertificacionDetalleClient from "./CertificacionDetalleClient"

export default async function CertificacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const certificacion = await cachedFetch<CrmCertificacion | null>(certificacionByIdQuery, { id })
  if (!certificacion) notFound()
  return <CertificacionDetalleClient certificacion={certificacion} />
}
