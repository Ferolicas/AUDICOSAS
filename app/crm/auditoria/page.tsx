"use client"

import { useCrmData } from "@/components/crm/providers/SWRProvider"
import AuditoriaListaClient from "./AuditoriaListaClient"

export default function AuditoriaPage() {
  const { auditorias } = useCrmData()
  return <AuditoriaListaClient auditorias={auditorias} />
}
