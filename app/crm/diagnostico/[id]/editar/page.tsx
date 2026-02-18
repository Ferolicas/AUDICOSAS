import { sanityRead } from '@/lib/sanity.server'
import { diagnosticoByIdQuery } from '@/lib/crm/queries'
import { notFound } from 'next/navigation'
import DiagnosticoEditarClient from './DiagnosticoEditarClient'

export default async function DiagnosticoEditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const diagnostico = await sanityRead().fetch(diagnosticoByIdQuery, { id })
  if (!diagnostico) notFound()
  return <DiagnosticoEditarClient diagnostico={diagnostico} />
}
