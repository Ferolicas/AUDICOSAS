import { cachedFetch } from '@/lib/sanity.server'
import { allCapacitacionesQuery } from '@/lib/crm/queries'
import type { CrmCapacitacion } from '@/lib/crm/types'
import CapacitacionesListaClient from "./CapacitacionesListaClient"

export default async function CapacitacionesPage() {
  const capacitaciones = await cachedFetch<CrmCapacitacion[]>(allCapacitacionesQuery)
  return <CapacitacionesListaClient capacitaciones={capacitaciones} />
}
