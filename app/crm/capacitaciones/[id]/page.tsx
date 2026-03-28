import { cachedFetch } from '@/lib/sanity.server'
import { capacitacionByIdQuery } from '@/lib/crm/queries'
import type { CrmCapacitacion } from '@/lib/crm/types'
import { notFound } from 'next/navigation'
import CapacitacionDetalleClient from "./CapacitacionDetalleClient"

export default async function CapacitacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const capacitacion = await cachedFetch<CrmCapacitacion | null>(capacitacionByIdQuery, { id })
  if (!capacitacion) notFound()
  return <CapacitacionDetalleClient capacitacion={capacitacion} />
}
