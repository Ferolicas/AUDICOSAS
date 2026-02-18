import { sanityRead } from '@/lib/sanity.server'
import { auditoriaByIdQuery } from '@/lib/crm/queries'
import { notFound } from 'next/navigation'
import AuditoriaEditarClient from './AuditoriaEditarClient'

export default async function AuditoriaEditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auditoria = await sanityRead().fetch(auditoriaByIdQuery, { id })
  if (!auditoria) notFound()
  return <AuditoriaEditarClient auditoria={auditoria} />
}
