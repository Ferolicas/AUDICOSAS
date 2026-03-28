import { cachedFetch } from '@/lib/sanity.server'
import { clienteByIdQuery } from '@/lib/crm/queries'
import type { CrmCliente } from '@/lib/crm/types'
import { notFound } from 'next/navigation'
import ClienteDetalleClient from "./ClienteDetalleClient"
import groq from 'groq'

export default async function ClienteDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [cliente, diagnosticos, auditorias, certsCrm, consultorias] = await Promise.all([
    cachedFetch<CrmCliente | null>(clienteByIdQuery, { id }),
    cachedFetch<Array<{ _id: string; codigo: string; estado: string; fechaVisita: string; normas: string[]; inversionEstimada?: number }>>(
      groq`*[_type == "crmDiagnostico" && cliente._ref == $id] | order(fechaVisita desc) { _id, codigo, estado, fechaVisita, normas, inversionEstimada }`,
      { id }
    ),
    cachedFetch<Array<{ _id: string; codigo: string; estado: string; tipo: string; fechaInicio: string }>>(
      groq`*[_type == "crmAuditoria" && cliente._ref == $id] | order(fechaInicio desc) { _id, codigo, estado, tipo, fechaInicio }`,
      { id }
    ),
    cachedFetch<Array<{ _id: string; codigo: string; estado: string; normas: string[]; avanceGlobal: number }>>(
      groq`*[_type == "crmCertificacion" && cliente._ref == $id] | order(fechaInicio desc) { _id, codigo, estado, normas, avanceGlobal }`,
      { id }
    ),
    cachedFetch<Array<{ _id: string; codigo: string; estado: string; tipo: string; avance: number }>>(
      groq`*[_type == "crmConsultoria" && cliente._ref == $id] | order(fechaInicio desc) { _id, codigo, estado, tipo, avance }`,
      { id }
    ),
  ])

  if (!cliente) notFound()

  return (
    <ClienteDetalleClient
      cliente={cliente}
      diagnosticos={diagnosticos ?? []}
      auditorias={auditorias ?? []}
      certificaciones_crm={certsCrm ?? []}
      consultorias={consultorias ?? []}
    />
  )
}
