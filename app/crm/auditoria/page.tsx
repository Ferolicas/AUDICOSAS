import { cachedFetch } from '@/lib/sanity.server'
import { allAuditoriasQuery } from '@/lib/crm/queries'
import type { CrmAuditoria } from '@/lib/crm/types'
import AuditoriaListaClient from "./AuditoriaListaClient"

export default async function AuditoriaPage() {
  const auditorias = await cachedFetch<CrmAuditoria[]>(allAuditoriasQuery)
  return <AuditoriaListaClient auditorias={auditorias} />
}
