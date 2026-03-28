import { cachedFetch } from '@/lib/sanity.server'
import { allAuditoriasQuery } from '@/lib/crm/queries'
import type { CrmAuditoria } from '@/lib/crm/types'
import AuditoriaProgramaClient from "./AuditoriaProgramaClient"

export default async function AuditoriaProgramaPage() {
  const auditorias = await cachedFetch<CrmAuditoria[]>(allAuditoriasQuery)
  return <AuditoriaProgramaClient auditorias={auditorias} />
}
