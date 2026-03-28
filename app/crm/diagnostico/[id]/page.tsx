import { cachedFetch } from '@/lib/sanity.server'
import { diagnosticoByIdQuery } from '@/lib/crm/queries'
import type { CrmDiagnostico } from '@/lib/crm/types'
import { notFound } from 'next/navigation'
import DiagnosticoDetalleClient from "./DiagnosticoDetalleClient"

export default async function DiagnosticoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const diagnostico = await cachedFetch<CrmDiagnostico | null>(diagnosticoByIdQuery, { id })
  if (!diagnostico) notFound()
  return <DiagnosticoDetalleClient diagnostico={diagnostico} />
}
