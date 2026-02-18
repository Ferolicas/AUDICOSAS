import { sanityRead } from '@/lib/sanity.server'
import { desarrolloByIdQuery } from '@/lib/crm/queries'
import { notFound } from 'next/navigation'
import DesarrolloEditarClient from './DesarrolloEditarClient'

export default async function DesarrolloEditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const desarrollo = await sanityRead().fetch(desarrolloByIdQuery, { id })
  if (!desarrollo) notFound()
  return <DesarrolloEditarClient desarrollo={desarrollo} />
}
