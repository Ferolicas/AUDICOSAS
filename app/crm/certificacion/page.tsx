"use client"

import { useCrmData } from "@/components/crm/providers/SWRProvider"
import CertificacionPipelineClient from "./CertificacionPipelineClient"

export default function CertificacionPage() {
  const { certificaciones } = useCrmData()
  return <CertificacionPipelineClient certificaciones={certificaciones} />
}
