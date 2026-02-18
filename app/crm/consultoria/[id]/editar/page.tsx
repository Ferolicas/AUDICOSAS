import { sanityRead } from '@/lib/sanity.server'
import { consultoriaByIdQuery } from '@/lib/crm/queries'
import { notFound } from 'next/navigation'
import ConsultoriaEditarClient from './ConsultoriaEditarClient'

export default async function ConsultoriaEditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const consultoria = await sanityRead().fetch(consultoriaByIdQuery, { id })
  if (!consultoria) notFound()
  return <ConsultoriaEditarClient consultoria={consultoria} />
}
