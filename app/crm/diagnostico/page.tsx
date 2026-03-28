import { cachedFetch } from '@/lib/sanity.server'
import { allDiagnosticosQuery } from '@/lib/crm/queries'
import type { CrmDiagnostico } from '@/lib/crm/types'
import DiagnosticoListaClient from "./DiagnosticoListaClient"

export default async function DiagnosticoPage() {
  const diagnosticos = await cachedFetch<CrmDiagnostico[]>(allDiagnosticosQuery)
  return <DiagnosticoListaClient diagnosticos={diagnosticos} />
}
