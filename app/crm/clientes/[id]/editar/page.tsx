import { sanityRead } from '@/lib/sanity.server'
import { clienteByIdQuery } from '@/lib/crm/queries'
import { notFound } from 'next/navigation'
import ClienteEditarClient from './ClienteEditarClient'

export default async function ClienteEditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cliente = await sanityRead().fetch(clienteByIdQuery, { id })
  if (!cliente) notFound()
  return <ClienteEditarClient cliente={cliente} />
}
