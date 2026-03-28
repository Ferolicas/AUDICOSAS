import { sanityRead } from '@/lib/sanity.server'
import { certificacionByIdQuery } from '@/lib/crm/queries'
import { notFound } from 'next/navigation'
import groq from 'groq'
import GapAnalysisClient from './GapAnalysisClient'
import type { CrmCertificacion } from '@/lib/crm/types'

const gapByCertQuery = groq`*[_type == "crmGapAnalysis" && certId == $certId][0]`

export default async function GapAnalysisPage({ params }: { params: Promise<{ certId: string }> }) {
  const { certId } = await params
  const [cert, existing] = await Promise.all([
    sanityRead().fetch<CrmCertificacion>(certificacionByIdQuery, { id: certId }),
    sanityRead().fetch(gapByCertQuery, { certId }),
  ])

  if (!cert) notFound()

  return <GapAnalysisClient certId={certId} cert={cert} existing={existing || null} />
}
