import { cachedFetch } from '@/lib/sanity.server'
import { allConsultoriasQuery } from '@/lib/crm/queries'
import type { CrmConsultoria } from '@/lib/crm/types'
import ConsultoriaListaClient from "./ConsultoriaListaClient"

export default async function ConsultoriaPage() {
  const consultorias = await cachedFetch<CrmConsultoria[]>(allConsultoriasQuery)
  return <ConsultoriaListaClient consultorias={consultorias} />
}
