import { sanityRead } from '@/lib/sanity.server'
import { capacitacionByIdQuery } from '@/lib/crm/queries'
import { notFound } from 'next/navigation'
import CapacitacionEditarClient from './CapacitacionEditarClient'

export default async function CapacitacionEditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const capacitacion = await sanityRead().fetch(capacitacionByIdQuery, { id })
  if (!capacitacion) notFound()
  return <CapacitacionEditarClient capacitacion={capacitacion} />
}
