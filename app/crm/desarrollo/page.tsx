import { cachedFetch } from '@/lib/sanity.server'
import { allDesarrolloQuery } from '@/lib/crm/queries'
import type { CrmDesarrollo } from '@/lib/crm/types'
import DesarrolloKanbanClient from "./DesarrolloKanbanClient"

export default async function DesarrolloPage() {
  const desarrollo = await cachedFetch<CrmDesarrollo[]>(allDesarrolloQuery)
  return <DesarrolloKanbanClient proyectos={desarrollo} />
}
