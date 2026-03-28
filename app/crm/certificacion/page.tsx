import { cachedFetch } from '@/lib/sanity.server'
import { allCertificacionesQuery } from '@/lib/crm/queries'
import type { CrmCertificacion } from '@/lib/crm/types'
import CertificacionPipelineClient from "./CertificacionPipelineClient"

export default async function CertificacionPage() {
  const certificaciones = await cachedFetch<CrmCertificacion[]>(allCertificacionesQuery)
  return <CertificacionPipelineClient certificaciones={certificaciones} />
}
