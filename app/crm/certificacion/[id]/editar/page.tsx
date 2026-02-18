import { sanityRead } from '@/lib/sanity.server'
import { certificacionByIdQuery } from '@/lib/crm/queries'
import { notFound } from 'next/navigation'
import CertificacionEditarClient from './CertificacionEditarClient'

export default async function CertificacionEditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const certificacion = await sanityRead().fetch(certificacionByIdQuery, { id })
  if (!certificacion) notFound()
  return <CertificacionEditarClient certificacion={certificacion} />
}
