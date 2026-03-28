import { cachedFetch } from '@/lib/sanity.server'
import { clienteByIdQuery } from '@/lib/crm/queries'
import type { CrmCliente } from '@/lib/crm/types'
import { notFound } from 'next/navigation'
import ClienteDetalleClient from "./ClienteDetalleClient"

export default async function ClienteDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cliente = await cachedFetch<CrmCliente | null>(clienteByIdQuery, { id })
  if (!cliente) notFound()
  return <ClienteDetalleClient cliente={cliente} />
}
