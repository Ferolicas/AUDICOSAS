import { cachedFetch } from '@/lib/sanity.server'
import { certificacionByIdQuery, clienteByIdQuery } from '@/lib/crm/queries'
import { notFound } from 'next/navigation'
import DocumentoClient from './DocumentoClient'

const FASES_VALIDAS = ['1', '2', '3', '4', '5', '6']

export default async function DocumentoPage({ params }: { params: Promise<{ fase: string; id: string }> }) {
  const { fase, id } = await params
  if (!FASES_VALIDAS.includes(fase)) notFound()

  const certificacion = await cachedFetch(certificacionByIdQuery, { id })
  if (!certificacion) notFound()

  const clienteRef = certificacion.cliente?._ref || certificacion.cliente?._id
  const cliente = clienteRef
    ? await cachedFetch(clienteByIdQuery, { id: clienteRef })
    : null

  return <DocumentoClient fase={parseInt(fase)} certificacion={certificacion} cliente={cliente} />
}
